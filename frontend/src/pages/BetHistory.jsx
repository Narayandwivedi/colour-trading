import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Card component with enhanced mobile design
function BetCard({ Period, Bet, Amount, Result, status, payout, orderId }) {
  const getBetStyle = () => {
    if (Bet === "red")
      return {
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    if (Bet === "green")
      return {
        color: "text-green-500",
        bg: "bg-green-50",
        border: "border-green-200",
      };

    if (Bet === "violet")
      return {
        color: "text-violet-500",
        bg: "bg-violet-50",
        border: "border:violet-200",
      };

    if (Bet === "big")
      return {
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    if (Bet === "small")
      return {
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    return {
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    };
  };

  const betStyle = getBetStyle();
  const isWon = status === "won";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with status indicator */}
      <div
        className={`px-6 py-4 ${
          isWon
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-red-500 to-rose-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Period</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-white text-xs font-mono">
              {Period}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isWon ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isWon ? "✅ WON" : "❌ LOST"}
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 space-y-4">
        {/* Bet selection with icon */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">
            Bet Selection
          </span>
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${betStyle.bg} ${betStyle.border} border`}
          >
            <span className="text-lg">{betStyle.icon}</span>
            <span className={`font-bold text-sm uppercase ${betStyle.color}`}>
              {Bet}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">Bet Amount</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className="text-gray-800 font-bold text-lg">{Amount}</span>
          </div>
        </div>

        {/* payout */}

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">win amount</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className="text-gray-800 font-bold text-lg">{payout}</span>
          </div>
        </div>

        {/* Result */}
      <div className="flex items-center justify-between">
  <span className="text-gray-600 text-sm font-medium">Game Result</span>
  <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800 font-semibold text-sm">
    <div className="flex justify-center items-center">
      {Result === "violetRed" || Result === "violetGreen" ? (
        <div className="flex items-center space-x-1">
          {/* Violet circle */}
          <div
            className={`w-6 h-6 rounded-full shadow-lg border-2 border-white bg-gradient-to-r from-purple-500 to-purple-600`}
          ></div>
          {/* Red/Green circle */}
          <div
            className={`w-6 h-6 rounded-full shadow-lg border-2 border-white ${
              Result === "violetRed"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
          ></div>
        </div>
      ) : Result === "big" || Result === "small" ? (
        <span className={`px-5 py-1 rounded-md font-bold ${
          Result === "big" 
            ? "bg-yellow-100 text-yellow-700" 
            : "bg-blue-100 text-blue-700"
        }`}>
          {Result}
        </span>
      ) : (
        <div
          className={`w-6 h-6 rounded-full shadow-lg border-2 border-white ${
            Result === "red"
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : Result === 'green'?"bg-gradient-to-r from-green-500 to-green-600":''
          }`}
        ></div>
      )}
    </div>
  </span>
</div>
        {/* order id */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">order id</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 font-medium text-sm">{orderId}</span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`h-1 ${
          isWon
            ? "bg-gradient-to-r from-green-400 to-emerald-400"
            : "bg-gradient-to-r from-red-400 to-rose-400"
        }`}
      ></div>
    </div>
  );
}

// BetHistory component with enhanced mobile design
const BetHistory = () => {
  const { userData, BACKEND_URL } = useContext(AppContext);
  const [allbets, setAllBets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBetHistory() {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BACKEND_URL}/api/bet/history`, {
        userId: userData._id,
      });
      if (data.success) {
        setAllBets(data.allBets);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBetHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="pt-8 pb-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading your bet history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bet History
          </h1>
          <p className="text-gray-600 text-sm">Your complete betting journey</p>
        </div>
      </div>

      {/* Bet Cards */}
      <div className="px-4 pb-8">
        {allbets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">📊</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">No Bets Yet</h3>
            <p className="text-gray-500 text-sm">
              Your betting history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allbets.map((eachBet, index) => (
              <BetCard
                key={index}
                Period={eachBet.period}
                Bet={eachBet.betColour || eachBet.betSize || ""}
                Amount={eachBet.betAmount}
                Result={eachBet.betResult}
                status={eachBet.status}
                payout={eachBet.payout}
                orderId={eachBet._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetHistory;
