const express = require("express");
const router = express.Router()

const {handelUserSignup , handelUserLogin , handleUserLogout, isloggedin ,  handleUpdateBalance } = require("../controllers/userController.js")

router.get("/isloggedin", isloggedin);
router.post("/logout",handleUserLogout)
router.post("/signup",handelUserSignup)
router.post("/login",handelUserLogin)
router.put("/updatebalance",handleUpdateBalance)

module.exports = router