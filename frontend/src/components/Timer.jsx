import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Trophy } from "lucide-react";

function Watch({ selected }) {
  return (
    <div
      className={`relative h-[44px] w-[44px] rounded-full transition-all duration-300 
        ${selected
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/40 border"
          : "bg-gradient-to-b from-gray-200 to-gray-400 shadow-inner"
        }`}
    >
      <div className="absolute top-1/2 left-1/2 w-[6px] h-[6px] bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
      <div className="absolute top-[8px] left-1/2 w-[2px] h-[14px] bg-white transform -translate-x-1/2 origin-bottom rotate-45"></div>
    </div>
  );
}

const getDurationByGameType = (type) => {
  switch (type) {
    case "1min": return 60;
    case "3min": return 180;
    case "30sec":
    default: return 30;
  }
};

export default function Game() {
  const {
    timer,
    setTimer,
    period,
    setPeriod,
    periodCreatedAT,
    setPeriodCreatedAT,
    gameType,
    setGameType,
    BACKEND_URL,
    onWSMessage,
  } = useContext(AppContext);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    const unsub = onWSMessage((msg) => {
      if (msg.type === 'game:open' && msg.gameType === gameType) {
        setPeriod(msg.period);
        setPeriodCreatedAT(new Date(msg.createdAt));
      }
    });
    return unsub;
  }, [gameType, onWSMessage]);

  useEffect(() => {
    if (!periodCreatedAT) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - periodCreatedAT) / 1000);
      const duration = getDurationByGameType(gameType);
      const timeLeft = Math.max(duration - elapsedSeconds, 0);
      setTimer(timeLeft);
    }, 800);

    return () => clearInterval(interval);
  }, [periodCreatedAT, gameType]);

  useEffect(() => {
    async function fetchCurrentPeriod() {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/latest/period/${gameType}`,
          { withCredentials: true }
        );
        if (data.success && data.latestPeriod) {
          setPeriod(data.latestPeriod.period);
          setPeriodCreatedAT(new Date(data.latestPeriod.createdAt));
        }
      } catch (err) {
        console.error("Failed to fetch current period:", err.message);
      }
    }

    if (gameType) {
      fetchCurrentPeriod();
    }
  }, [gameType]);

  return (
    <div className="Game-container mt-8 p-4 text-gray-700 mb-8 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-md">
      <div className="game-options flex justify-between px-4 mb-6">
        {["30sec", "1min", "3min"].map((label) => (
          <div
            key={label}
            onClick={() => setGameType(label)}
            className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-300 
              ${gameType === label
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white scale-105 shadow-xl"
                : "bg-white hover:bg-indigo-100"
              }`}
          >
            <Watch selected={gameType === label} />
            <p className="text-sm mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="game-counter mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm flex justify-center items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Period
          </p>
          <p className="text-sm sm:text-xl font-semibold text-indigo-700 mt-1">
            {period || "---"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Count Down</p>
          <p className="text-sm sm:text-xl font-semibold text-indigo-700 mt-1">
            {periodCreatedAT ? `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` : "---"}
          </p>
        </div>
      </div>
    </div>
  );
}
