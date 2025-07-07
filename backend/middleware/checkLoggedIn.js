const jwt = require("jsonwebtoken");

async function checkLoggedIN(req, res, next) {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({
            success: false, 
            message: "Unauthorized, please login"
        });
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        
        // Add decoded info to request object for use in other middlewares/controllers
        req.userRole = decodedToken.role;
        
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({
            success: false, 
            message: "Invalid or expired token"
        });
    }
}

module.exports = { checkLoggedIN };