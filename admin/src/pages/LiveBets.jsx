import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Clock, TrendingUp, Circle, Square, Users, DollarSign, RefreshCw } from "lucide-react";

const LiveBets = () => {
  const { BACKEND_URL, onWSMessage } = useContext(AppContext);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchBets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/latestBets`);
      
      if (data.success) {
        setBets(data.allBets);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.log("Error fetching bets:", err);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchBets();
    // Auto-refresh every 15 seconds (fallback)
    const interval = setInterval(fetchBets, 15000);
    return () => clearInterval(interval);
  }, [fetchBets]);

  // WebSocket: refresh bets when a game result is announced
  useEffect(() => {
    const unsub = onWSMessage((msg) => {
      if (msg.type === 'game:result') {
        fetchBets();
      }
    });
    return unsub;
  }, [onWSMessage, fetchBets]);

  const getBetTypeIcon = (bet) => {
    if (bet.betColour) return <Circle className="w-4 h-4" />;
    if (bet.betSize) return <Square className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  const getBetTypeText = (bet) => {
    if (bet.betColour) return `Color: ${bet.betColour}`;
    if (bet.betSize) return `Size: ${bet.betSize}`;
    return "Number";
  };

  const getBetTypeColor = (bet) => {
    if (bet.betColour === 'red') return 'text-red-500 bg-red-50 border-red-200';
    if (bet.betColour === 'green') return 'text-green-500 bg-green-50 border-green-200';
    if (bet.betSize === 'big') return 'text-blue-500 bg-blue-50 border-blue-200';
    if (bet.betSize === 'small') return 'text-purple-500 bg-purple-50 border-purple-200';
    return 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'won': return 'text-green-600 bg-green-100 border-green-300';
      case 'lost': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const totalBets = bets.length;
  const totalAmount = bets.reduce((sum, bet) => sum + bet.betAmount, 0);
  const pendingBets = bets.filter(bet => bet.status === 'pending').length;

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-200">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-3xl font-bold text-slate-800 flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
              <span className="truncate">Live Bets</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-600 mt-0.5 sm:mt-1">Real-time betting activity</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {lastUpdated && (
              <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                Updated: {lastUpdated}
              </div>
            )}
            <button
              onClick={fetchBets}
              disabled={loading}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium">Total Bets</p>
              <p className="text-sm sm:text-2xl font-bold text-slate-800">{totalBets}</p>
            </div>
            <div className="bg-blue-100 p-1.5 sm:p-3 rounded-lg">
              <Users className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium">Amount</p>
              <p className="text-sm sm:text-2xl font-bold text-slate-800">₹{totalAmount}</p>
            </div>
            <div className="bg-green-100 p-1.5 sm:p-3 rounded-lg">
              <DollarSign className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium">Pending</p>
              <p className="text-sm sm:text-2xl font-bold text-slate-800">{pendingBets}</p>
            </div>
            <div className="bg-yellow-100 p-1.5 sm:p-3 rounded-lg">
              <Clock className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-xl font-semibold text-slate-800">Recent Bets</h2>
            {lastUpdated && (
              <div className="flex sm:hidden items-center gap-1 text-slate-400 text-[10px]">
                <Clock className="w-3 h-3" />
                {lastUpdated}
              </div>
            )}
          </div>
        </div>
        
        {loading && bets.length === 0 ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 sm:ml-3 text-xs sm:text-base text-slate-600">Loading bets...</span>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-slate-500">
            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-xs sm:text-base">No bets found</p>
          </div>
        ) : (
          <>
            {/* Mobile: Bet Cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {bets.map((bet) => (
                <div key={bet._id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-xs text-slate-500 truncate max-w-[120px]">{bet.userId}</div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <div className="text-slate-600 font-mono">{bet.period}</div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1 ${getBetTypeColor(bet)}`}>
                        {getBetTypeIcon(bet)}
                        {getBetTypeText(bet)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-slate-800">₹{bet.betAmount}</div>
                      <div className="text-[10px] text-slate-400">{new Date(bet.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Bet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">userId</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Period</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Bet Type</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Amount</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Status</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet, index) => (
                    <tr 
                      key={bet._id} 
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm text-slate-600">{bet.userId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm text-slate-600">{bet.period}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getBetTypeColor(bet)}`}>
                          {getBetTypeIcon(bet)}
                          {getBetTypeText(bet)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800">₹{bet.betAmount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(bet.status)}`}>
                          {bet.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {new Date(bet.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveBets;