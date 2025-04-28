const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel.js")

const handelUserSignup = async (req,res)=>{
        
        try{
            // checking req body

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "missing data" });
              }
              
            const {fullName , email , password} = req.body

        if( !fullName || !fullName.trim() || !email || !email.trim() || !password || !password.trim()){
            return res.status(400).json({success:false , message:"missing field"})
        }
        // checks if email already exist
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({success:false , message:"user already exist"})
        }

        // hashpassword
        const hashedpassword = await bcrypt.hash(password ,8)
        console.log(fullName , email , password , hashedpassword);
        const newUser = await userModel.create({
            fullName,
            email,
            password:hashedpassword
        })
         const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET , {expiresIn:"7d"})
         res.cookie("token",token,{
            httpOnly:true,           // protect from client side js access
            sameSite:"None",       // protect from CSRF ATTACK
            secure:true,
            maxAge:7*24*60*60*1000 // cookie expires in 7 days
         })
        
        return res.status(201).json({success:true , message :"user created successfully"})
        }catch(err){
            console.log(err.message);
            return res.status(500).json({message:err.message})
    }
}

const handelUserLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "email or password missing" });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email" });
      }
  
      const isPassMatch = await bcrypt.compare(password, user.password);
      if (!isPassMatch) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.cookie("token", token, {
        httpOnly:true,           // protect from client side js access
        sameSite:"None",       // protect from CSRF ATTACK
        secure:true,
        maxAge:7*24*60*60*1000 
      });
  
      return res.status(200).json({ success: true, message: "user logged in successfully",userData:user });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };
  
const isloggedin = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isLoggedIn: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
}

  const handleUpdateBalance = async (req, res) => {
    const { userId, totalAmount } = req.body;

    if (!userId || totalAmount===undefined ) {
      return res.status(400).json({ success: false, message: "Please provide a valid userId and balance" });
    }
    if(isNaN(Number(totalAmount))){
      return res.status(400).json({success:false , message:"please provide valid amount"})
    }

    try {
      const user = await userModel.findById(userId)

      if (!user) {
        return res.status(400).json({ success: false, message: "User doesn't exist" });
      }
      const prevBalance = user.balance
       user.balance = prevBalance+totalAmount
       await user.save();
      return res.json({ success: true, message: "Balance updated successfully", user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  


module.exports = {handelUserSignup , handelUserLogin , isloggedin , handleUpdateBalance}