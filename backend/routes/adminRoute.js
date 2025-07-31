const User = require("../models/user");
const Bet = require("../models/bet");
const express = require("express");
const router = express.Router();
const Transaction = require("../models/transcationModel");
const Withdraw = require("../models/Withdraw");
const mongoose = require("mongoose");
const AdminResult = require("../models/AdminResult");

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
          betCount: { $sum: 1 },
        },
      },
    ]);

    // Aggregate for last 7 days
    const betsLast7Days = await Bet.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: null,
          totalBetAmount: { $sum: "$betAmount" },
          betCount: { $sum: 1 },
        },
      },
    ]);

    // deposit today

    const depositsToday = await Transaction.aggregate([
      {
        $match: {
          type: "deposit",
          status: "success",
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // deposit last 7 day

    const depositsLast7Days = await Transaction.aggregate([
      {
        $match: {
          type: "deposit",
          status: "success",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
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

      depositsToday: depositsToday[0]?.totalAmount || 0,
      depositsLast7Days: depositsLast7Days[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await User.find().lean().select("-password");
    return res.json({ success: true, allUsers });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.get("/allbets", async (req, res) => {
  try {
    const allBets = await Bet.find().lean().sort({ createdAt: -1 });
    return res.json({ success: true, allBets });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

// DEPRECATED - Use /api/transaction/withdrawals instead
router.get("/allwithdraw", async (req, res) => {
  try {
    const allwithdraw = await Withdraw.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, allwithdraw });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.get("/latestBets", async (req, res) => {
  try {
    const allBets = await Bet.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, allBets });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.put("/approve-withdraw", async (req, res) => {
  try {
    const { withdrawId } = req.body;

    if (!withdrawId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing withdrawId" });
    }

    if (!mongoose.isValidObjectId(withdrawId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid withdrawId" });
    }

    const getWithdraw = await Withdraw.findById(withdrawId).populate('userId', 'fullName email mobile');
    if (!getWithdraw) {
      return res
        .status(404)
        .json({ success: false, message: "Withdraw request not found" });
    }

    if (getWithdraw.status === "success" || getWithdraw.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Withdraw request already processed",
      });
    }

    const getUser = await User.findById(getWithdraw.userId);
    if (!getUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    getWithdraw.status = "success";
    await getWithdraw.save();

    return res.json({
      success: true,
      message: "Withdrawal approved successfully",
      data: {
        withdrawal: getWithdraw,
        user: {
          fullName: getUser.fullName,
          email: getUser.email,
          mobile: getUser.mobile
        }
      }
    });
  } catch (err) {
    console.error("Error approving withdrawal:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/reject-withdraw", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { withdrawId } = req.body;

    if (!withdrawId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Missing withdrawId" });
    }

    if (!mongoose.isValidObjectId(withdrawId)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Invalid withdrawId" });
    }

    const getWithdraw = await Withdraw.findById(withdrawId).populate('userId', 'fullName email mobile').session(session);
    if (!getWithdraw) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Withdraw request not found" });
    }

    if (getWithdraw.status === "success" || getWithdraw.status === "rejected") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Withdraw request already processed",
      });
    }

    const getUser = await User.findById(getWithdraw.userId).session(session);
    if (!getUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Restore user balance when rejecting withdrawal
    getUser.balance += getWithdraw.amount;
    getUser.withdrawableBalance += getWithdraw.amount;
    await getUser.save({ session });

    getWithdraw.status = "rejected";
    await getWithdraw.save({ session });

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Withdrawal rejected successfully and balance restored",
      data: {
        withdrawal: getWithdraw,
        user: {
          fullName: getUser.fullName,
          email: getUser.email,
          mobile: getUser.mobile,
          newBalance: getUser.balance,
          newWithdrawableBalance: getUser.withdrawableBalance
        }
      }
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error rejecting withdrawal:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    session.endSession();
  }
});

router.put("/reject-deposit", async (req, res) => {
  try {
    const { transactionId } = req.body;
    const getTransaction = await Transaction.findById(transactionId);

    if (!getTransaction) {
      return res
        .status(400)
        .json({ success: false, message: "No transaction found" });
    }

    if (
      getTransaction.status === "success" ||
      getTransaction.status === "rejected"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction already processed" });
    }

    getTransaction.status = "rejected";
    await getTransaction.save();

    return res.json({
      success: true,
      message: "Transaction rejected successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "provide valid userid to delete" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }
    res.json({
      success: true,
      message: "user deleted successfully",
      deletedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.post("/set-result", async (req, res) => {
  const { period, adminNumber, adminColour, adminSize } = req.body;
  if (!period && !adminNumber && !adminColour && !adminSize) {
    return res.status(400).json({ success: false, message: "missing details" });
  }
  await AdminResult.create({
    period,
    adminNumber,
    adminColour,
    adminSize,
  });

  return res.json({ success: true, message: "result set successfully" });
});

router.get("/latest-bets", async (req, res) => {
  try {
    const allBets = await Bet.find().lean().sort({ createdAt: -1 });
    res.json({ success: true, allBets });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
