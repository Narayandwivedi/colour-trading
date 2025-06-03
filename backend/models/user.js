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
    default:0
},
withdrawableBalance:{
    type:Number,
    default:0
},
referralCode:{
    type:String,
    unique:true
},
referedBy:{
    type:String,
    }

})

const user = mongoose.model("user",userSchema)
module.exports = user