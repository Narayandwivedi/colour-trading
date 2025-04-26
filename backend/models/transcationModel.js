const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Types.ObjectId,
        required : true
    },
    UTR : {
        type : Number,
        required:true
    },

    status : {
        type:"string",
        enum:["pending","success","rejected"],
        default:"pending"
    }
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)
module.exports = transactionModel;