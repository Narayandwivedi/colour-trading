const transactionModel = require("../models/transcationModel.js")

async function createTransaction(req,res) {
    try{
        const {userId , UTR} = req.body
        if(!userId || !UTR){
            return res.status(400).json({success:false, message:"invalid transaction"})
        }

       const newTransaction =  await transactionModel.create({
            userId,
            UTR
        })
        if(!newTransaction){
            console.log("some error in transaction");
            return res.send("some error in transcation please try again later")
            
        }
        res.status(201).json({success:true, message:"balance will be added shortly after verifying UTR"})
    }catch(err){
        return res.status(500).json({success:false , message:err.message})
    }
}


async function getAllTransaction(req,res) {
    
    try{
        const allTransaction = await transactionModel.find({})
    if(!allTransaction){
        return res.status(400).json({success:false , message:"error while fetching transaction"})
    }
    return res.json({success:true , allTransaction})
    }catch(err){
        res.status(500).json({success:false , message:err.message})
    }
    
}


module.exports = {createTransaction,getAllTransaction};
