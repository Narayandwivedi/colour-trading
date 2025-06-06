import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Card component
function Cards({ Period, Bet, Amount, Result, status }) {
  const getBetColor = () => {
    if (Bet === "red") return "text-red-600 font-semibold";
    if (Bet === "green") return "text-green-600 font-semibold";
    if (Bet === "big") return "text-yellow-600 font-semibold";
    if (Bet === "small") return "text-blue-600 font-semibold";
    return "text-gray-600";
  };

  return (
    <div className="h-[220px] w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg p-5 space-y-4 transition-transform hover:scale-[1.02] duration-200">
      <div className="flex justify-between font-semibold text-gray-700">
        <span>Period:</span>
        <span>{Period}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Bet:</span>
        <span className={getBetColor()}>{Bet}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Amount:</span>
        <span>₹{Amount}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Result:</span>
        <span>{Result}</span>
      </div>

      <div className={`flex justify-between font-medium ${status === "won" ? "text-green-600" : "text-red-500"}`}>
        <span>Status:</span>
        <span >{status}</span>
      </div>
    </div>
  );
}

// BetHistory component
const BetHistory = () => {
  const { userData, BACKEND_URL } = useContext(AppContext);
  const [allbets, setAllBets] = useState([]);

  async function fetchBetHistory() {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/bet/history`, {
        userId: userData._id,
      });
      if (data.success) {
        setAllBets(data.allBets);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchBetHistory();
  }, []);

  return (
    <div className="px-4">
      <h1 className="text-center mt-6 font-semibold text-2xl text-gray-800">All Bets</h1>
      
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        {allbets.map((eachBet, index) => (
          <Cards
            key={index}
            Period={eachBet.period}
            Bet={eachBet.betColour || eachBet.betSize || ""}
            Amount={eachBet.betAmount}
            Result={eachBet.betResult}
            status={eachBet.status}
          />
        ))}
      </div>
    </div>
  );
};

export default BetHistory;
