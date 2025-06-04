const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");
const transactionModel = require("../models/transcationModel.js");


function generateReferralCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

const handelUserSignup = async (req, res) => {
  try {
    // checking req body

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    const { fullName, email, password } = req.body;

    if (
      !fullName ||
      !fullName.trim() ||
      !email ||
      !email.trim() ||
      !password ||
      !password.trim()
    ) {
      return res.status(400).json({ success: false, message: "missing field" });
    }
    // checks if email already exist
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }

    // generate unique referral code 
    const referralCode = generateReferralCode()

    // hashpassword
    const hashedpassword = await bcrypt.hash(password, 8);
    console.log(fullName, email, password, hashedpassword);
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedpassword,
      referralCode:referralCode
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // protect from client side js access
      sameSite: "None", // protect from CSRF ATTACK
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
    });

    return res
      .status(201)
      .json({ success: true, message: "user created successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email or password missing" });
    }

    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    delete user.password;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // protect from client side js access
      sameSite: "None", // protect from CSRF ATTACK
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      userData:user
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      // secure: "none",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};


const isloggedin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await userModel
      .findById(decoded.userId)
      .select("-password")
      .lean();
    return res.status(200).json({ isLoggedIn: true, user: userData });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

const handleUpdateBalance = async (req, res) => {
  const { userId, totalAmount, transactionId } = req.body;

  // Validate input
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(transactionId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  // validate amount

  const amount = Number(totalAmount);
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Amount must be positive." });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if transaction exists and wasn't already processed
    const transaction = await transactionModel
      .findById(transactionId)
      .session(session);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.status === "success") {
      throw new Error("Transaction already processed");
    }

    // 2. Update user balance
    const fetchedUser = await userModel.findById(userId).session(session);
    if (!fetchedUser) throw new Error("User not found");

    fetchedUser.balance += amount;
    await fetchedUser.save({ session });

    // 3. Mark transaction as successful
    transaction.status = "success";
    await transaction.save({ session });

    await session.commitTransaction();
    return res.json({
      success: true,
      message: `Balance updated`,
    });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    const statusCode = err.message.includes("not found")
      ? 404
      : err.message.includes("already processed")
      ? 409
      : 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
  handleUpdateBalance,
};
