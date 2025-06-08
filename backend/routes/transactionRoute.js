const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction,createWithdrawal} = require("../controllers/transactionController.js")

router.post("/",createTransaction)
router.get("/",getAllTransaction)
router.post("/withdraw",createWithdrawal)

module.exports = router