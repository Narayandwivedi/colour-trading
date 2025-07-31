const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      default: "pending",
    },
    amount: {
      type: Number,
      min: 100,
      required: true,
    },
    paymentMethod:{
      type:String,
       required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Withdraw',withdrawSchema)