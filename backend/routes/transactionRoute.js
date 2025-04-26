const express = require("express");
const router = express.Router();

const {createTransaction,getAllTransaction} = require("../controllers/transactionController.js")

router.post("/",createTransaction)
router.get("/",getAllTransaction)