import { useState, useEffect, useContext } from "react";
import Topbar from "../components/Topbar"
import Game from "../components/Game";
import Result from "../components/Result";
import Timer from "../components/Timer"
import { AppContext } from "../context/AppContext";

export default function ColourTrading() {

  const {
    selectedColour,setSelectedColour,
    winAmt,setWinAmt,
    showWinner, setShowWinner,
    winColour , setWinColour,
    timer,
    betValue,
    setBetValue,
    setAvailBalance
    
    

  } = useContext(AppContext);

  useEffect(() => {
    if (timer === 0) {
      if (selectedColour && betValue) {
        if (selectedColour === winColour) {
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
 }
  }, [timer]);

  return (
    <>
      <Topbar/>
      <Timer/>  
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
