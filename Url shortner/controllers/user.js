const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
const {setUser,getUser} = require("../service/auth");

async function handelUserSignup(req,res){
    const {name , email , password} = req.body;
    console.log(`${name } ${email} ${password}`);
    
    await User.create({
        name:name,
        email:email,
        password:password
    })

    return res.render("home");
}


async function handelUserLogin(req,res) {
   const {email,password} = req.body;
   const user =  await User.findOne({email,password});
   
   if(!user){
    return res.render("login",{error : "invalid username or password"});
   }
   const token = setUser(user);
   res.cookie('token',token,{
    httpOnly:true,
    maxAge: 7*24*60*60*1000
   });
   return res.redirect("/url");
}


module.exports = {handelUserSignup,handelUserLogin}