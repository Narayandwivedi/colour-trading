const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
     lowercase: true,
    required: true,
    unique: true,
  },

  mobile:{
    type:Number,
    unique: true,
    sparse: true,
    required: function() {
      return this.authProvider !== 'google';
    },
  },

  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },

  // Google OAuth fields
  googleId: {
    type: String,
    sparse: true,
  },
  profilePicture: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  balance: {
    type: Number,
    default: 0,
  },
  withdrawableBalance: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referedBy: {
    type: String,
  },

  isFirstDeposit: {
    type: Boolean,
    default: true,
  },

  bankAccount: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },

  upiId: {
    upi: { type: String },
    accountHolderName: { type: String },
  },

  isBankAdded: {
    type: Boolean,
    default: false,
  },
  isUpiAdded: {
    type: Boolean,
    default: false,
  },
  totalReferal: {
    type: Number,
    default: 0,
  },
  resetOtp: String,
  otpExpiresAt: Date,
});

const user = mongoose.model("user", userSchema);
module.exports = user;
