const mongoose = require("mongoose");

const transcationSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Types.ObjectId,
        required : true
    },
    UTR : {
        type : Number,
        required:true
    },

    status : {
        enum:["pending","success","rejected"],
        default:"pending"
    }
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transcationSchema)
module.exports = transactionModel;