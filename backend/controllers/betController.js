const mongoose = require("mongoose");
const bet = require("../models/bet");
const user = require("../models/user");
const game = require("../models/game");

const handlePlaceBet = async (req, res) => {
    const { userId, betAmount, period, betColour } = req.body;

    // validate req body

    if (!userId || !period || !betAmount) {
        return res.json({ success: false, message: "missing field" });
    }

    // validate user id

    if (!mongoose.isValidObjectId(userId)) {
        return res.json({ success: false, message: "invalid userId" });
    }

    // validate bet amount

    if (isNaN(Number(betAmount)) || betAmount < 1) {
        return res.json({ success: false, message: "invalid bet amount" });
    }

    if (!Number.isInteger(Number(betAmount))) {
        throw new Error("Bet amount must be a whole number");
      }

    if (Number(betAmount)>200000){
        return res.json({success:false , message:"bet amount exceed"})
    }
      

    // validate bet colour

    if (betColour !== "red" && betColour !== "green") {
        return res.json({ success: false, message: "invalid bet colour" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // validate user exist 

        const getUser = await user.findById(userId).session(session);
        if (!getUser) {
            throw new Error("user not found");
        }

        if (betAmount > getUser.balance) {
            throw new Error("insufficient balance");
        }
        // check game session exist or valid

        const checkGame = await game.findOne({ period }).session(session);
        if (!checkGame) {
            throw new Error("game period not found");
        }

        if (checkGame.status === "closed") {
            throw new Error("bet is closed");
        }

        // Create bet
        const newBet = await bet.create([{
            period,
            userId: getUser._id,
            betColour,
            betAmount
        }], { session });

        // Deduct balance
        getUser.balance -= betAmount;
        await getUser.save({ session });

        await session.commitTransaction();
        console.log(`${getUser.fullName} place bet on ${betColour} of amount ${betAmount}`);
        return res.json({ success: true, message: "bet placed successfully" });
    } catch (error) {
        await session.abortTransaction();
        return res.json({ success: false, message: error.message || "transaction failed" });
    }finally{
        session.endSession();
    }
};

module.exports = { handlePlaceBet };
