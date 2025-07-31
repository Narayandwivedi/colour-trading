const express = require("express");
const router = express.Router();

const {handlePlaceBet , getBetHistory, getAllBets} = require("../controllers/betController");
const { route } = require("./userRoute");

//addbet
router.post("/",handlePlaceBet)
router.post("/history",getBetHistory)
router.get("/all",getAllBets)


module.exports = router