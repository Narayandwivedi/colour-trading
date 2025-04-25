const mongoose = require("mongoose");

async function connectToDb() {
  try{
    await mongoose.connect(`${process.env.MONGO_URL}/colour-trading`)
    console.log("db connection success");
    
  }
  catch(err){
    console.log("some error in db");
    process.exit(1)
  }
}

module.exports = {connectToDb}