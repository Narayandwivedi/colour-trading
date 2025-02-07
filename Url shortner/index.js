const express = require("express");
const app = express();
const path = require('path');
const { connectoDb } = require("./DbConnection");
const cookieParser = require("cookie-parser");

// middleware
const {checkLoggedIn} = require("./middleware/auth");

// routes
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");


//  set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

// middleware

app.use(express.urlencoded({ extended: false })); //parse form data
app.use(express.json()); // parse json data
app.use(cookieParser());

// router

app.use("/url",checkLoggedIn,urlRoute);
app.use("/user",userRoute)

app.get("/signup",(req,res)=>{res.render("signup")})
app.get("/login",(req,res)=>{res.render("login")})


// server connection
app.listen(4000, () => {
  console.log(`server activated at port ${4000}`);
});

// db connection
connectoDb();
