const mongoose = require("mongoose")

const adminResultSchema = new mongoose.Schema({
  period: String,
  adminNumber: Number, // 0-9, admin controlled
  adminColour: String, // "red", "green", "violet", admin controlled  
  adminSize: String,   // "big", "small", admin controlled
  isActive: {
    type:Boolean,
    default:true
  },   // whether to use this result
},{timestamps:true})

module.exports = mongoose.model('AdminResult',adminResultSchema)