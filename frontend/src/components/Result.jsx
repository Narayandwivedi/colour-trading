import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [latestPeriod, setLatestPeriod] = useState(null); // Local tracking
  const intervalRef = useRef(null);

  const { BACKEND_URL, gameType, timer } = useContext(AppContext);

  const fetch_30_results = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/result/${gameType}`);
      const latest = data.results[0];

      // Only update when new period is detected
      if (latest && latest.period !== latestPeriod) {
        setResults(data.results);
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
    </div>
  );
}
