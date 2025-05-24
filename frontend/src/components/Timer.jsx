import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

// ✅ Watch component with glowing effect and updated colors
function Watch({ selected }) {
  return (
    <div
      className={`relative h-[44px] w-[44px] rounded-full transition-all duration-300 
        ${
          selected
            ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/40"
            : "bg-gradient-to-b from-gray-200 to-gray-400 shadow-inner"
        }`}
    >
      <div className="absolute top-1/2 left-1/2 w-[6px] h-[6px] bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
      <div className="absolute top-[8px] left-1/2 w-[2px] h-[14px] bg-white transform -translate-x-1/2 origin-bottom rotate-45"></div>
    </div>
  );
}

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);
  const [betInp, setBetInp] = useState(100);
  const [selectedTime, setSelectedTime] = useState("30sec");

  const {
    timer,
    setTimer,
    BACKEND_URL,
    period,
    setPeriod,
    periodCreatedAT,
    setPeriodCreatedAT,
  } = useContext(AppContext);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - periodCreatedAT) / 1000);
      const timeLeft = Math.max(30 - elapsedSeconds, 0);
      setTimer(timeLeft);
    }, 300);
    return () => clearInterval(interval);
  }, [periodCreatedAT]);

  async function fetchLatestPeriod() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/period`, {
        withCredentials: true,
      });
      if (data.success) {
        setPeriod(data.latestPeriod[0].period);
        const updatedAt = new Date(data.latestPeriod[0].createdAt);
        setPeriodCreatedAT(updatedAt);
      }
    } catch (err) {
      console.log("error", err);
      setPeriod(null);
    }
  }

  useEffect(() => {
    fetchLatestPeriod();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestPeriod();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Game-container mt-8 p-4 text-gray-700 mb-8 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-md">
      {/* Game time options */}
      <div className="game-options flex justify-center gap-7 px-4 mb-6">
        {["30sec", "1min", "3min", "5min"].map((label) => (
          <div
            key={label}
            onClick={() => setSelectedTime(label)}
            className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-300 
              ${
                selectedTime === label
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white scale-105 shadow-xl"
                  : "bg-white hover:bg-indigo-100"
              }`}
          >
            <Watch selected={selectedTime === label} />
            <p className="text-sm mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Period and timer */}
      <div className="game-counter mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm flex justify-center items-center gap-2">
            <i className="fa-solid fa-trophy text-lg text-yellow-500"></i> Period
          </p>
          <p className="text-2xl font-semibold text-indigo-700 mt-1">{period}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Count Down</p>
          <p className="text-2xl font-semibold text-indigo-700 mt-1">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
      </div>
    </div>
  );
}
