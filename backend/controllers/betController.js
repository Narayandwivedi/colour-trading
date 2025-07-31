const mongoose = require("mongoose");
const bet = require("../models/bet");
const user = require("../models/user");
const game = require("../models/game");

const handlePlaceBet = async (req, res) => {
  const { userId, betAmount, period, betColour, betSize , betNumber } = req.body;


  console.log(userId,betAmount);
  

  // Validate required fields
  if (!userId || !period || !betAmount || (!betColour && !betSize && (betNumber===null || betNumber===undefined))) {
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

  if (numericAmount > 2000000) {
    return res.json({ success: false, message: "bet amount exceed" });
  }

  // Validate betColour if present
  if (betColour && betColour !== "red" && betColour !== "green" && betColour!=='violet') {
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
    if (betNumber!==null || betNumber!==undefined) betData.betNumber = betNumber

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

const getAllBets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, period, userId } = req.query;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100"
      });
    }
    
    // Build filter object
    const filter = {};
    
    if (status && ['pending', 'win', 'lost'].includes(status)) {
      filter.status = status;
    }
    
    if (period) {
      const periodNum = parseInt(period);
      if (!isNaN(periodNum)) {
        filter.period = periodNum;
      }
    }
    
    if (userId && mongoose.isValidObjectId(userId)) {
      filter.userId = userId;
    }
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination info
    const totalBets = await bet.countDocuments(filter);
    
    // Fetch bets with pagination and populate user info
    const allBets = await bet
      .find(filter)
      .populate('userId', 'fullName email mobile')
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalBets / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    return res.json({
      success: true,
      data: {
        bets: allBets,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBets,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      }
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



module.exports = { handlePlaceBet, getBetHistory, getAllBets };
