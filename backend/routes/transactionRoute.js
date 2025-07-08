const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction,createWithdrawal, getWithdrawalHistory , getDepositHistory, rejectTransaction} = require("../controllers/transactionController.js");
const { checkLoggedIN } = require("../middleware/checkLoggedIn.js");

router.post("/",createTransaction)
router.get("/",getAllTransaction)
router.post("/reject",rejectTransaction)
router.post("/withdraw",createWithdrawal)
router.post("/withdrawhistory",getWithdrawalHistory)
router.post("/deposithistory",getDepositHistory)

module.exports = router