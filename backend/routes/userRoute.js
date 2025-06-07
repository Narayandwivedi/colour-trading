const express = require("express");
const router = express.Router();

const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
  handleUpdateBalance,
  handleAddBank,
  handleAddUpi,
} = require("../controllers/userController.js");

router.get("/isloggedin", isloggedin);
router.post("/logout", handleUserLogout);
router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.post("/addbank", handleAddBank);
router.post("/addupi", handleAddUpi);
router.put("/updatebalance", handleUpdateBalance);

module.exports = router;
