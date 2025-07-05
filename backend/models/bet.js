const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    period: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    betColour: {
        type: String,  // Fixed: was "String" 
        enum: ["red", "green", "violet"],
    },
    betSize: {
        type: String,  // Fixed: was "string"
        enum: ["big", "small"]
    },
    betNumber: {
        type: Number,
        min: 0,
        max: 9
    },
    betResult: {
        type: mongoose.Schema.Types.Mixed,  // Can store both strings and numbers
        // No enum since it can be colors, sizes, or numbers (0-9)
    },
    betAmount: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "win", "lost"],
        default: "pending"
    },
    payout: {
        type: Number,
        min: 0
    }
}, { timestamps: true });

const bet = mongoose.model("bet", betSchema);
module.exports = bet;