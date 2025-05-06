const express = require("express");
const router = express.Router();

const {handlePlaceBet} = require("../controllers/betController")

//addbet
router.post("/",handlePlaceBet)


module.exports = router