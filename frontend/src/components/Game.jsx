import { useContext, useState,useEffect} from "react";
import { AppContext } from "../context/AppContext";
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
  { label: "big", bg: "bg-yellow-500" },
  { label: "small", bg: "bg-blue-500" },
];

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);

  const [betInp, setBetInp] = useState(100);
  const {
    selectedBetColour,
    setSelectedBetColour,
    selectedBetSize ,
    setSelectedBetSize,
    selectedBetNumber,
    setSelectedBetNumber,

    balance,
    setBalance,
    userData,
    period,
    timer,
    BACKEND_URL,
    betAllowed , setBetAllowed,
    activeBets,
    setActiveBets
  } = useContext(AppContext);
  
  useEffect(() => {
  if (timer <= 5  && betAllowed) {
    setBetAllowed(false);
    setIsBetPopOpen(false)
    // console.log('bet closed');
  }

  if( timer>5 && !betAllowed){
    
    setBetAllowed(true)
    // console.log('bet open');
  }
}, [timer, betAllowed]);
  

  function handelBettingWindow(colour) {
    setSelectedBetSize(null)
    setSelectedBetNumber(null)
    setIsBetPopOpen(true);
    setSelectedBetColour(colour);
  }

  function handleSizeBettingWindow(size){
    setSelectedBetColour(null)
    setSelectedBetNumber(null)
    setIsBetPopOpen(true)
    setSelectedBetSize(size)

  }

  function handleNumberBettingWindow(number){
    setSelectedBetColour(null)
    setSelectedBetSize(null)
    setSelectedBetNumber(number) // Fixed: was selectedBetNumber(Number) - missing 'set'
      console.log(number);
      setIsBetPopOpen(true)
      
  }


  async function handelPlaceBet() {
    if (betInp > balance || betInp <= 0) {
      return toast.error("invalid bet amount")
    }
    // Updated validation to include number betting
    if(!selectedBetColour && !selectedBetSize && selectedBetNumber === null){
      return toast.error('sorry! error while placing bet')
    }
    
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/bet`,
        {
          userId: userData._id,
          betAmount: betInp,
          period,
          betColour: selectedBetColour,
          betSize : selectedBetSize,
          betNumber: selectedBetNumber, // Added number betting to API call
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setBalance((prevBalance) => prevBalance - betInp);
          // Add the bet to activeBets array including number
            const newBet = {
                betValue: betInp,
                selectedBetColour: selectedBetColour,
                selectedBetSize: selectedBetSize,
                selectedBetNumber: selectedBetNumber, // Added number to active bets
                period: period,
            };
            setActiveBets((prevBets) => [...prevBets, newBet]);
            console.log(activeBets);
            
            setIsBetPopOpen(false);
       
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="Game-container relative mt-8 p-4 text-gray-700 mb-8 bg-gray-100">
      {/* Colour Buttons */}
      <div className="game-selection mt-8 text-white flex gap-2 justify-center">
        {COLOURS.map((colour) => (
          <button
            key={colour.name}
            onClick={() => handelBettingWindow(colour.name)}
            className={`${colour.bg} px-3 py-2 rounded font-semibold shadow hover:opacity-90 transition`}
          >
            {colour.label}
          </button>
        ))}
      </div>

      {/* Big / Small Buttons */}
      <div className="flex justify-center mt-6 gap-3">
        {SIZE_OPTIONS.map((option) => (
          <button
            onClick={()=>{handleSizeBettingWindow(option.label)}}
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
            onClick={()=>{handleNumberBettingWindow(num)}}
            key={num}
            className={`w-11 h-11 rounded-full text-white text-xl font-semibold shadow-md transform transition duration-200 hover:scale-110 ${num === 0
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

        {/* bet popup */}
    
        {isBetPopOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-white/20">
              
              {/* Popup Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-3xl p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  🎯 Place Your Bet
                </h2>
                <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                  selectedBetColour === "green" ? "bg-green-500" :
                  selectedBetColour === "violet" ? "bg-violet-500" :
                  selectedBetColour === "red" ? "bg-red-500" :
                  selectedBetSize === "big" ? "bg-yellow-500" :
                  selectedBetSize === "small" ? "bg-blue-500" : 
                  selectedBetNumber !== null ? (
                    selectedBetNumber === 0 ? "bg-gradient-to-tr from-red-500 via-pink-500 to-violet-600" :
                    selectedBetNumber % 2 === 0 ? "bg-gradient-to-br from-green-400 to-emerald-600" :
                    "bg-gradient-to-br from-red-400 to-pink-500"
                  ) : "bg-gray-500"
                }`}>
                  {selectedBetColour ? selectedBetColour.toUpperCase() : 
                   selectedBetSize ? selectedBetSize.toUpperCase() :
                   selectedBetNumber !== null ? `NUMBER ${selectedBetNumber}` : "SELECT BET"}
                </div>
              </div>

              <div className="p-6">
                {/* Bet Input Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Bet Amount
                  </label>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() => setBetInp(Math.max(10, betInp - 10))}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white w-12 h-12 rounded-full text-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={betInp}
                      onChange={(e) => setBetInp(Number(e.target.value))}
                      className="w-32 p-3 text-center border-2 border-gray-200 rounded-xl text-xl font-bold shadow-inner bg-gray-50 focus:border-purple-500 focus:outline-none transition-colors"
                    />

                    <button
                      onClick={() => setBetInp(betInp + 10)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white w-12 h-12 rounded-full text-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Quick Select
                  </label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[10, 50, 100, 200, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetInp(amount)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 transform hover:scale-105 ${
                          betInp === amount 
                            ? 'bg-purple-500 text-white border-purple-500 shadow-lg' 
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multiplier Buttons */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Multiply Bet
                  </label>
                  <div className="flex justify-center gap-3">
                    {[2, 3, 5, 10].map((x) => (
                      <button
                        key={x}
                        onClick={() => setBetInp(Math.min(balance, betInp * x))}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {x}×
                      </button>
                    ))}
                  </div>
                </div>

         
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handelPlaceBet}
                    className={`flex-1 py-4 rounded-xl font-bold text-white shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 ${
                      selectedBetColour === "green" ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                      selectedBetColour === "violet" ? "bg-gradient-to-r from-purple-500 to-violet-600" :
                      selectedBetColour === "red" ? "bg-gradient-to-r from-red-500 to-pink-600" :
                      selectedBetSize === "big" ? "bg-gradient-to-r from-yellow-500 to-orange-600" :
                      selectedBetSize === "small" ? "bg-gradient-to-r from-blue-500 to-cyan-600" :
                      selectedBetNumber !== null ? "bg-gradient-to-r from-indigo-500 to-purple-600" :
                      "bg-gradient-to-r from-gray-500 to-gray-600"
                    }`}
                  >
                    🎯 Place Bet
                  </button>

                  <button
                    onClick={() => {
                      setIsBetPopOpen(false);
                      setSelectedBetColour(null);
                      setSelectedBetSize(null);
                      setSelectedBetNumber(null); // Reset number selection
                    }}
                    className="flex-1 py-4 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {!betAllowed &&
  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-semibold text-white uppercase tracking-wider">
        Time Remaining
      </h2>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <p className="text-7xl font-bold text-white bg-red-600 px-6 py-4 rounded-xl shadow-lg">
            0
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-7xl font-bold text-white bg-red-600 px-6 py-4 rounded-xl shadow-lg">
            {timer}
          </p>
        </div>
      </div>
    </div>
  </div>
}
    </div>
  );
}