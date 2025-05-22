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
}

})

const user = mongoose.model("user",userSchema)
module.exports = user