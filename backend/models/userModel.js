const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 fullName:{
    type:String,
    required:true
 } ,  
email:{
    type:String,
    required:true,
    unique:true
},

password:{
    type:String,
    required:true
},
balance:{
    type:Number,
    default:100
},

gameHistory:[{
    period: {
        type: Number,
        required: true
      },
      winColour: {
        type: String,
        enum: ['red', 'green', 'violet'],
        required: true
      },
      betColour: {
        type: String,
        enum: ['red', 'green', 'violet'],
        required: true
      },
      betAmount: {
        type: Number,
        required: true,
        min: 1
      },
      payout: {
        type: Number,
        default: 0
      },
      result: {
        type: String,
        enum: ['win', 'loss'],
        required: true
      },
}]
})

const userModel = mongoose.model("user",userSchema)
module.exports = userModel