const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({

    period:{
        type:Number,
    },

    colour: {
        type:String,
        enum:["red" ,"green"],
    },

    status :{
        type:String,
        enum :["open" ,"closed"],
        default:"open"
    }

},{timestamps:true})

const game = mongoose.model("game",gameSchema);

module.exports = game