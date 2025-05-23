const game = require("./models/game");
const bet = require("./models/bet");
const User = require("./models/user");
const cron = require("node-cron");

// Constants
const COLOURS = ["red", "green"];
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

async function getRandomColour(period) {
  try {
    // Use aggregation to get totals in a single query
    const result = await bet.aggregate([
      { $match: { period } },
      {
        $group: {
          _id: "$betColour",
          totalAmount: { $sum: "$betAmount" }
        }
      }
    ]);

    // Convert to map for easier access
    const totals = result.reduce((acc, { _id, totalAmount }) => {
      acc[_id] = totalAmount;
      return acc;
    }, {});

    // Default to 0 if no bets for a color
    const betOnRed = totals.red || 0;
    const betOnGreen = totals.green || 0;

    // Your logic: select opposite of the color with more bets
    return betOnGreen > betOnRed ? "red" : "green";
  } catch (error) {
    console.error("Error determining color:", error);
    // Fallback to random if there's an error
    return COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

async function closeGame(game) {
  try {
    game.colour = await getRandomColour(game.period);
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