require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectToDb } = require("./config/mongodb.js");
require("./gameService.js");
// import routes
const userRoute = require("./routes/userRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");
const betRoute = require("./routes/betRoute.js");
const adminRoute = require("./routes/adminRoute.js")

// import models
const game = require("./models/game.js");

// import middleware
const { checkLoggedIN } = require("./middleware/checkLoggedIn.js");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://winnersclubs.fun",
      "https://api.winnersclubs.fun"
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
// Fetch last 1 closed result for a specific gameType
app.get("/api/latest/oneresult/:gameType", async (req, res) => {
  const { gameType } = req.params;

  if (!["30sec", "1min", "3min"].includes(gameType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid game type" });
  }

  try {
    const result = await game
      .findOne({ status: "closed", gameType })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, result });
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

app.use("/api/users", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/bet", betRoute);
app.use("/api/admin",adminRoute)


// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Global Error:", err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// server listen

connectToDb().then(() => {
  app.listen(8080, () => {
    console.log("server actiavte ho gya hai");
  });
});
