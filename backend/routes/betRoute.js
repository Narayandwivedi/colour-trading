const express = require("express");
const router = express.Router();

const {handlePlaceBet , getBetHistory} = require("../controllers/betController");
const { route } = require("./userRoute");

//addbet
router.post("/",handlePlaceBet)
router.post("/history",getBetHistory)


module.exports = router