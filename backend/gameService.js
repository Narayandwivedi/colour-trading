const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
const cron = require("node-cron");

// Constants
const COLOURS = ["red", "green"];
let num = 1;

async function generatePeriodId() {
  try {
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      now.getHours(),
      num,
    ].join("");

    return `${timestamp}`;
  } catch (error) {
    console.error("Error generating period ID:", error);
    throw error;
  }
}

function getRandomColour() {
  return COLOURS[Math.floor(Math.random() * COLOURS.length)];
}

async function executeGameRound() {
  try {
    const period = await generatePeriodId();
    const newGame = await game.create({
      period,
    });
    console.log(
      `[${new Date().toISOString()}] Game opened:`,
      period,
      `game status : ${newGame.status}`
    );
    num++;

    // Schedule game closing
    setTimeout(async () => {
      newGame.colour = getRandomColour();
      newGame.status = "closed";
      const saved = await newGame.save();

      const allBet = await bet.find({ period });
      if (allBet.length > 0) {
        const bulkBetUpdates = [];
        const bulkUserUpdates = [];

        for (const singleBet of allBet) {
          const isWinner = singleBet.betColour === newGame.colour;

          // Update bet status
          bulkBetUpdates.push({
            updateOne: {
              filter: { _id: singleBet._id },
              update: {
                $set: {
                  status: isWinner ? "won" : "lost",
                  result: isWinner ? "win" : "lose",
                  payout: isWinner ? singleBet.betAmount * 2 : 0,
                },
              },
            },
          });

          // Prepare user balance update if won
          if (isWinner) {
            bulkUserUpdates.push({
              updateOne: {
                filter: { _id: singleBet.userId },
                update: {
                  $inc: { balance: singleBet.betAmount * 2 },
                },
              },
            });
          }
        }

        // Execute all updates
        if (bulkBetUpdates.length > 0) {
          await bet.bulkWrite(bulkBetUpdates);
        }
        if (bulkUserUpdates.length > 0) {
          await User.bulkWrite(bulkUserUpdates);
        }

        console.log(
          `Updated ${bulkBetUpdates.length} bets and ${bulkUserUpdates.length} user balances`
        );
      }

      console.log(
        `[${new Date().toISOString()}] Game closed:`,
        period,
        "Colour:",
        newGame.colour
      );
    }, 30000);
  } catch (error) {
    console.error("Error in game round:", error);
  }
}

// Schedule game rounds every 30 seconds
// Cron pattern: seconds(0-59) minutes(0-59) hours(0-23) day-of-month(1-31) month(1-12) day-of-week(0-7)
cron.schedule("*/30 * * * * *", executeGameRound, {
  scheduled: true,
  timezone: "UTC", // Specify your timezone if needed
});

console.log("Game scheduler started - running every 30 seconds");