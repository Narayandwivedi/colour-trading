const mongoose = require("mongoose");
const bet = require("../models/bet");
const user = require("../models/user");
const game = require("../models/game");

const handlePlaceBet = async (req, res) => {
  const { userId, betAmount, period, betColour, betSize } = req.body;

  // [Keep all your existing validation checks...]
  // (All the input validation remains exactly the same)

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate user
    const getUser = await user.findById(userId).session(session);
    if (!getUser) throw new Error("user not found");

    const numericAmount = Number(betAmount);

    // Check sufficient balance (both main and withdrawable)
    if (numericAmount > getUser.balance) {
      throw new Error("insufficient balance");
    }

    // Validate game
    const checkGame = await game.findOne({ period }).session(session);
    if (!checkGame) throw new Error("game period not found");

    if (checkGame.status === "closed") {
      throw new Error("bet is not allowed, period closed");
    }

    // Create bet object
    const betData = {
      period,
      userId: getUser._id,
      betAmount: numericAmount,
    };
    if (betColour) betData.betColour = betColour;
    if (betSize) betData.betSize = betSize;

    // Save bet
    const newBet = await bet.create([betData], { session });

    // 🔥 UPDATED BALANCE DEDUCTION LOGIC
    // Case 1: If withdrawable balance covers the full bet
    if (getUser.withdrawableBalance >= numericAmount) {
      getUser.balance -= numericAmount;
      getUser.withdrawableBalance -= numericAmount;
    } 
    // Case 2: If withdrawable balance is less than bet amount
    else {
      const remaining = numericAmount - getUser.withdrawableBalance;
      getUser.balance -= numericAmount;
      getUser.withdrawableBalance = 0; // Set to zero (not negative)
    }

    // Ensure withdrawable never exceeds main balance (safety check)
    if (getUser.withdrawableBalance > getUser.balance) {
      getUser.withdrawableBalance = getUser.balance;
    }

    await getUser.save({ session });
    await session.commitTransaction();
    
    return res.json({ 
      success: true, 
      message: "bet placed successfully",
      newBalance: getUser.balance,
      newWithdrawableBalance: getUser.withdrawableBalance
    });
    
  } catch (error) {
    await session.abortTransaction();
    return res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

const getBetHistory = async (req, res) => {
  try{
    const {userId} = req.body;
    
   // check req body
  if (!userId) {
    throw new Error("please login");
  }

//   check userid
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("invalid user");
  }


  const allBets = await bet.find({userId}).lean().sort({createdAt:-1})
 return res.json({success:true , allBets})
  
  }catch(err){
    return res.status(500).json({success:false , message:err.message})
  }
};



module.exports = { handlePlaceBet, getBetHistory };
