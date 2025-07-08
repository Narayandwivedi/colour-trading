const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");
const transactionModel = require("../models/transcationModel.js");
const transporter = require("../config/nodemailer.js");

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
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, referedBy, mobile } = req.body;

    // Trim input fields
    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();
    referedBy = referedBy?.trim();

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    // Validate Indian mobile number
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid Indian mobile number" 
      });
    }

    // Check if user already exists by email or mobile
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { mobile }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({ 
          success: false, 
          message: "Mobile number already exists" 
        });
      }
    }

    // Handle referral
    if (referedBy) {
      const referer = await userModel.findOne({ referralCode: referedBy });
      if (!referer) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid referral code" });
      }
      referer.totalReferal += 1;
      await referer.save();
    }

    // Generate unique referral code
    const referralCode = generateReferralCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUserData = {
      fullName,
      email,
      mobile,
      password: hashedPassword,
      referralCode,
    };

    if (referedBy) {
      newUserData.referedBy = referedBy;
      newUserData.balance = 20;
    }

    // Create new user
    const newUser = await userModel.create(newUserData);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userId: userObj,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    
    if (!emailOrMobile || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email/Mobile and password are required" 
      });
    }

    // Check if input is email or mobile number
    const isEmail = emailOrMobile.includes('@');
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email or mobile number" 
      });
    }

    // Find user by email or mobile
    const query = isEmail 
      ? { email: emailOrMobile } 
      : { mobile: parseInt(emailOrMobile) };

    const user = await userModel.findOne(query).lean();
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: isEmail ? "Invalid email" : "Invalid mobile number" 
      });
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

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

     const mailOptions = {
      from: "winnersclubsofficial@gmail.com",
      to: 'winnersclubs123@gmail.com',
      subject: "user loggedin alert",
      text: `user logged in `,
    };

    await transporter.sendMail(mailOptions)

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
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handelAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({success:false , message:"missing details"})
    }
    
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }
    
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    // Rest of your login logic...
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      userData: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
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

const generateResetPassOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "please provide email address" });
    }

    const getUser = await userModel.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `user with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await getUser.save();

    const mailOptions = {
      from: "winnersclubsofficial@gmail.com",
      to: email,
      subject: "Account password reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "otp sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;

    if (!otp || !newPass || !email) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    const getUser = await userModel.findOne({ email });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found try again" });
    }

    // Check if OTP exists
    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "no otp found for this user" });
    }

    // Check if OTP is expired
    if (getUser.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "otp expired" });
    }

    // Convert both OTP values to numbers for comparison
    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;

      // Clear OTP fields after successful password reset
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;

      await getUser.save();

      return res.json({
        success: true,
        message: "password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    return res.status(500).json({ success: false, message: "server error" });
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

    const mailOptions = {
      from: "winnersclubsofficial@gmail.com",
      to: 'winnersclubs123@gmail.com',
      subject: "user loggedin alert",
      text: `user logged in `,
    };

    await transporter.sendMail(mailOptions)

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
  generateResetPassOTP,
  submitResetPassOTP,
  handelAdminLogin
};
