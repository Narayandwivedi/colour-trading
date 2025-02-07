const mongoose = require("mongoose");

// schema 

const userSchema = new mongoose.Schema({
  first_name: {
    type : String,
    required:true,
  },
  last_name:String,
  email :{
    type : String,
    required : true,
    unique : true
  },
  gender:{
    type:String
  },
  Job_title:String
})

// model

const User = mongoose.model("user", userSchema)

module.exports = User
