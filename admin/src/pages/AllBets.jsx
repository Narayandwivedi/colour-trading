import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AllBets = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBets: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });
  const [filters, setFilters] = useState({
    status: '',
    period: '',
    userId: ''
  });

  const fetchAllBets = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      // Add filters if they exist
      if (filters.status) params.append('status', filters.status);
      if (filters.period) params.append('period', filters.period);
      if (filters.userId) params.append('userId', filters.userId);

      const { data } = await axios.get(`${BACKEND_URL}/api/bet/all?${params}`);
      
      if (data.success) {
        setBets(data.data.bets);
        setPagination(data.data.pagination);
      } else {
        toast.error('Failed to fetch bets');
      }
    } catch (error) {
      console.error('Error fetching bets:', error);
      toast.error('Error fetching bets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBets(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
    fetchAllBets(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      period: '',
      userId: ''
    });
  };

  const getBetTypeDisplay = (bet) => {
    if (bet.betColour) return { type: bet.betColour, category: 'Color' };
    if (bet.betSize) return { type: bet.betSize, category: 'Size' };
    if (bet.betNumber !== null && bet.betNumber !== undefined) return { type: bet.betNumber, category: 'Number' };
    return { type: 'Unknown', category: 'Unknown' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'win': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultDisplay = (result) => {
    if (result === "violetRed" || result === "violetGreen") {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
          <div className={`w-4 h-4 rounded-full ${result === "violetRed" ? "bg-red-500" : "bg-green-500"}`}></div>
        </div>
      );
    }
    if (result === "big" || result === "small") {
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          result === "big" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
        }`}>
          {result.toUpperCase()}
        </span>
      );
    }
    if (result === "red" || result === "green") {
      return <div className={`w-4 h-4 rounded-full ${result === "red" ? "bg-red-500" : "bg-green-500"}`}></div>;
    }
    if (typeof result === 'number') {
      return <span className="font-bold text-lg">{result}</span>;
    }
    return <span className="text-gray-500">{result || 'N/A'}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && bets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading bets...</span>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-0 space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Bets</h1>
          <p className="text-sm sm:text-base text-gray-600">Total: {pagination.totalBets} bets</p>
        </div>
        <button
          onClick={() => fetchAllBets(pagination.currentPage)}
          className="self-start text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="win">Win</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Period</label>
            <input
              type="number"
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              placeholder="Period"
              className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="User ID"
              className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-3 py-1.5 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-xs sm:text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Bet Cards */}
      <div className="sm:hidden space-y-2">
        {bets.map((bet) => {
          const betDisplay = getBetTypeDisplay(bet);
          return (
            <div key={bet._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-600">{bet.period}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(bet.status)}`}>
                  {bet.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  {(bet.userId?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{bet.userId?.fullName || 'N/A'}</p>
                  <p className="text-xs text-gray-500 truncate">{bet.userId?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-500 text-xs">{betDisplay.category}: </span>
                  <span className="font-medium">{betDisplay.type}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{bet.betAmount}</div>
                  <div className="text-xs text-gray-500">{bet.payout ? `Payout: ₹${bet.payout}` : '-'}</div>
                </div>
              </div>
              {bet.betResult && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <span>Result:</span>
                  <div className="flex items-center">{getResultDisplay(bet.betResult)}</div>
                  <span className="ml-auto">{formatDate(bet.createdAt)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: Bets Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bet Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bets.map((bet) => {
                const betDisplay = getBetTypeDisplay(bet);
                return (
                  <tr key={bet._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{bet.period}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{bet.userId?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{bet.userId?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{betDisplay.type}</span>
                        <div className="text-gray-500 text-xs">{betDisplay.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{bet.betAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {getResultDisplay(bet.betResult)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(bet.status)}`}>
                        {bet.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {bet.payout ? `₹${bet.payout}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(bet.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {bets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-gray-500 text-lg font-medium mb-2">No Bets Found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:px-4 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Page {pagination.currentPage} of {pagination.totalPages}
              <span className="ml-2 text-gray-500">({pagination.totalBets} total)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium ${
                  pagination.hasPrevPage
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Prev
              </button>
              
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum <= pagination.totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded text-sm font-medium ${
                          pageNum === pagination.currentPage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium ${
                  pagination.hasNextPage
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBets;