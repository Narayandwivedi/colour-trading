require("dotenv").config()
const express = require("express");
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {connectToDb} = require("./config/mongodb.js")

// import routes
const userRoute = require("./routes/userRoute.js")
const transactionRoute = require("./routes/transactionRoute.js")

app.use(cors({
    origin:["https://colour-trading.vercel.app","http://localhost:5173","http://localhost:5174"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("web api is working fine")
})

app.use("/api/users",userRoute)
app.use("/api/transaction",transactionRoute)

// server listen

connectToDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server actiavte ho gya hai");
    })
})