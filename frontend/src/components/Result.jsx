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
          if (selectedBetColour === data.results[0].colour) {
            setWinAmount(betValue * 2);
            setBalance((prevBalance) => prevBalance + (betValue * 2))
            setShowWinner(true)
            setBetValue(null)
            setSelectedBetColour(null)
            setSelectedBetSize(null)
        
          }
          else {
           setShowLoser(true)
            setBetValue(null)
            setSelectedBetColour(null)
            setSelectedBetSize(null)
          }
          setBetValue(null)
          setSelectedBetColour(null)
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-trophy text-white text-sm"></i>
        </div>
        <span className="text-gray-700 font-semibold text-lg">Results History</span>
      </div>

      {/* Gradient divider */}
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-4"></div>

      {/* Results Grid - Mobile Optimized */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-2 py-3">
          <div className="grid gap-1 text-white text-sm font-medium" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
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
              className={`grid gap-1 px-2 py-3 border-b border-gray-100 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-teal-50 transition-colors duration-200`}
              style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}
            >
              {/* Period */}
              <div className="text-center flex justify-center">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-bold px-1 py-1 rounded-lg max-w-full overflow-hidden">
                  <span className="block truncate text-xs leading-tight">
                    {item.period}
                  </span>
                </div>
              </div>

              {/* Size */}
              <div className="text-center">
                <span className={`text-xs font-semibold px-1 py-1 rounded-full ${
                  item.size === 'Big' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {item.size}
                </span>
              </div>

              {/* Number */}
              <div className="text-center">
                <div className="bg-gray-100 text-gray-800 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center mx-auto">
                  {item.number}
                </div>
              </div>

              {/* Color */}
              <div className="flex justify-center items-center">
                <div className={`w-5 h-5 rounded-full shadow-md border-2 border-white ${
                  item.colour === "red" 
                    ? "bg-gradient-to-r from-red-400 to-red-500" 
                    : "bg-gradient-to-r from-green-400 to-green-500"
                }`}>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>No results available</p>
          </div>
        )}
      </div>

      {/* Win Popup */}
      {showWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-6 rounded-3xl shadow-2xl animate-bounce">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white text-2xl hover:scale-110 transition transform"
              onClick={() => setShowWinner(false)}
            >
              <i className="fa-regular fa-circle-xmark drop-shadow-lg"></i>
            </button>

            {/* Trophy & Glow */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute w-full h-full rounded-full bg-yellow-300 blur-xl opacity-70 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <i className="fa-solid fa-trophy text-3xl text-yellow-700 drop-shadow-md"></i>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">🎉 You Won! 🎉</h2>
              <p className="text-lg text-white font-medium mb-6 opacity-90">Congratulations!</p>

              {/* Winning Amount */}
              <div className="bg-white text-green-600 text-4xl font-extrabold py-3 px-8 rounded-2xl shadow-xl border-2 border-green-400 mb-4">
                ₹{winAmount}
              </div>

              {/* Celebration */}
              <p className="text-white font-medium text-sm opacity-90 text-center">
                Amazing! Keep playing to win even more! 🚀
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lose Popup */}
      {showLoser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-bounce">
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