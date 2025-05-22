const jwt = require("jsonwebtoken");

async function checkLoggedIN(req,res,next) {

    const {token} = req.cookies
    if(!token){
        return res.status(401).json({success:false , message : "unauthorized please login"})
    }
    try{

    const decodedToken = jwt.verify(token , process.env.JWT_SECRET)
    next()

    }catch(err){
        
    }
}

module.exports = {checkLoggedIN}