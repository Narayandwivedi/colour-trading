const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");
const transactionModel = require("../models/transcationModel.js");


function generateReferralCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
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

    const { fullName, email, password, referedBy } = req.body;

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


    // check if referal code is correct or not  

     if(referedBy){
      const referer = await userModel.findOne({referralCode:referedBy})
      if(referer){
        referer.totalReferal+=1
        await referer.save()
      }
    }

    // generate unique referral code
    const referralCode = generateReferralCode();

   
    // hashpassword
    const hashedpassword = await bcrypt.hash(password, 8);
    console.log(fullName, email, password, hashedpassword);
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedpassword,
      referralCode: referralCode,
      referedBy,
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

    delete newUser.password
    return res
      .status(201)
      .json({ success: true, message: "user created successfully" , userId:newUser});
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
    if (user.isBankAdded) {
      user.accountNumber = maskString(user.bankAccount.accountNumber, 4);
      delete user.bankAccount;
    }

    if (user.isUpiAdded) {
      user.upi = maskUpiId(user.upiId.upi);
      delete user.upiId;
    }
    delete user.password;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // protect from client side js access
      sameSite: "Lax", // protect from CSRF ATTACK
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      userData: user,
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
    const user = await userModel
      .findById(decoded.userId)
      .select("-password")
      .lean();

    if (user.isBankAdded) {
      user.accountNumber = maskString(user.bankAccount.accountNumber, 4);
      delete user.bankAccount;
    }

    if (user.isUpiAdded) {
      user.upi = maskUpiId(user.upiId.upi);
      delete user.upiId;
    }
    return res.status(200).json({ isLoggedIn: true, user });
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

    if (fetchedUser.isFirstDeposit && fetchedUser.referedBy && amount >= 500) {
      const referrer = await userModel
        .findOne({ referralCode: fetchedUser.referedBy })
        .session(session);
      if (referrer) {
        referrer.balance += 50;
        await referrer.save({ session });

        // add in transaction history
        const referralTransaction = new transactionModel({
          userId: referrer._id,
          amount: 50,
          type: "referral-bonus",
          status: "success",
          metadata: {
            referredUser: fetchedUser._id,
            depositId: transaction._id, // Reference the original deposit
          },
        });
        await referralTransaction.save({ session });
      }
    }

    if (fetchedUser.isFirstDeposit) {
      fetchedUser.isFirstDeposit = false;
    }
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

const handleAddBank = async (req, res) => {
  const { userId, accountNumber, ifscCode, bankName, accountHolderName } =
    req.body;

  try {
    if (
      !userId ||
      !accountHolderName ||
      !ifscCode ||
      !bankName ||
      !accountHolderName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "missing fields" });
    }

    // check user exist or not

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // check is bank already added or not

    if (user.isBankAdded) {
      return res
        .status(409)
        .json({ success: false, message: "bank account already added" });
    }

    user.bankAccount = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName.trim(),
    };
    user.isBankAdded = true;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Bank account added successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const handleAddUpi = async (req, res) => {
  const { userId, upiId, accountHolderName } = req.body;
  try {
    if (!userId || !upiId || !accountHolderName) {
      return res.json({ success: false, message: "missing credentials" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.staus(400).json({ success: false, message: "user not found" });
    }
    if (user.isUpiAdded) {
      return res
        .status(409)
        .json({ success: false, message: "upi id already added" });
    }
    user.upiId = {
      upi: upiId,
      accountHolderName,
    };

    user.isUpiAdded = true;
    await user.save();
    return res.json({ success: true, message: "upi id added successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

// function to mask upi id or bank account

function maskString(str, visibleChars = 4) {
  if (!str || str.length <= visibleChars) return str;
  return "*".repeat(str.length - visibleChars) + str.slice(-visibleChars);
}

// function to maski upi id

function maskUpiId(upiId) {
  if (!upiId) return upiId;

  const atIndex = upiId.indexOf("@");
  if (atIndex === -1) return maskString(upiId, 4);

  const namePart = upiId.substring(0, atIndex);
  const domainPart = upiId.substring(atIndex);

  // Mask name part but keep domain part fully visible
  const maskedName =
    namePart.length > 4
      ? "*".repeat(namePart.length - 4) + namePart.slice(-4)
      : namePart;

  return maskedName + domainPart;
}

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
  handleUpdateBalance,
  handleAddBank,
  handleAddUpi,
};
