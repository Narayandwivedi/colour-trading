const mongoose = require("mongoose");

async function connectoDb() {

    await mongoose.connect('mongodb://127.0.0.1:27017/url-shortner')
    console.log("db connected success");
    
    
}

module.exports = {connectoDb}