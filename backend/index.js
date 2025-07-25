require("dotenv").config();
const express = require("express");
const app = express();
const { exec } = require('child_process');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require('node-cron');

const { connectToDb } = require("./config/mongodb.js");
require("./gameService.js");

console.log("server");

// import routes
const userRoute = require("./routes/userRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");
const betRoute = require("./routes/betRoute.js");
const adminRoute = require("./routes/adminRoute.js")

// import models
const game = require("./models/game.js");



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://winnersclubs.fun",
      "https://api.winnersclubs.fun",
      "https://colour-trading-admin.vercel.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


// Fetch last 30 closed results for a specific gameType
// Updated backend endpoint with pagination
app.get("/api/latest/result/:gameType", async (req, res) => {
  const { gameType } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 results per page
  
  if (!["30sec", "1min", "3min"].includes(gameType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid game type" });
  }

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const totalResults = await game.countDocuments({
      gameType,
      status: "closed"
    });

    // Get paginated results
    const results = await game
      .find({ gameType, status: "closed" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalPages = Math.ceil(totalResults / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      results,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


// Fetch currently open period for a specific gameType
app.get("/api/latest/period/:gameType", async (req, res) => {
  const { gameType } = req.params;

  if (!["30sec", "1min", "3min"].includes(gameType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid game type" });
  }

  try {
    const latestPeriod = await game
      .findOne({ status: "open", gameType })
      .lean()
      .sort({ createdAt: -1 })
      .select("period createdAt -_id");

    res.json({ success: true, latestPeriod });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some error while fetching period",
    });
  }
});


app.post('/restart-server', (req, res) => {

  exec('pm2 restart project-backend', (error, stdout, stderr) => {
     
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Failed to restart server');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
    res.send('Server restarted successfully');
  });
});


app.use("/api/users", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/bet", betRoute);
app.use("/api/admin",adminRoute)





const restartServer = () => {
  console.log(`Scheduled server restart at ${new Date().toISOString()}`);
  exec('pm2 restart project-backend', (error, stdout, stderr) => {
    if (error) {
      console.error(`Restart Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Restart Stderr: ${stderr}`);
    }
    console.log(`Restart Stdout: ${stdout}`);
    console.log('Server restarted successfully via cron job');
  });
};

cron.schedule('0 6 * * *', restartServer, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message:"Internal Server Error",
  });
});

// server listen

connectToDb().then(() => {
  app.listen(8080, () => {
    console.log("server actiavte ho gya hai");
  });
});
