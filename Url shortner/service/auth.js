const jwt = require("jsonwebtoken");
const secret = '@111222nnn$$#'
const sessionIdToUserMap = new Map();

function setUser( user){
    const payload = {
        id : user._id,
        email:user.email,
    }
    return jwt.sign(payload,secret  )
}

function getUser(token){
    if(!token) return null;
    try{
    return jwt.verify(token,secret)
   }
   catch{
    return null
   }
}

module.exports = {setUser,getUser}



