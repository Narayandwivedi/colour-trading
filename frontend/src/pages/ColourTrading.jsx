import { useState, useEffect, useContext } from "react";
import Topbar from "../components/Topbar"
import Game from "../components/Game";
import Result from "../components/Result";
import Timer from "../components/Timer"
import { AppContext } from "../context/AppContext";

export default function ColourTrading() {

  const {
    selectedBetColour,setSelectedBetColour,
    showWinner, setShowWinner,
    betValue,
    setBetValue,
    winColour , setWinColour,
    timer,
  } = useContext(AppContext);

//   useEffect(() => {
//     if (timer === 0) {
//       if (selectedColour && betValue) {
//         if (selectedColour === winColour) {
//           let totalWin = betValue * 2;
//           setWinAmt(totalWin);
//           setShowWinner(true);
//           setAvailBalance((prevValue) => {
//             return prevValue + totalWin;
//           });
//         } else {
//           console.log("you lost" );
//         }
//       }
//       setBetValue(null);
//  }
//   }, [timer]);



  return (
    <>
      <Topbar/>
      <Timer/>
      <Game/>
      <Result/>
    </>
  );
}
