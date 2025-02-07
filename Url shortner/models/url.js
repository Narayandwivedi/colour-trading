const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{
        type : String,
        required : true
    },

    redirectURL : {
        type : String,
        required : true
    },
    VisitHistory : [
        {
            timestamp : {type: Number,}
        }
    ],

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
    
},{timestamps:true})


const Url = mongoose.model("url" , urlSchema);
module.exports = Url;