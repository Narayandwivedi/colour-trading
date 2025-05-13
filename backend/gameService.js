const game = require("./models/game")


async function getPeriod() {
const count = await game.countDocuments();
const now = new Date();
const year = now.getFullYear(); // 2025
const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
const day = String(now.getDate()).padStart(2, "0"); // 01-31
const hour = now.getHours(); // 0-23 (no padStart)
const customFormat = `${year}${month}${day}${hour}${count+1}`;
console.log(count+1);

return customFormat;
}

function colourGenerator() {
const colours = ["red", "green"];
const randomColour = colours[Math.floor(Math.random()*colours.length)];
return randomColour;
}

setInterval(async () => {
const period = await getPeriod();
const newGame = await game.create({
period,
});
console.log("period : ", newGame);
const colour = colourGenerator();
setTimeout(async () => {
newGame.colour = colour;
newGame.status = "closed";
const updatedGame = await newGame.save();
console.log(updatedGame);
}, 10000);
}, 10000);