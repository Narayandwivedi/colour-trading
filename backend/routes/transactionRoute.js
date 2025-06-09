const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction,createWithdrawal, getUserWithdrawal} = require("../controllers/transactionController.js")

router.post("/",createTransaction)
router.get("/",getAllTransaction)
router.post("/withdraw",createWithdrawal)
router.post("/withdrawhistory",getUserWithdrawal)

module.exports = router