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

async function approveTransaction(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }
    
    if (!mongoose.isValidObjectId(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }
    
    // Find transaction with session
    const transaction = await transactionModel.findById(transactionId).session(session);
    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }
    
    if (transaction.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Transaction already processed"
      });
    }
    
    // Find user with session
    const user = await userModel.findById(transaction.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update transaction status
    transaction.status = 'success';
    await transaction.save({ session });
    
    // Update user balance
    user.balance += transaction.amount;
    user.withdrawableBalance += transaction.amount;
    await user.save({ session });
    
    await session.commitTransaction();
    
    return res.json({
      success: true,
      message: "Transaction approved successfully"
    });
    
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({
      success: false,
      message: err.message
    });
  } finally {
    session.endSession();
  }
}

async function rejectTransaction(req, res) {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }
    
    if (!mongoose.isValidObjectId(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }
    
    const transaction = await transactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Transaction already processed"
      });
    }
    
    transaction.status = 'rejected';
    await transaction.save();
    
    return res.json({
      success: true,
      message: "Transaction rejected successfully"
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

// DEPRECATED - Use getDepositsByStatus instead
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

// Get deposits by status with pagination
async function getDepositsByStatus(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    // Validate status
    const validStatuses = ['pending', 'success', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status required: pending, success, or rejected'
      });
    }
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100"
      });
    }
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Build filter - only get deposits
    const filter = {
      type: 'deposit',
      status: status
    };
    
    // Get total count for pagination info
    const totalDeposits = await transactionModel.countDocuments(filter);
    
    // Fetch deposits with pagination and populate user info
    const deposits = await transactionModel
      .find(filter)
      .populate('userId', 'fullName email mobile')
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalDeposits / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    return res.json({
      success: true,
      data: {
        deposits,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalDeposits,
          hasNextPage,
          hasPrevPage,
          limit: limitNum,
          status
        }
      }
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
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

    // Populate the created withdrawal with user details
    const populatedWithdrawal = await withdraw
      .findById(newWithdrawal[0]._id)
      .populate('userId', 'fullName email mobile upiId bankAccount')
      .lean();

    return res.status(200).json({
      success: true,
      message: "withdrawal request successful",
      withdrawal: populatedWithdrawal,
    });
  } catch (err) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
}

// DEPRECATED - Use getWithdrawalsByStatus instead
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

// Get withdrawals by status with pagination
async function getWithdrawalsByStatus(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    // Validate status
    const validStatuses = ['pending', 'success', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status required: pending, success, or rejected'
      });
    }
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100"
      });
    }
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Build filter
    const filter = {
      status: status
    };
    
    // Get total count for pagination info
    const totalWithdrawals = await withdraw.countDocuments(filter);
    
    // Fetch withdrawals with pagination and populate user info
    const withdrawals = await withdraw
      .find(filter)
      .populate('userId', 'fullName email mobile upiId bankAccount')
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalWithdrawals / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    return res.json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalWithdrawals,
          hasNextPage,
          hasPrevPage,
          limit: limitNum,
          status
        }
      }
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
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
  getDepositsByStatus,
  approveTransaction,
  rejectTransaction,
  createWithdrawal,
  getAllWithDrawal,
  getWithdrawalsByStatus,
  getWithdrawalHistory,
  getDepositHistory,
};




