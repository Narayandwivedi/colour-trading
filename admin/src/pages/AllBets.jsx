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
  const [dateFilter, setDateFilter] = useState('all');
  const [filters, setFilters] = useState({
    status: '',
    period: '',
    userId: '',
    startDate: '',
    endDate: ''
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
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

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

  const handleDateFilter = (e) => {
    const val = e.target.value;
    setDateFilter(val);
    if (val === 'all') {
      setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    } else if (val === 'custom') {
      setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    } else {
      const days = parseInt(val);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      const fmt = (d) => d.toISOString().split('T')[0];
      setFilters(prev => ({ ...prev, startDate: fmt(start), endDate: fmt(end) }));
    }
  };

  const clearFilters = () => {
    setDateFilter('all');
    setFilters({
      status: '',
      period: '',
      userId: '',
      startDate: '',
      endDate: ''
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
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">All Bets</h1>
            <p className="text-xs sm:text-sm text-gray-500">Total: {pagination.totalBets} bets</p>
          </div>
          <button
            onClick={() => fetchAllBets(pagination.currentPage)}
            className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <div className="flex flex-col gap-2 p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Period</label>
              <input
                type="number"
                name="period"
                value={filters.period}
                onChange={handleFilterChange}
                placeholder="Period"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">User ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="User ID"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Date</label>
              <select
                value={dateFilter}
                onChange={handleDateFilter}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="60">Last 60 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {dateFilter === 'custom' && (
              <>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">From Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">To Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
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
          <div className="text-center py-8">
            <p className="text-xs text-gray-500">No Bets Found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalBets} total)
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded bg-gray-100 text-gray-700">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AllBets;