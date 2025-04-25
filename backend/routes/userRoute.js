const express = require("express");
const router = express.Router()

const {handelUserSignup , handelUserLogin , isloggedin} = require("../controllers/userController.js")

router.get("/isloggedin", isloggedin);
router.post("/signup",handelUserSignup)
router.post("/login",handelUserLogin)


module.exports = router