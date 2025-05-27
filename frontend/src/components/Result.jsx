import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [winAmount, setWinAmount] = useState(null);

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
     setBalance
     } = useContext(AppContext);

  const fetch_30_results = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/result/${gameType}`);
      const latest = data.results[0];

      // Only update when new period is detected
      if (latest && latest.period !== latestPeriod) {
        setResults(data.results);
        if (selectedBetColour || betValue) {
          console.log(selectedBetColour, betValue);
          if (selectedBetColour === data.results[0].colour) {
            setWinAmount(betValue * 2);
            setBalance((prevBalance)=>prevBalance+(betValue*2))
            setShowWinner(true)
          }
          else {
            console.log("you lost");
          }
          setBetValue(null)
          setSelectedBetColour(null)
        }

        // setWinColour(data.results[0].)
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
    if (timer <= 2 && !intervalRef.current) {
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
                  big
                </td>
                <td className="border border-gray-300 text-center py-2 text-gray-700">
                  4
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
              {winAmount}
            </p>
            <p className="text-center text-gray-700 font-medium">Well Done!</p>
          </div>
        </div>
      )}
    </div>
  );
}
