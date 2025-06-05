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

        if (selectedBetColour && betValue) {
          if (selectedBetColour === data.results[0].colour) {
            setWinAmount(betValue * 2);
            setBalance((prevBalance) => prevBalance + (betValue * 2))
            setShowWinner(true)
          }
          else {
           setShowLoser(true)
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

      intervalRef.current = setInterval(fetch_30_results, 500); // Fast polling
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer]);

  return (
    <div className="result-container mb-6">
      <p className="flex gap-4 text-gray-500 justify-center mb-3">
        <i className="fa-solid fa-trophy text-xl "></i>
        <span>Period</span>
      </p>
      <hr style={{ border: "1px solid #019688" }} />

      <div className="result-history overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Period
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Big/Small
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Number
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border text-[14px] border-gray-300 px-1 text-center py-2 text-gray-700">
                  {item.period}
                </td>
                <td className="border border-gray-300 text-center py-2 text-gray-700">
                  {item.size}
                </td>
                <td className="border border-gray-300 text-center py-2 text-gray-700">
                  {item.number}
                </td>
                <td>
                  <div
                    className={`w-4 h-4 ${item.colour === "red" ? "bg-red-500" : "bg-green-500"
                      } rounded-full mx-auto`}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* win popup */}

      {showWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="relative w-96 bg-gradient-to-b from-yellow-400 to-orange-300 p-6 rounded-2xl shadow-2xl animate-bounce-in">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white text-2xl hover:scale-110 transition"
              onClick={() => setShowWinner(false)}
            >
              <i className="fa-regular fa-circle-xmark"></i>
            </button>

            {/* Trophy & Glow */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute w-full h-full rounded-full bg-yellow-400 blur-lg opacity-50 animate-ping"></div>
                <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                  <i className="fa-solid fa-trophy text-3xl text-white"></i>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">Congratulations!</h2>
              <p className="text-lg text-white font-medium mb-4">You've won</p>

              {/* Winning Amount */}
              <div className="bg-white text-green-600 text-4xl font-extrabold py-2 px-6 rounded-xl shadow-md border-2 border-green-500">
                ₹{winAmount}
              </div>

              {/* Celebration */}
              <p className="mt-4 text-white font-medium text-sm opacity-90">Keep it up and win more!</p>
            </div>
          </div>
        </div>
      )}

      {/* lose popup */}
    {
      showLoser&&(
         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full max-w-sm mx-4 animate-popup">
          <div className="text-center">
            <div className="text-6xl mb-3">😞</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              You Lost
            </h2>
            <p className="text-gray-700 mb-4">Better luck next time!</p>
            <button
              onClick={()=>{setShowLoser(false)}}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      )
    } 

    </div>
  );
}
