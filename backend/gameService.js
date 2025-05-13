const game = require("./models/game");
const cron = require('node-cron');

// Constants
const COLOURS = ["red", "green"];
let num = 1;

// Improved period generator that doesn't rely on count
async function generatePeriodId() {
    try {
        
        const now = new Date();
        const timestamp = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
            now.getHours(),
            num
        ].join('');
        
        return `${timestamp}`; // Example: G20250513154230123
    } catch (error) {
        console.error("Error generating period ID:", error);
        throw error;
    }
}

function getRandomColour() {
    return COLOURS[Math.floor(Math.random() * COLOURS.length)];
    
}

async function executeGameRound() {
    try {
        const period = await generatePeriodId();
        const newGame = await game.create({ 
            period,
            status: "open" 
        });
        console.log(`[${new Date().toISOString()}] Game opened:`, period);
        num++

        // Schedule game closing
        setTimeout(async () => {
            try {
                newGame.colour = getRandomColour();
                newGame.status = "closed";
                await newGame.save();
                console.log(`[${new Date().toISOString()}] Game closed:`, period, "Colour:", newGame.colour);
            } catch (error) {
                console.error("Error closing game:", error);
            }
        },30000);
        
    } catch (error) {
        console.error("Error in game round:", error);
    }
}

// Schedule game rounds every 10 seconds
// Cron pattern: seconds(0-59) minutes(0-59) hours(0-23) day-of-month(1-31) month(1-12) day-of-week(0-7)
cron.schedule('*/30 * * * * *', executeGameRound, {
    scheduled: true,
    timezone: "UTC" // Specify your timezone if needed
});

console.log('Game scheduler started - running every 30 seconds');