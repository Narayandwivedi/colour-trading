const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
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

// Generate colour based on bet amount

async function getRandomOutcome(period) {
  try {
    const result = await bet.aggregate([
      {
        $match: { period },
      },
      {
        $group: {
          _id: {
            colour: "$betColour",
            size: "$betSize",
          },
          totalAmount: { $sum: "$betAmount" },
        },
      },
    ]);

    let betOnRed = 0,
      betOnGreen = 0;
    let betOnBig = 0,
      betOnSmall = 0;

    for (const entry of result) {
      const { colour, size } = entry._id;
      const total = entry.totalAmount;

      if (colour === "red") betOnRed = total;
      else if (colour === "green") betOnGreen = total;

      if (size === "big") betOnBig = total;
      else if (size === "small") betOnSmall = total;
    }

    // Randomize if equal or no bets
    const finalColour =
      betOnGreen === betOnRed
        ? Math.random() < 0.5
          ? "red"
          : "green"
        : betOnGreen > betOnRed
        ? "red"
        : "green";

    const finalSize =
      betOnBig === betOnSmall
        ? Math.random() < 0.5
          ? "big"
          : "small"
        : betOnBig > betOnSmall
        ? "small"
        : "big";

    const randomNum = Math.floor(Math.random() * 10); // generates integer from 0 to 9

    return { colour: finalColour, size: finalSize, number: randomNum };
  } catch (error) {
    console.error("Error determining outcomes:", error);
    return {
      colour: Math.random() < 0.5 ? "red" : "green",
      size: Math.random() < 0.5 ? "big" : "small",
    };
  }
}

// Process game results
async function processGame(gameInstance, gameType) {
  try {
    const { colour, size, number } = await getRandomOutcome(
      gameInstance.period
    );

    gameInstance.colour = colour;
    gameInstance.size = size;
    gameInstance.number = number;
    gameInstance.status = "closed";
    console.log(gameInstance);

    await gameInstance.save();

    const bets = await bet.find({ period: gameInstance.period }).lean();
    if (bets.length === 0) {
      console.log(`No bets to process for period ${gameInstance.period}`);
    }

    if (bets.length > 0) {
      await Promise.all([
        bet.bulkWrite(
          bets.map((bet) => {
            let isWinner = false;
            const betResult = bet.betColour ? colour : (bet.betSize ? size : null);

            if (bet.betColour && bet.betColour === colour) {
              isWinner = true;
            } else if (bet.betSize && bet.betSize === size) {
              isWinner = true;
            }

            return {
              updateOne: {
                filter: { _id: bet._id },
                update: {
                  status: isWinner ? "won" : "lost",
                  payout: isWinner ? bet.betAmount * 2 : 0,
                  betResult 

                },
              },
            };
          })
        ),

        User.bulkWrite(
          bets.map((bet) => {
            let isWinner = false;

            if (bet.betColour && bet.betColour === colour) {
              isWinner = true;
            } else if (bet.betSize && bet.betSize === size) {
              isWinner = true;
            }

            return {
              updateOne: {
                filter: { _id: bet.userId },
                update: {
                  $inc: {
                    balance: isWinner ? bet.betAmount * 2 : 0,
                    withdrawableBalance: isWinner ? bet.betAmount * 2 : 0,
                  },
                },
              },
            };
          })
        ),
      ]);
    }

    console.log(
      `[${new Date().toISOString()}] ${gameType} game closed: ${
        gameInstance.period
      }`
    );
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

    console.log(
      `[${new Date().toISOString()}] ${gameType} game opened: ${period}`
    );

    setTimeout(
      () => processGame(newGame, gameType),
      GAME_TYPES[gameType].interval
    );
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
