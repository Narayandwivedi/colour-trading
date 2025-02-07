
const {getUser} = require("../service/auth")


async function checkLoggedIn(req,res,next){

    let token = req.cookies.token;
    if(!token){
        return res.redirect("/login")
    }
    let userdetail = getUser(token)

    if(!userdetail){
       return res.redirect("/login")
    }

    req.user = userdetail
    next();    
}

module.exports = {checkLoggedIn}