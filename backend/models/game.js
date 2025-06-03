const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true
  },
  gameType: {
    type: String,
    enum: ["30sec", "1min", "3min"],
    required: true
  },
  colour: {
    type: String,
    enum: ["red", "green"]
  },
  size:{
    type:String,
    enum:["big", "small"]
  },
  number:{
    type:Number,
    min:0,
    max:9
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  }
}, { timestamps: true });

// Optional: index for fast query by gameType
// gameSchema.index({ gameType: 1, createdAt: -1 });

const game = mongoose.model("game", gameSchema);

module.exports = game;
