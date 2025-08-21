import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Target, Trophy, Coins, Hash, Calendar, TrendingUp, TrendingDown, Copy } from "lucide-react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Header with status indicator */}
      <div
        className={`px-4 py-3 ${
          isWon
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-red-500 to-rose-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-white text-sm font-medium">Period: {Period}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-white">
              {isWon ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-semibold ${
                isWon ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isWon ? "WON" : "LOST"}
            </div>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Amount - Most important */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs font-medium">Bet Amount</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className="text-gray-800 font-bold text-lg">{Amount}</span>
          </div>
        </div>

        {/* Bet and Result in one row */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${betStyle.bg} ${betStyle.color}`}>
            <span className="font-medium uppercase">{Bet}</span>
          </div>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">
            <div className="flex justify-center items-center">
              {Result === "violetRed" || Result === "violetGreen" ? (
                <div className="flex items-center space-x-1">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600`}></div>
                  <div className={`w-4 h-4 rounded-full ${
                    Result === "violetRed" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}></div>
                </div>
              ) : Result === "big" || Result === "small" ? (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  Result === "big" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {Result}
                </span>
              ) : (
                <div className={`w-4 h-4 rounded-full ${
                  Result === "red" ? "bg-gradient-to-r from-red-500 to-red-600" : Result === 'green' ? "bg-gradient-to-r from-green-500 to-green-600" : ''
                }`}></div>
              )}
            </div>
          </div>
        </div>

        {/* Win Amount and Status in one row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-gray-500 text-xs">Win: ₹</span>
            <span className={`font-bold text-sm ${isWon ? 'text-green-600' : 'text-red-600'}`}>
              {payout || 0}
            </span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
            isWon ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {isWon ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="font-medium">{isWon ? "WON" : "LOST"}</span>
          </div>
        </div>

        {/* Order ID */}
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 py-1 px-2 rounded font-mono">
          <span>#{orderId || 'N/A'}</span>
          <Copy 
            className="w-3 h-3 cursor-pointer hover:text-gray-700 transition-colors" 
            onClick={() => {
              navigator.clipboard.writeText(orderId || '');
              toast.success('Transaction ID copied!');
            }}
          />
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 px-4 pb-20">
          <div className="pt-8 pb-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-gray-600">Loading your bet history...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pb-20">
        {/* Enhanced Header */}
        <div className="px-4 pt-4 pb-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-2">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Bet History
            </h1>
            <p className="text-gray-600 text-xs">Your complete betting journey</p>
          </div>
        </div>

      {/* Bet Cards */}
      <div className="px-4 pb-8">
        {allbets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-gray-600 font-medium mb-2">No Bets Yet</h3>
            <p className="text-gray-500 text-sm">
              Your betting history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
      <BottomNav />
    </>
  );
};

export default BetHistory;
