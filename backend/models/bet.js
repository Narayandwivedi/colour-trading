const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({

    period :{
        type : Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    betColour:{
        type:"String",
        enum:["red","green"],
        required:true
    },
    betAmount:{
        type:Number,
        min:1,
        required:true
    },
    status:{
        type:String,
        enum:["pending","win","lost"],
        default:"pending"
    }

},{timestamps:true})

const bet = mongoose.model("bet",betSchema);
module.exports = bet