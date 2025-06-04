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

// import models
const game = require("./models/game.js");

// import middleware
const { checkLoggedIN } = require("./middleware/checkLoggedIn.js");

app.use(
  cors({
    origin: [
      "https://colour-trading.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://168.231.120.131"
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", checkLoggedIN, (req, res) => {
  res.send("web api is working fine");
});

// Fetch last 30 closed results for a specific gameType
app.get("/api/latest/result/:gameType", async (req, res) => {
  const { gameType } = req.params;

  if (!["30sec", "1min", "3min"].includes(gameType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid game type" });
  }
  try {
    const results = await game
      .find({gameType , status: "closed" })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({ success: true, results });
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

// server listen

connectToDb().then(() => {
  app.listen(8080, () => {
    console.log("server actiavte ho gya hai");
  });
});
