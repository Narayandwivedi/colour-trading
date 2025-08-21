const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
  handleUpdateBalance,
  handleAddBank,
  handleAddUpi,
  generateResetPassOTP,
  submitResetPassOTP,
  handelAdminLogin,
  editUser,
  handleGoogleAuth
} = require("../controllers/userController.js");

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests , try again later",
    });
  },
});

const otpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 8,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Try again later.",
    });
  },
});

router.get("/isloggedin", isloggedin);
router.post("/logout", handleUserLogout);
router.post("/signup", handelUserSignup);
router.post("/login",limiter, handelUserLogin);
router.post("/google", handleGoogleAuth);
router.post("/get-otp",otpLimiter, generateResetPassOTP);
router.post("/submit-otp",otpLimiter, submitResetPassOTP);
router.post("/addbank", handleAddBank);
router.post("/addupi", handleAddUpi);
router.post("/admin-login", handelAdminLogin);
router.put("/updatebalance", handleUpdateBalance);
router.put("/edit/:userId", editUser);

module.exports = router;
