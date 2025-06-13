const User = require("../models/user")
const Bet = require("../models/bet")
const express = require('express');
const router = express.Router()
const Transaction = require("../models/transcationModel")


router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Today range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Last 7 days range
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // includes today

    // Aggregate for today
    const betsToday = await Bet.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: null,
          totalBetAmount: { $sum: "$betAmount" },
          betCount: { $sum: 1 }
        }
      }
    ]);

    // Aggregate for last 7 days
    const betsLast7Days = await Bet.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: null,
          totalBetAmount: { $sum: "$betAmount" },
          betCount: { $sum: 1 }
        }
      }
    ]);


    // deposit today

    const depositsToday = await Transaction.aggregate([
  {
    $match: {
      type: "deposit",
      status: "success",
      createdAt: { $gte: today, $lt: tomorrow }
    }
  },
  {
    $group: {
      _id: null,
      totalAmount: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  }
]);

// deposit last 7 day

const depositsLast7Days = await Transaction.aggregate([
  {
    $match: {
      type: "deposit",
      status: "success",
      createdAt: { $gte: sevenDaysAgo }
    }
  },
  {
    $group: {
      _id: null,
      totalAmount: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  }
]);

    res.json({
      totalUsers,
      betToday: {
        totalAmount: betsToday[0]?.totalBetAmount || 0,
        totalCount: betsToday[0]?.betCount || 0,
      },
      betLast7Days: {
        totalAmount: betsLast7Days[0]?.totalBetAmount || 0,
        totalCount: betsLast7Days[0]?.betCount || 0,
      },

      depositsToday :depositsToday[0]?.totalAmount||0,
      depositsLast7Days :depositsLast7Days[0]?.totalAmount ||0

    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router