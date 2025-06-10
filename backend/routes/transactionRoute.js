const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction,createWithdrawal, getWithdrawalHistory , getDepositHistory} = require("../controllers/transactionController.js")

router.post("/",createTransaction)
router.get("/",getAllTransaction)
router.post("/withdraw",createWithdrawal)
router.post("/withdrawhistory",getWithdrawalHistory)
router.post("/deposithistory",getDepositHistory)

module.exports = router