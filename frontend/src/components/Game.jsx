import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Timer from "../components/Timer";
import axios from "axios";
import { toast } from "react-toastify";

// Color options for structured rendering
const COLOURS = [
  { name: "green", label: "Join Green", bg: "bg-green-600" },
  { name: "violet", label: "Join Violet", bg: "bg-violet-700" },
  { name: "red", label: "Join Red", bg: "bg-red-500" },
];

// Big/Small buttons
const SIZE_OPTIONS = [
  { label: "Big", bg: "bg-yellow-500" },
  { label: "Small", bg: "bg-blue-500" },
];

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);
  const [betInp, setBetInp] = useState(100);
  const {
    selectedBetColour,
    setSelectedBetColour,
    balance,
    setBalance,
    setBetValue,
    userData,
    period,
    BACKEND_URL,
  } = useContext(AppContext);

  function handelBettingWindow(colour) {
    setIsBetPopOpen(true);
    setSelectedBetColour(colour);
  }

  async function handelPlaceBet() {
    if (betInp > balance || betInp <= 0) {
      return toast.error("invalid bet amount")  
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/bet`,
        {
          userId: userData._id,
          betAmount: betInp,
          period,
          betColour: selectedBetColour,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setBetValue(betInp);
        setBalance((prevBalance) => prevBalance - betInp);
        setIsBetPopOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handelCloseBetting() {
    setIsBetPopOpen(false);
  }

  return (
    <div className="Game-container mt-8 p-4 text-gray-700 mb-8 bg-gray-100">
      {/* Colour Buttons */}
      <div className="game-selection mt-8 text-white flex gap-4 justify-center">
        {COLOURS.map((colour) => (
          <button
            key={colour.name}
            onClick={() => handelBettingWindow(colour.name)}
            className={`${colour.bg} px-4 py-2 rounded font-semibold shadow hover:opacity-90 transition`}
          >
            {colour.label}
          </button>
        ))}
      </div>

      {/* Big / Small Buttons */}
      <div className="flex justify-center mt-6 gap-3">
        {SIZE_OPTIONS.map((option) => (
          <button
            key={option.label}
            className={`${option.bg} text-white px-12 py-2 rounded-full`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Number Buttons */}
      <div className="mt-8 grid grid-cols-5 gap-4 justify-center">
        {[...Array(10).keys()].map((num) => (
          <button
            key={num}
            className={`w-12 h-12 rounded-full text-white text-xl font-semibold shadow-md transform transition duration-200 hover:scale-110 ${num === 0
                ? "bg-gradient-to-tr from-red-500 via-pink-500 to-violet-600"
                : num % 2 === 0
                  ? "bg-gradient-to-br from-green-400 to-emerald-600"
                  : "bg-gradient-to-br from-red-400 to-pink-500"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Betting Popup */}
      {isBetPopOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-60">
            <h2 className="text-2xl font-semibold mb-4">
              Place your bet on {selectedBetColour}
            </h2>

            {/* Bet Input */}
            <div className="flex gap-4 items-center justify-center mb-6">
              <button
                onClick={() => setBetInp(betInp - 10)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-3 py-1 text-xl"
              >
                -
              </button>
              <input
                type="number"
                value={betInp}
                onChange={(e) => setBetInp(Number(e.target.value))}
                className="w-[150px] p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => setBetInp(betInp + 10)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md px-3 py-1 text-xl"
              >
                +
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 items-center justify-center mb-5">
              {[10, 50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetInp(amount)}
                  className="border text-amber-900 border-black px-2"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Multiplier Buttons */}
            <div className="flex items-center gap-4 justify-center mb-5">
              {[2, 3, 5, 10].map((multiplier) => (
                <button
                  key={multiplier}
                  onClick={() => setBetInp(betInp * multiplier)}
                  className="shadow text-white bg-blue-500 px-2"
                >
                  {multiplier}x
                </button>
              ))}
            </div>

            {/* Bet & Close Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handelPlaceBet}
                className={`${selectedBetColour === "green"
                    ? "bg-green-500"
                    : selectedBetColour === "violet"
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
