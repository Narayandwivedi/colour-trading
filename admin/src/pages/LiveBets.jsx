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
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">Live Bets</h1>
            <p className="text-xs sm:text-sm text-gray-500">Real-time betting activity</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="hidden sm:inline text-[10px] text-gray-400">{lastUpdated}</span>
            )}
            <button
              onClick={fetchBets}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Total Bets</dt>
              <dd className="text-xs sm:text-sm font-bold text-gray-900">{totalBets}</dd>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
            <div className="min-w-0">
              <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Amount</dt>
              <dd className="text-xs sm:text-sm font-bold text-gray-900">₹{totalAmount}</dd>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 shrink-0" />
            <div className="min-w-0">
              <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Pending</dt>
              <dd className="text-xs sm:text-sm font-bold text-gray-900">{pendingBets}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Live Bets Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Bet Type</th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2 text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bets.map((bet) => (
                <tr key={bet._id} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2">
                    <span className="text-xs font-mono text-gray-600">{bet.userId}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs font-mono text-gray-600">{bet.period}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${getBetTypeColor(bet)}`}>
                      {getBetTypeIcon(bet)}
                      {getBetTypeText(bet)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className="text-xs font-semibold text-gray-900">₹{bet.betAmount}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-full border capitalize ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Bet Cards */}
      <div className="sm:hidden space-y-2">
        {loading && bets.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-xs text-gray-500">Loading bets...</p>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-1 text-xs text-gray-500">No bets found</p>
          </div>
        ) : (
          bets.map((bet) => (
            <div key={bet._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-xs text-gray-500 truncate max-w-[120px]">{bet.userId}</div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getStatusColor(bet.status)}`}>
                  {bet.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-gray-600 font-mono">{bet.period}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1 ${getBetTypeColor(bet)}`}>
                    {getBetTypeIcon(bet)}
                    {getBetTypeText(bet)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-gray-900">₹{bet.betAmount}</div>
                  <div className="text-[10px] text-gray-400">{new Date(bet.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
  );
};

export default LiveBets;