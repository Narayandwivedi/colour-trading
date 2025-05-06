const game = require("./models/game");

let num = 1;

function getPeriod() {
  const now = new Date();
  const year = now.getFullYear(); // 2025
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(now.getDate()).padStart(2, "0"); // 01-31
  const hour = now.getHours(); // 0-23 (no padStart)
  const customFormat = `${year}${month}${day}${hour}${num}`;
  num++;
  return customFormat;
}

function colourGenerator() {
  const colours = ["red", "green"];
  const randomColour = colours[Math.floor(Math.random() * colours.length)];
  return randomColour;
}

setInterval(async () => {
  const period = getPeriod();
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
  }, 30000);
}, 30000);
