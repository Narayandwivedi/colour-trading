import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import Timer from "../components/Timer"
import axios from "axios";
import {toast} from "react-toastify"

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);
  const [betInp, setBetInp] = useState(100);
  const {
    selectedColour,
    setSelectedColour,
    availBalance,
    setAvailBalance,
    timer,
    setBetValue,
    userData,
    period,
    BACKEND_URL,
  } = useContext(AppContext);

  
  function handelBettingWindow(colour) {
    setIsBetPopOpen(true);
    setSelectedColour(colour);
  }

  async function handelPlaceBet() {
    if (betInp > availBalance || betInp <= 0) {
      alert("invalid bet amount");
      return;
    }
    console.log(userData._id);
    try{
     const {data} = await axios.post(`${BACKEND_URL}/api/bet`,{
      userId : userData._id,
      betAmount:betInp,
      period,
      betColour:selectedColour
     },{
      withCredentials:true
     })
     console.log(data);
     if(data.success){
      toast.success(data.message)
      setBetValue(betInp)
     }
     
    setBetValue(betInp);
    setIsBetPopOpen(false);
    setAvailBalance((prevBalance) => {
      return prevBalance - betInp;
    });
    }catch(err){
      console.log(err);
      
    }
    
  }

  function handelCloseBetting() {
    setIsBetPopOpen(false);
  }

  return (
    
    <div className="Game-container mt-8 p-4 text-gray-700 mb-8 bg-gray-100">
     
      {/* colours */}

      <div className="game-selection mt-8 text-white">
        <button
          onClick={() => {
            handelBettingWindow("green");
          }}
          style={{ padding: "10px 12px", backgroundColor: "#4ab24a" }}
        >
          Join Green
        </button>
        <button
          onClick={() => {
            handelBettingWindow("violet");
          }}
          style={{ padding: "10px 12px", backgroundColor: "#9e27b2" }}
        >
          Join Violet
        </button>
        <button
          onClick={() => {
            handelBettingWindow("red");
          }}
          style={{ padding: "10px 12px", backgroundColor: "#f64136" }}
        >
          Join Red
        </button>
      </div>

      {/* big small */}

      <div className="flex justify-center mt-6 gap-3">
        <button className="bg-yellow-500 text-white px-12 py-2 rounded-full">
          Big
        </button>
        <button className="bg-blue-500 text-white px-12 py-2 rounded-full">
          small
        </button>
      </div>

      {/* numbers */}

      <div className="mt-8 grid grid-cols-5 gap-3">
        <button className="bg-gradient-to-r from-red-500 to-violet-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          0
        </button>
        <button className="bg-gradient-to-r from-green-500 to-red-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          1
        </button>
        <button className="bg-gradient-to-r from-red-500 to-green-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          2
        </button>
        <button className="bg-gradient-to-r from-green-500 to-red-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          3
        </button>
        <button className="bg-gradient-to-r from-red-500 to-green-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          4
        </button>
        <button className="bg-gradient-to-r from-green-500 to-red-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          5
        </button>
        <button className="bg-gradient-to-r from-red-500 to-violet-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          6
        </button>
        <button className="bg-gradient-to-r from-green-500 to-red-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          7
        </button>
        <button className="bg-gradient-to-r from-red-500 to-green-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          8
        </button>
        <button className="bg-gradient-to-r from-green-500 to-red-500 w-[40px] h-[40px] text-white text-xl rounded-full">
          9
        </button>
      </div>

      {/* betting popup window on colour */}
      {isBetPopOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6  rounded-lg shadow-lg w-96 z-60">
            <h2 className="text-2xl font-semibold mb-4">
              Place your bet on {selectedColour}{" "}
            </h2>

            {/* bet amount input */}
            <div className="flex gap-4 items-center justify-center mb-6 ">
              {/* decrement button */}
              <button
                onClick={() => {
                  setBetInp(betInp - 10);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-3 py-1 text-xl"
              >
                -
              </button>
              <input
                type="number"
                placeholder="Enter amount"
                value={betInp}
                onChange={(e) => {
                  setBetInp(e.target.value);
                }}
                className="w-[150px] p-2 border border-gray-300 rounded-lg"
              />
              {/* increment button  */}
              <button
                onClick={() => {
                  setBetInp(betInp + 10);
                }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md px-3 py-1 text-xl"
              >
                +
              </button>
            </div>

            {/* all bet amounts button */}

            <div className="flex gap-2 items-center justify-center mb-5">
              <button
                onClick={() => {
                  setBetInp(10);
                }}
                className="border text-amber-900  border-black px-2"
              >
                ₹10
              </button>
              <button
                onClick={() => {
                  setBetInp(50);
                }}
                className="border text-amber-900 border-black px-2"
              >
                ₹50
              </button>
              <button
                onClick={() => {
                  setBetInp(100);
                }}
                className="border text-amber-900 border-black px-2"
              >
                ₹100
              </button>
              <button
                onClick={() => {
                  setBetInp(200);
                }}
                className="border text-amber-900 border-black px-2"
              >
                ₹200
              </button>
              <button
                onClick={() => {
                  setBetInp(500);
                }}
                className="border text-amber-900 border-black px-2"
              >
                ₹500
              </button>
            </div>

            {/* bet amount multiplier button */}

            <div className="flex items-center gap-4 justify-center mb-5 ">
              <button
                onClick={() => {
                  setBetInp(betInp * 2);
                }}
                className="shadow text-white bg-blue-500 px-2"
              >
                2x
              </button>
              <button
                onClick={() => {
                  setBetInp(betInp * 3);
                }}
                className="shadow text-white bg-blue-500 px-2"
              >
                3x
              </button>
              <button
                onClick={() => {
                  setBetInp(betInp * 5);
                }}
                className="shadow text-white bg-blue-500 px-2"
              >
                5x
              </button>
              <button
                onClick={() => {
                  setBetInp(betInp * 10);
                }}
                className="shadow text-white bg-blue-500 px-2"
              >
                10x
              </button>
            </div>

            {/* place bet and betting-close buttons */}

            <div className="flex justify-between">
              <button
                onClick={handelPlaceBet}
                className={`${
                  selectedColour === "green"
                    ? "bg-green-500"
                    : selectedColour === "violet"
                    ? "bg-violet-500"
                    : "bg-red-500"
                } text-white p-2 rounded-lg w-1/2 mr-2`}
              >
                Place Bet
              </button>
              <button
                onClick={handelCloseBetting}
                className="bg-gray-500 text-white p-2 rounded-lg w-1/2 ml-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
