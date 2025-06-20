const express = require("express");
const router = express.Router();

const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
  handleUpdateBalance,
  handleAddBank,
  handleAddUpi,generateResetPassOTP,submitResetPassOTP
} = require("../controllers/userController.js");

router.get("/isloggedin", isloggedin);
router.post("/logout", handleUserLogout);
router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.post("/get-otp",generateResetPassOTP)
router.post("/submit-otp",submitResetPassOTP)
router.post("/addbank", handleAddBank);
router.post("/addupi", handleAddUpi);
router.put("/updatebalance", handleUpdateBalance);

module.exports = router;
