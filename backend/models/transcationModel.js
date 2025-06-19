const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Types.ObjectId,
        required : true
    },
    UTR : {
        type : Number,
    },
    

    status : {
        type:"string",
        enum:["pending","success","rejected"],
        default:"pending"
    },
    amount:{
        type:Number
    },
     type: {
    type: String,
    enum: ["deposit", "referral-bonus", ],  
    default: "deposit"
  },
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)
module.exports = transactionModel;