const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
const AdminResult = require("./models/AdminResult"); // Add AdminResult model
const cron = require("node-cron");

// Constants
const Colours = ["red", "green"];
const GAME_TYPES = {
  "30sec": {
    interval: 30000,
    cronPattern: "*/30 * * * * *",
    typeCode: "30",
  },
  "1min": {
    interval: 60000,
    cronPattern: "0 * * * * *",
    typeCode: "60",
  },
  "3min": {
    interval: 180000,
    cronPattern: "0 */3 * * * *",
    typeCode: "180",
  },
};

// Game state tracking
const gameStates = {
  "30sec": { isRunning: false, pendingExecution: false },
  "1min": { isRunning: false, pendingExecution: false },
  "3min": { isRunning: false, pendingExecution: false },
};

// Counters
const periodCounters = {
  "30sec": 1,
  "1min": 1,
  "3min": 1,
};

// Generate period ID
async function generatePeriodId(gameType) {
  const now = new Date();

  if (periodCounters[gameType] >= 999) {
    periodCounters[gameType] = 1;
  }

  const counter = periodCounters[gameType]++;
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    GAME_TYPES[gameType].typeCode,
    String(counter),
  ].join("");
}

// Helper function to calculate random number based on betting data
function calculateRandomNumber(betOnNumbers) {
  const totalNumberBets = Object.values(betOnNumbers).reduce((sum, amount) => sum + amount, 0);
  
  if (totalNumberBets === 0) {
    // No number bets, completely random
    return Math.floor(Math.random() * 10);
  } else {
    // Find numbers with highest bets and avoid them
    const maxBet = Math.max(...Object.values(betOnNumbers));
    const highestBetNumbers = Object.keys(betOnNumbers).filter(num => betOnNumbers[num] === maxBet);
    
    // Create array of numbers with lower bets
    const availableNumbers = [];
    for (let i = 0; i < 10; i++) {
      if (!highestBetNumbers.includes(i.toString())) {
        availableNumbers.push(i);
      }
    }
    
    // If all numbers have equal bets or no available numbers, choose randomly
    if (availableNumbers.length === 0) {
      return Math.floor(Math.random() * 10);
    } else {
      return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    }
  }
}

// Helper function to calculate random colour based on betting data
function calculateRandomColour(betOnRed, betOnGreen) {
  if (betOnRed + betOnGreen === 0) {
    return Math.random() < 0.5 ? "red" : "green";
  } else if (betOnGreen === betOnRed && betOnRed > 0) {
    return Math.random() < 0.5 ? "violetRed" : "violetGreen";
  } else {
    return betOnGreen > betOnRed ? "red" : "green";
  }
}

// Helper function to calculate random size based on betting data
function calculateRandomSize(betOnBig, betOnSmall) {
  return betOnBig === betOnSmall
    ? Math.random() < 0.5 ? "big" : "small"
    : betOnBig > betOnSmall ? "small" : "big";
}

// Generate outcome based on bet amounts with admin result integration
async function getRandomOutcome(period) {
  try {
    // 1. First check if admin result exists for this period
    const adminResult = await AdminResult.findOne({ 
      period, 
      isActive: true 
    });

    // 2. Get betting data (same as current)
    const result = await bet.aggregate([
      {
        $match: { period },
      },
      {
        $group: {
          _id: {
            colour: "$betColour",
            size: "$betSize",
            number: "$betNumber",
          },
          totalAmount: { $sum: "$betAmount" },
        },
      },
    ]);

    // Calculate bet totals (same as current logic)
    let betOnRed = 0, betOnGreen = 0;
    let betOnBig = 0, betOnSmall = 0;
    let betOnNumbers = {}; // Track bets on specific numbers

    for (const entry of result) {
      const { colour, size, number } = entry._id;
      const total = entry.totalAmount;

      if (colour === "red") betOnRed = total;
      else if (colour === "green") betOnGreen = total;

      if (size === "big") betOnBig = total;
      else if (size === "small") betOnSmall = total;

      // Track number bets
      if (number !== null && number !== undefined) {
        betOnNumbers[number] = (betOnNumbers[number] || 0) + total;
      }
    }

    // 3. Determine outcomes based on admin preference
    let finalColour, finalSize, finalNumber;
    
    // NUMBER: Always check admin first
    if (adminResult && adminResult.adminNumber !== null && adminResult.adminNumber !== undefined) {
      finalNumber = adminResult.adminNumber;
    } else {
      // Use existing random logic for number
      finalNumber = calculateRandomNumber(betOnNumbers);
    }
    
    // COLOUR: Use admin if available, otherwise random logic
    if (adminResult && adminResult.adminColour) {
      finalColour = adminResult.adminColour;
    } else {
      // Use existing random logic for colour
      finalColour = calculateRandomColour(betOnRed, betOnGreen);
    }
    
    // SIZE: Use admin if available, otherwise random logic
    if (adminResult && adminResult.adminSize) {
      finalSize = adminResult.adminSize;
    } else {
      // Use existing random logic for size
      finalSize = calculateRandomSize(betOnBig, betOnSmall);
    }

    // 4. Mark admin result as used (optional)
    if (adminResult) {
      await AdminResult.updateOne(
        { _id: adminResult._id },
        { isActive: false }
      );
    }

    return { colour: finalColour, size: finalSize, number: finalNumber };
    
  } catch (error) {
    console.error("Error determining outcomes:", error);
    // Fallback to completely random
    return {
      colour: Math.random() < 0.5 ? "red" : "green",
      size: Math.random() < 0.5 ? "big" : "small",
      number: Math.floor(Math.random() * 10),
    };
  }
}

// Process game results with updated payout rules
async function processGame(gameInstance, gameType) {
  try {
    const { colour, size, number } = await getRandomOutcome(gameInstance.period);

    gameInstance.colour = colour;
    gameInstance.size = size;
    gameInstance.number = number;
    gameInstance.status = "closed";
    await gameInstance.save();

    const bets = await bet.find({ period: gameInstance.period }).lean();
    if (bets.length === 0) {
      console.log(`No bets to process for period ${gameInstance.period}`);
      return;
    }

    await Promise.all([
      bet.bulkWrite(
        bets.map((bet) => {
          let isWinner = false;
          let payoutMultiplier = 0;
          let betResult = null;

          // Handle colour bets
          if (bet.betColour) {
            betResult = colour;
            // Violet outcomes
            if (colour === 'violetRed' || colour === 'violetGreen') {
              // Violet bet wins 4x
              if (bet.betColour === 'violet') {
                isWinner = true;
                payoutMultiplier = 4;
              }
              // Red bet wins 1.5x on violetRed
              else if (bet.betColour === 'red' && colour === 'violetRed') {
                isWinner = true;
                payoutMultiplier = 1.5;
              }
              // Green bet wins 1.5x on violetGreen
              else if (bet.betColour === 'green' && colour === 'violetGreen') {
                isWinner = true;
                payoutMultiplier = 1.5;
              }
            }
            // Regular outcomes
            else {
              // Exact match wins 2x
              if (bet.betColour === colour) {
                isWinner = true;
                payoutMultiplier = 2;
              }
            }
          }
          // Handle size bets (always 2x)
          else if (bet.betSize) {
            betResult = size;
            if (bet.betSize === size) {
              isWinner = true;
              payoutMultiplier = 2;
            }
          }
          // Handle number bets (9x payout)
          else if (bet.betNumber !== null && bet.betNumber !== undefined) {
            betResult = number;
            if (bet.betNumber === number) {
              isWinner = true;
              payoutMultiplier = 9; // Number betting typically has higher payout
            }
          }

          return {
            updateOne: {
              filter: { _id: bet._id },
              update: {
                status: isWinner ? "won" : "lost",
                payout: isWinner ? bet.betAmount * payoutMultiplier : 0,
                betResult
              },
            },
          };
        })
      ),
      User.bulkWrite(
        bets.map((bet) => {
          let isWinner = false;
          let payoutMultiplier = 0;

          // Same logic as above for user balance updates
          if (bet.betColour) {
            if (colour === 'violetRed' || colour === 'violetGreen') {
              if (bet.betColour === 'violet') {
                isWinner = true;
                payoutMultiplier = 4;
              }
              else if (bet.betColour === 'red' && colour === 'violetRed') {
                isWinner = true;
                payoutMultiplier = 1.5;
              }
              else if (bet.betColour === 'green' && colour === 'violetGreen') {
                isWinner = true;
                payoutMultiplier = 1.5;
              }
            }
            else if (bet.betColour === colour) {
              isWinner = true;
              payoutMultiplier = 2;
            }
          }
          else if (bet.betSize && bet.betSize === size) {
            isWinner = true;
            payoutMultiplier = 2;
          }
          // Handle number bet winnings
          else if (bet.betNumber !== null && bet.betNumber !== undefined && bet.betNumber === number) {
            isWinner = true;
            payoutMultiplier = 9;
          }

          return {
            updateOne: {
              filter: { _id: bet.userId },
              update: {
                $inc: {
                  balance: isWinner ? bet.betAmount * payoutMultiplier : 0,
                  withdrawableBalance: isWinner ? bet.betAmount * payoutMultiplier : 0,
                },
              },
            },
          };
        })
      ),
    ]);

    console.log(`[${new Date().toISOString()}] ${gameType} game closed: ${gameInstance.period} - Result: ${colour}, ${size}, ${number}`);
  } catch (error) {
    console.error(`Game processing error (${gameType}):`, error);
  } finally {
    gameStates[gameType].isRunning = false;

    if (gameStates[gameType].pendingExecution) {
      gameStates[gameType].pendingExecution = false;
      executeGameRound(gameType);
    }
  }
}

// Execute game round
async function executeGameRound(gameType) {
  if (gameStates[gameType].isRunning) {
    gameStates[gameType].pendingExecution = true;
    return;
  }

  gameStates[gameType].isRunning = true;

  try {
    const period = await generatePeriodId(gameType);
    const newGame = await game.create({ period, gameType });

    console.log(`[${new Date().toISOString()}] ${gameType} game opened: ${period}`);

    setTimeout(() => processGame(newGame, gameType), GAME_TYPES[gameType].interval);
  } catch (error) {
    console.error(`Game start failed (${gameType}):`, error);
    gameStates[gameType].isRunning = false;
  }
}

// Start all schedulers
function startAllGameSchedulers() {
  Object.keys(GAME_TYPES).forEach((gameType) => {
    cron.schedule(
      GAME_TYPES[gameType].cronPattern,
      () => executeGameRound(gameType),
      {
        scheduled: true,
        timezone: "UTC",
      }
    );
    console.log(`Scheduler started for ${gameType} games`);
  });
}

// Initialize
startAllGameSchedulers();
console.log("Game engine started - using node-cron with guaranteed execution");