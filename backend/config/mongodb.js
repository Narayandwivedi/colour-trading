const mongoose = require("mongoose");

async function connectToDb() {
  try{
    await mongoose.connect(`mongodb://127.0.0.1:27017/colour-trading`)
    console.log("db connection localhost success");
    
  }
  catch(err){
    console.log("some error in db");
    process.exit(1)
  }
}

module.exports = {connectToDb}