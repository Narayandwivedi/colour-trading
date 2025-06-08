const mongoose = require("mongoose");
const bet = require("../models/bet");
const user = require("../models/user");
const game = require("../models/game");

const handlePlaceBet = async (req, res) => {
  const { userId, betAmount, period, betColour, betSize } = req.body;

  // Validate required fields
  if (!userId || !period || !betAmount || (!betColour && !betSize)) {
    return res.json({ success: false, message: "missing field" });
  }

  // Disallow both colour and size bets together
  if (betColour && betSize) {
    return res.json({
      success: false,
      message: "Bet on both colour and size is not allowed at the same time",
    });
  }

  // Validate userId
  if (!mongoose.isValidObjectId(userId)) {
    return res.json({ success: false, message: "invalid userId" });
  }

  // Validate betAmount
  const numericAmount = Number(betAmount);
  if (
    isNaN(numericAmount) ||
    numericAmount < 1 ||
    !Number.isInteger(numericAmount)
  ) {
    return res.json({ success: false, message: "invalid bet amount" });
  }

  if (numericAmount > 200000) {
    return res.json({ success: false, message: "bet amount exceed" });
  }

  // Validate betColour if present
  if (betColour && betColour !== "red" && betColour !== "green") {
    return res.json({ success: false, message: "invalid bet colour" });
  }

  // Validate betSize if present
  if (betSize && betSize !== "big" && betSize !== "small") {
    return res.json({ success: false, message: "invalid bet size" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate user
    const getUser = await user.findById(userId).session(session);
    if (!getUser) throw new Error("user not found");

    // Check only main balance for betting
    if (numericAmount > getUser.balance) {
      throw new Error("insufficient balance");
    }

    // Validate game
    const checkGame = await game.findOne({ period }).session(session);
    if (!checkGame) throw new Error("game period not found");

    if (checkGame.status === "closed") {
      throw new Error("bet is not allowed period closed");
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

    // SIMPLIFIED BALANCE DEDUCTION - Only from main balance
    getUser.balance -= numericAmount;

    // AUTO-CORRECT: Ensure withdrawable never exceeds main balance
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
