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
        return res.json({ success: false, message: "Bet on both colour and size is not allowed at the same time" });
    }

    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
        return res.json({ success: false, message: "invalid userId" });
    }

    // Validate betAmount
    const numericAmount = Number(betAmount);
    if (isNaN(numericAmount) || numericAmount < 1 || !Number.isInteger(numericAmount)) {
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

        if (numericAmount > getUser.balance) {
            throw new Error("insufficient balance");
        }

        // Validate game
        const checkGame = await game.findOne({ period }).session(session);
        if (!checkGame) throw new Error("game period not found");


        console.log(checkGame.period, `:`, checkGame.status);
        
        if(checkGame.status==='closed'){
            throw new Error('bet is not allowed period closed')
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

        // Deduct balance
        getUser.balance -= numericAmount;
        await getUser.save({ session });

        await session.commitTransaction();
        return res.json({ success: true, message: "bet placed successfully" });

    } catch (error) {
        await session.abortTransaction();
        return res.json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};


module.exports = { handlePlaceBet };
