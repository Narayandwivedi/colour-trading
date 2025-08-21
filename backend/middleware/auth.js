const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

const auth = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({
            success: false, 
            message: "Unauthorized, please login"
        });
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user info and add to request
        const user = await userModel.findById(decodedToken.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false, 
                message: "User not found"
            });
        }
        
        req.userId = decodedToken.userId;
        req.user = user;
        req.userRole = decodedToken.role || user.role;
        
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({
            success: false, 
            message: "Invalid or expired token"
        });
    }
};

module.exports = auth;