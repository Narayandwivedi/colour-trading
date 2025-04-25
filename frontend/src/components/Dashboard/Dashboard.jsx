import { useState, useEffect, useContext } from "react";
import Topbar from "../Topbar";
import Game from "./Game";
import Result from "./Result";
import { AppContext } from "../../context/AppContext";

export default function Dashboard() {

  const {
    selectedColour,setSelectedColour,
    winAmt,setWinAmt,
    showWinner, setShowWinner,
    timer, setTimer,
    availBalance,setAvailBalance,
    winners , setWinners,
    betValue ,setBetValue

  } = useContext(AppContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        return Math.max(prevTimer - 1, 0);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      // for colour
      const randomNum = Math.floor(Math.random() * 3);
      const colour = randomNum === 0 ? "red":"green"
      // for big small
      const randomForBigSmall = Math.floor(Math.random()*3)
      const bigOrsmall = randomForBigSmall===0?"small":"big"

      // check winner
      if (selectedColour && betValue) {
        if (selectedColour === colour) {
          let totalWin = betValue * 2;
          setWinAmt(totalWin);
          setShowWinner(true);
          setAvailBalance((prevValue) => {
            return prevValue + totalWin;
          });
        } else {
          console.log("you lost" );
        }
      }
      setBetValue(null);
      setWinners([{ winColour: colour , winBigSmall:bigOrsmall }, ...winners]);
      setTimer(10);
    }
  }, [timer]);

  return (
    <>
      <Topbar/>
      <Game/>
      <Result/>


      {/* win popup */}

      {showWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-96 bg-gradient-to-b from-orange-400 to-orange-200 p-6 rounded-lg shadow-lg">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-4">
              <h2 className="text-2xl font-bold text-center text-white">
                Congratulation
              </h2>
              <button
                className="absolute top-0 right-0 text-white text-2xl"
                onClick={() => setShowWinner(!showWinner)}
              >
                <i className="fa-regular fa-circle-xmark"></i>
              </button>
            </div>

            {/* Badge or Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-trophy text-2xl"></i>
              </div>
            </div>

            {/* Winning Amount */}
            <p className="text-center text-3xl font-bold text-green-600 mb-2">
              {winAmt}
            </p>
            <p className="text-center text-gray-700 font-medium">Well Done!</p>
          </div>
        </div>
      )}
    </>
  );
}
