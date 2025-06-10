import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [winAmount, setWinAmount] = useState(null);
  const [showLoser , setShowLoser] = useState(false)

  const [latestPeriod, setLatestPeriod] = useState(null); // Local tracking
  const intervalRef = useRef(null);

  const {
    BACKEND_URL,
    gameType, timer,
    selectedBetColour,
    setSelectedBetColour,
    selectedBetSize,
    setSelectedBetSize,
    betValue,
    showWinner,
    setShowWinner,
    setBetValue,
    setBalance,
  } = useContext(AppContext);

  const fetch_30_results = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/result/${gameType}`);
      console.log(data);
      
      const latest = data.results[0];

      // Only update when new period is detected
      if (latest && latest.period !== latestPeriod) {
        setResults(data.results);

        //check winner logic 
        if ((selectedBetColour||selectedBetSize) && betValue) {
          if (selectedBetColour === data.results[0].colour || selectedBetSize === data.results[0].size) {
            setWinAmount(betValue * 2);
            setBalance((prevBalance) => prevBalance + (betValue * 2))
            setShowWinner(true)
        
          }
          else {
           setShowLoser(true)
          }
          setBetValue(null)
          setSelectedBetColour(null)
          setSelectedBetSize(null)
        }
        setLatestPeriod(latest.period);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      console.log("Error fetching results:", err.message);
    }
  };

  // Initial fetch when gameType changes
  useEffect(() => {
    fetch_30_results();
  }, [gameType]);

  // Polling logic when timer is below threshold
  useEffect(() => {
    if (timer <= 1 && !intervalRef.current) {
      console.log("start polling for result");

      intervalRef.current = setInterval(fetch_30_results, 800); // Fast polling
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer]);

  return (
    <div className="result-container mb-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-trophy text-white text-sm"></i>
        </div>
        <span className="text-gray-800 font-bold text-xl">Results History</span>
      </div>

      {/* Gradient divider */}
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-5 shadow-sm"></div>

      {/* Results Grid - Mobile Optimized */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-4">
          <div className="grid gap-2 text-white text-sm font-semibold" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
            <div className="text-center">Period</div>
            <div className="text-center">Size</div>
            <div className="text-center">Number</div>
            <div className="text-center">Color</div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.map((item, index) => (
            <div 
              key={index} 
              className={`grid gap-2 px-3 py-4 border-b border-gray-100 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-teal-50 transition-colors duration-200`}
              style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}
            >
              {/* Period */}
              <div className="text-center flex justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-sm">
                  <span className="block truncate text-xs leading-tight">
                    {item.period}
                  </span>
                </div>
              </div>

              {/* Size */}
              <div className="text-center">
                <span className={`text-xs font-bold px-2 py-1.5 rounded-full shadow-sm ${
                  item.size === 'Big' 
                    ? 'bg-orange-200 text-orange-800' 
                    : 'bg-purple-200 text-purple-800'
                }`}>
                  {item.size}
                </span>
              </div>

              {/* Number */}
              <div className="text-center">
                <div className="bg-gray-200 text-gray-800 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  {item.number}
                </div>
              </div>

              {/* Color */}
              <div className="flex justify-center items-center">
                <div className={`w-6 h-6 rounded-full shadow-lg border-2 border-white ${
                  item.colour === "red" 
                    ? "bg-gradient-to-r from-red-500 to-red-600" 
                    : "bg-gradient-to-r from-green-500 to-green-600"
                }`}>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">🎯</div>
            <p className="text-lg font-medium">No results available</p>
          </div>
        )}
      </div>

      {/* Win Popup - No Animation */}
      {showWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-8 rounded-3xl shadow-2xl">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:scale-110 transition transform"
              onClick={() => setShowWinner(false)}
            >
              <i className="fa-regular fa-circle-xmark drop-shadow-lg"></i>
            </button>

            {/* Trophy & Glow */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute w-full h-full rounded-full bg-yellow-300 blur-xl opacity-70"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <i className="fa-solid fa-trophy text-4xl text-yellow-700 drop-shadow-md"></i>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg">🎉 You Won! 🎉</h2>
              <p className="text-lg text-white font-medium mb-8 opacity-90">Congratulations!</p>

              {/* Winning Amount */}
              <div className="bg-white text-green-600 text-4xl font-extrabold py-4 px-10 rounded-2xl shadow-xl border-2 border-green-400 mb-6">
                ₹{winAmount}
              </div>

              {/* Celebration */}
              <p className="text-white font-semibold text-sm opacity-90 text-center">
                Amazing! Keep playing to win even more! 🚀
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lose Popup - No Animation */}
      {showLoser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-red-500 mb-3">
                Better Luck Next Time!
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Don't give up! Every game is a new chance to win big! 🎯
              </p>
              <button
                onClick={() => {setShowLoser(false)}}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all transform hover:scale-105"
              >
                Try Again 🎮
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}