const express = require("express");
const app = express();
const fs = require("fs");
const {connectToDb} = require("./connection")



// models

const User = require("./models/user")


// routes

const userRoute = require("./routes/user")


// middlewares

app.use(express.urlencoded({ extended: false }));

// routers

app.use("/users",userRoute)


  // app connection

app.listen(8000, () => {
  console.log("server activated ho gya hai");
});

// db connection

connectToDb()

