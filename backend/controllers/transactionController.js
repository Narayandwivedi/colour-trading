const mongoose = require("mongoose");
const transactionModel = require("../models/transcationModel.js");
const withdraw = require("../models/Withdraw.js");
const userModel = require("../models/user.js");
const axios = require('axios')

async function createTransaction(req, res) {
  try {
    const { userId, UTR, amount } = req.body;
    if (!userId || !UTR) {
      return res
        .status(400)
        .json({ success: false, message: "invalid transaction" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "invalid user" });
    }

    const newTransaction = await transactionModel.create({
      userId,
      UTR,
      amount,
    });
    if (!newTransaction) {
      console.log("some error in transaction");
      return res.send("some error in transcation please try again later");
    }

    sendDepositAlert()

    res.status(201).json({
      success: true,
      message: "balance will be added shortly after verifying UTR",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function rejectTransaction(req, res) {
  const { transactionId } = req.body;
  console.log(transactionId);
  return res.json({ success: true });
}

async function getAllTransaction(req, res) {
  try {
    const allTransaction = await transactionModel
      .find()
      .lean()
      .sort({ createdAt: -1 });
    if (!allTransaction) {
      return res
        .status(400)
        .json({ success: false, message: "error while fetching transaction" });
    }
    return res.json({ success: true, allTransaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createWithdrawal(req, res) {
  const { userId, amount, paymentMethod } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!userId || !amount || !paymentMethod) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "missing field" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "invalid userid" });
    }

    if (isNaN(Number(amount))) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "invalid amount" });
    }

    if (Number(amount) < 300) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "minimum withdrawal amount is 300" });
    }

    // Check user with session
    const user = await userModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // Check balance
    if (user.withdrawableBalance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "insufficient balance",
        availableBalance: user.withdrawableBalance,
      });
    }

    // Check payment method
    if (paymentMethod === "bank" && !user.bankAccount) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "please add bank account details" });
    }

    if (paymentMethod === "upi" && !user.upiId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "please add UPI ID" });
    }

    // Create withdrawal request within transaction
    const newWithdrawal = await withdraw.create(
      [
        {
          userId,
          amount,
          paymentMethod,
          status: "pending",
        },
      ],
      { session: session }
    );

    if (!newWithdrawal || newWithdrawal.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "withdrawal request failed" });
    }

    // Update user's balance within the same transaction
    user.withdrawableBalance -= amount;
    user.balance -= amount;
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "withdrawal request successful",
      withdrawalId: newWithdrawal[0]._id,
    });
  } catch (err) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAllWithDrawal(req, res) {
  try {
    const withdrawals = await withdraw
      .find()
      .populate("userId", "username email");
    if (!withdrawals) {
      return res
        .status(400)
        .json({ success: false, message: "error while fetching withdrawals" });
    }
    return res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getWithdrawalHistory(req, res) {
  try {
    const { userId } = req.body;

    // Validate request body
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Validate user ID format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format",
      });
    }

    // Find withdrawals and sort by date (newest first)
    const withdrawals = await withdraw
      .find({ userId })
      .lean()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      history: withdrawals,
      count: withdrawals.length,
    });
  } catch (err) {
    console.error("Error in getUserWithdrawal:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

async function getDepositHistory(req, res) {
  try {
    const { userId } = req.body;

    // validate req body

    if (!userId) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }

    // validate id format
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // fetch deposit history
    const depositHistory = await transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    if (depositHistory) {
      return res.json({ success: true, depositHistory });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}



const sendDepositAlert = async () => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID //group id

  const message = `deposit alert !`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      // parse_mode: "Markdown",
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};



module.exports = {
  createTransaction,
  getAllTransaction,
  createWithdrawal,
  getAllWithDrawal,
  getWithdrawalHistory,
  getDepositHistory,
  rejectTransaction,
};




