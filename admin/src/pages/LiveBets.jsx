import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Clock, TrendingUp, Circle, Square, Users, DollarSign, RefreshCw } from "lucide-react";

const LiveBets = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function fetchBets() {
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
  }

  useEffect(() => {
    fetchBets();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchBets, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                Live Bets Tracker
              </h1>
              <p className="text-slate-600 mt-1">Real-time betting activity monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchBets}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  Last updated: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Bets</p>
                <p className="text-2xl font-bold text-slate-800">{totalBets}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-slate-800">₹{totalAmount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Bets</p>
                <p className="text-2xl font-bold text-slate-800">{pendingBets}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bets Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800">Recent Bets</h2>
          </div>
          
          {loading && bets.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Loading bets...</span>
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">userId</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">Period</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">Bet Type</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-6 font-semibold text-slate-700">Time</th>
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
                        <div className="font-mono text-sm text-slate-600">
                          {(bet.userId)}
                        </div>
                      </td>
                      

                      <td className="py-4 px-6">
                        <div className="font-mono text-sm text-slate-600">
                          {(bet.period)}
                        </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBets;