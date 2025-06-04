const express = require("express");
const router = express.Router();

const {handlePlaceBet} = require("../controllers/betController");
const { route } = require("./userRoute");

//addbet
router.post("/",handlePlaceBet)
// route.length()


module.exports = router