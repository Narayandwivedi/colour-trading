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

app.use(
  cors({
    origin: [
      "https://colour-trading.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("web api is working fine");
});

app.get("/api/latest/result", async (req, res) => {
  try {
    const results = await game
      .find({ status: "closed" })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(30) // Limit to 30 results
      .lean();

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});
app.get("/api/latest/period", async (req, res) => {
  try {
    const latestPeriod = await game
      .find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
    res.json({ success: true, latestPeriod});
  } catch {
    res.status.json({
      success: false,
      message: "some error while fetching period",
    });
  }
});

app.use("/api/users", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/bet", betRoute);

// server listen

connectToDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server actiavte ho gya hai");
  });
});
