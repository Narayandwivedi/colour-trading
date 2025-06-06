import { useContext, useState} from "react";
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
  { label: "big", bg: "bg-yellow-500" },
  { label: "small", bg: "bg-blue-500" },
];

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);

  const [betInp, setBetInp] = useState(100);
  const {
    selectedBetColour,
    setSelectedBetColour,
    selectedBetSize , setSelectedBetSize,
    balance,
    setBalance,
    setBetValue,
    userData,
    period,
    timer,
    BACKEND_URL,
  } = useContext(AppContext);
  

  function handelBettingWindow(colour) {
    setSelectedBetSize(null)
    setIsBetPopOpen(true);
    setSelectedBetColour(colour);
  }

  function handleSizeBettingWindow(size){
    setSelectedBetColour(null)
    setIsBetPopOpen(true)
    setSelectedBetSize(size)

  }


  async function handelPlaceBet() {
    if (betInp > balance || betInp <= 0) {
      return toast.error("invalid bet amount")
    }
    if(!selectedBetColour && !selectedBetSize){
      return toast.error('sorry! error while plcing bet')
    }
    console.log(betInp , selectedBetColour , selectedBetSize);
    
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/bet`,
        {
          userId: userData._id,
          betAmount: betInp,
          period,
          betColour: selectedBetColour,
          betSize : selectedBetSize,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setBalance((prevBalance) => prevBalance - betInp);
        setBetValue(betInp);
    
        // if(selectedBetColour){
        //   setBetPlaced((prev)=>({...prev , colour:selectedBetColour , value:betInp}))
        // }
        // else if(selectedBetSize){
        //   setBetPlaced((prev)=>({...prev , size:selectedBetSize , value:betInp}))
        // }
        setIsBetPopOpen(false);
        setSelectedBetColour(null)
        setSelectedBetSize(null)
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="Game-container relative mt-8 p-4 text-gray-700 mb-8 bg-gray-100">
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

        {/* bet popup */}
      {isBetPopOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Place your bet on <span className={`capitalize font-extrabold ${
                selectedBetColour === "green"? "text-green-600":
                selectedBetColour === "violet" ? "text-violet-600":
                selectedBetColour === 'red'?"text-red-600":
                selectedBetSize === 'big'?'text-yellow-600':
                selectedBetSize === 'small'?'text-blue-600':""
                }`}>
                {selectedBetColour?selectedBetColour:selectedBetSize}
              </span>
            </h2>


          {/* Bet Input and increment decrement button */}

            {/* bet amount decrement button */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setBetInp(betInp - 10)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow"
              >
                −
              </button>

              {/* bet input */}
              <input
                type="number"
                value={betInp}
                onChange={(e) => setBetInp(Number(e.target.value))}
                className="w-32 p-2 text-center border border-gray-300 rounded-lg text-lg font-semibold shadow"
              />

              {/* bet amount increment button */}
              <button
                onClick={() => setBetInp(betInp + 10)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow"
              >
                +
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {[10, 50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetInp(amount)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border shadow"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Multiplier Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              {[2, 3, 5, 10].map((x) => (
                <button
                  key={x}
                  onClick={() => setBetInp(betInp * x)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow"
                >
                  {x}x
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">

              {/* place bet */}
              <button
                onClick={handelPlaceBet}
                className={`${
                  selectedBetColour === "green"? "bg-green-600"
                  : selectedBetColour === "violet"? "bg-violet-600": 
                  selectedBetColour==='red'?"bg-red-600 ":
                  selectedBetSize === 'big'?'bg-yellow-600':
                  selectedBetSize === 'small'?'bg-blue-600':""
                  } text-white w-1/2 py-2 rounded-xl font-bold shadow transition-all`}
              >
                Place Bet
              </button>

              {/* cancel bet */}
              <button
                onClick={()=>{ setIsBetPopOpen(false);}}
                className="bg-gray-400 hover:bg-gray-500 text-white w-1/2 py-2 rounded-xl font-semibold shadow transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="absolute inset-0 bg-black bg-opacity-70 z-40">

      </div> */}
    </div>
  );
}
