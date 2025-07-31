const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction,getDepositsByStatus,approveTransaction,rejectTransaction,createWithdrawal,getAllWithDrawal,getWithdrawalsByStatus, getWithdrawalHistory , getDepositHistory} = require("../controllers/transactionController.js");
const { checkLoggedIN } = require("../middleware/checkLoggedIn.js");

router.post("/",createTransaction)
router.get("/",getAllTransaction)
router.get("/deposits",getDepositsByStatus)
router.post("/approve",approveTransaction)
router.post("/reject",rejectTransaction)
router.post("/withdraw",createWithdrawal)
router.get("/withdrawals",getWithdrawalsByStatus)
router.post("/withdrawhistory",getWithdrawalHistory)
router.post("/deposithistory",getDepositHistory)

module.exports = router