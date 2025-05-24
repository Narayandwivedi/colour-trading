const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
const cron = require("node-cron");

// Constants
const Colours = ["red","green"]
let num = 1;

async function generatePeriodId() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    now.getHours(),
    num,
  ].join("");
}


// generate random colour based on bets

   function getRandomColour() {
    const colour = Colours[Math.floor(Math.random()*Colours.length)]
    return colour
}

async function closeGame(game) {
  try {
    game.colour = getRandomColour();
    game.status = "closed";
    await game.save();

    const bets = await bet.find({ period: game.period }).lean();

    if (bets.length === 0) {
      console.log(`No bets to process for period ${game.period}`);
      return;
    }

    // Prepare bulk operations
    const betUpdates = [];
    const userUpdates = [];

    bets.forEach(singleBet => {
      const isWinner = singleBet.betColour === game.colour;
      const payout = isWinner ? singleBet.betAmount * 2 : 0;

      betUpdates.push({
        updateOne: {
          filter: { _id: singleBet._id },
          update: {
            status: isWinner ? "won" : "lost",
            result: isWinner ? "win" : "lose",
            payout
          }
        }
      });

      if (isWinner) {
        userUpdates.push({
          updateOne: {
            filter: { _id: singleBet.userId },
            update: { $inc: { balance: payout } }
          }
        });
      }
    });

    // Execute updates in parallel
    await Promise.all([
      betUpdates.length > 0 ? bet.bulkWrite(betUpdates) : Promise.resolve(),
      userUpdates.length > 0 ? User.bulkWrite(userUpdates) : Promise.resolve()
    ]);

    console.log(`Processed ${betUpdates.length} bets and ${userUpdates.length} user updates`);
  } catch (error) {
    console.error("Error closing game:", error);
    throw error;
  }
}

async function executeGameRound() {
  try {
    const period = await generatePeriodId();
    const newGame = await game.create({ period });
    num++;

    console.log(`[${new Date().toISOString()}] Game opened:`, period);

    // Schedule game closing with error handling
    setTimeout(async () => {
      try {
        await closeGame(newGame);
        console.log(
          `[${new Date().toISOString()}] Game closed:`,
          period,
          "Colour:",
          newGame.colour
        );
      } catch (error) {
        console.error("Error in game closing:", error);
      }
    }, 30000);
  } catch (error) {
    console.error("Error in game round:", error);
  }
}

// Start scheduler
cron.schedule("*/30 * * * * *", executeGameRound, {
  scheduled: true,
  timezone: "UTC"
});

console.log("Game scheduler started - running every 30 seconds");