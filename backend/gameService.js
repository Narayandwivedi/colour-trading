const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
const cron = require("node-cron");

// Constants
const Colours = ["red", "green"];
const GAME_TYPES = {
  '30sec': {
    interval: 30000,
    cronPattern: "*/30 * * * * *",
    typeCode: "30"
  },
  '1min': {
    interval: 60000,
    cronPattern: "0 * * * * *",
    typeCode: "60"
  },
  '3min': {
    interval: 180000,
    cronPattern: "0 */3 * * * *",
    typeCode: "180"
  }
};

// Game state tracking
const gameStates = {
  '30sec': { isRunning: false, pendingExecution: false },
  '1min': { isRunning: false, pendingExecution: false },
  '3min': { isRunning: false, pendingExecution: false }
};

// Counters
const periodCounters = {
  '30sec': 1,
  '1min': 1,
  '3min': 1
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
    String(counter)
  ].join("");
}

// Process game results
async function processGame(gameInstance, gameType) {
  try {
    gameInstance.colour = Colours[Math.floor(Math.random() * Colours.length)];
    gameInstance.status = "closed";
    await gameInstance.save();

    const bets = await bet.find({ period: gameInstance.period }).lean();
    if (bets.length === 0) {
      console.log(`No bets to process for period ${gameInstance.period}`);
    }

    if (bets.length > 0) {
      await Promise.all([
        bet.bulkWrite(bets.map(bet => ({
          updateOne: {
            filter: { _id: bet._id },
            update: {
              status: bet.betColour === gameInstance.colour ? "won" : "lost",
              payout: bet.betColour === gameInstance.colour ? bet.betAmount * 2 : 0
            }
          }
        }))),
        User.bulkWrite(bets.map(bet => ({
          updateOne: {
            filter: { _id: bet.userId },
            update: {
              $inc: {
                balance: bet.betColour === gameInstance.colour
                  ? bet.betAmount * 2
                  : 0
              }
            }
          }
        })))
      ]);
    }

    console.log(`[${new Date().toISOString()}] ${gameType} game closed: ${gameInstance.period}`);
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
  Object.keys(GAME_TYPES).forEach(gameType => {
    cron.schedule(
      GAME_TYPES[gameType].cronPattern,
      () => executeGameRound(gameType),
      {
        scheduled: true,
        timezone: "UTC"
      }
    );
    console.log(`Scheduler started for ${gameType} games`);
  });
}

// Initialize
startAllGameSchedulers();
console.log("Game engine started - using node-cron with guaranteed execution");
