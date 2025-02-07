const mongoose = require("mongoose");

// db connection 




async function connectToDb(){
    await mongoose.connect('mongodb://127.0.0.1:27017/colour-trading')
    console.log("db connected success");
    

}


module.exports = {connectToDb}