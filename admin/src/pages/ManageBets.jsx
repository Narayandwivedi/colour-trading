import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';

const ManageBets = () => {
  const { BACKEND_URL } = useContext(AppContext);
  
  const [periods, setPeriods] = useState({
    '30sec': { period: null, createdAt: null },
    '1min': { period: null, createdAt: null },
    '3min': { period: null, createdAt: null }
  });
  
  const [inputs, setInputs] = useState({
    '30sec': { number: '', colour: '', size: '' },
    '1min': { number: '', colour: '', size: '' },
    '3min': { number: '', colour: '', size: '' }
  });

  const [loading, setLoading] = useState({
    '30sec': false,
    '1min': false,
    '3min': false
  });

  // Create admin result function
  const createAdminResult = async (timeframe) => {
    const { number, colour, size } = inputs[timeframe];
    const currentPeriod = periods[timeframe].period;
    

    if (!currentPeriod) {
      alert('No period available for this timeframe');
      return;
    }

    setLoading(prev => ({ ...prev, [timeframe]: true }));

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/set-result`, {
        period: currentPeriod,
        adminNumber: parseInt(number),
        adminColour: colour,
        adminSize: size,
        timeframe: timeframe
      });

      if (response.data.success) {
        alert(`Admin result created successfully for ${timeframe}`);
        // Clear inputs after successful submission
        setInputs(prev => ({
          ...prev,
          [timeframe]: { number: '', colour: '', size: '' }
        }));
        // Refresh the period data
        fetchLatestPeriod(timeframe);
      } else {
        alert(`Failed to create admin result: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error creating admin result for ${timeframe}:`, error);
      alert(`Error creating admin result for ${timeframe}: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [timeframe]: false }));
    }
  };

  // Fetch latest period for specific timeframe
  async function fetchLatestPeriod(timeframe) {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/period/${timeframe}`);
      console.log(`${timeframe} data:`, data);
      
      if (data.success && data.latestPeriod) {
        setPeriods(prev => ({
          ...prev,
          [timeframe]: {
            period: data.latestPeriod.period,
            createdAt: data.latestPeriod.createdAt
          }
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${timeframe} period:`, error);
    }
  }

  // Handle input changes
  const handleInputChange = (timeframe, field, value) => {
    setInputs(prev => ({
      ...prev,
      [timeframe]: {
        ...prev[timeframe],
        [field]: value
      }
    }));
  };

  // Handle result submission (existing function)
  const handleSetResult = async (timeframe) => {
    const { number, colour, size } = inputs[timeframe];
    
    if (!number || !colour || !size) {
      alert('Please fill all fields');
      return;
    }

    setLoading(prev => ({ ...prev, [timeframe]: true }));
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/set/result/${timeframe}`, {
        period: periods[timeframe].period,
        number: parseInt(number),
        colour,
        size
      });
      
      if (response.data.success) {
        alert(`Result set successfully for ${timeframe}`);
        // Clear inputs after successful submission
        setInputs(prev => ({
          ...prev,
          [timeframe]: { number: '', colour: '', size: '' }
        }));
        // Refresh the period data
        fetchLatestPeriod(timeframe);
      }
    } catch (error) {
      console.error(`Error setting result for ${timeframe}:`, error);
      alert(`Error setting result for ${timeframe}`);
    } finally {
      setLoading(prev => ({ ...prev, [timeframe]: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Initial fetch
  useEffect(() => {
    fetchLatestPeriod('30sec');
    fetchLatestPeriod('1min');
    fetchLatestPeriod('3min');
  }, []);

  // Auto-refresh periods every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestPeriod('30sec');
      fetchLatestPeriod('1min');
      fetchLatestPeriod('3min');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const BetCard = ({ timeframe, title }) => (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <div className="text-right">
            <p className="text-blue-100 text-xs uppercase tracking-wide">Period</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 mt-1">
              <p className="text-white font-bold text-sm break-all">
                {periods[timeframe].period || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number (0-9)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={inputs[timeframe].number}
              onChange={(e) => handleInputChange(timeframe, 'number', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              min="0"
              max="9"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colour
            </label>
            <select
              value={inputs[timeframe].colour}
              onChange={(e) => handleInputChange(timeframe, 'colour', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">Select colour</option>
              <option value="red">🔴 Red</option>
              <option value="green">🟢 Green</option>
              <option value="violet">🟣 Violet</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={inputs[timeframe].size}
              onChange={(e) => handleInputChange(timeframe, 'size', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">Select size</option>
              <option value="small">📏 Small</option>
              <option value="big">📐 Big</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => createAdminResult(timeframe)}
            disabled={loading[timeframe]}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              loading[timeframe]
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {loading[timeframe] ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creating...
              </div>
            ) : (
              'Set Result'
            )}
          </button>
          
          <button
            onClick={() => fetchLatestPeriod(timeframe)}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors border border-gray-300"
          >
            🔄 Refresh Period
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Manage Bets
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Control betting results for different time frames
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BetCard timeframe="30sec" title="30 Second" />
          <BetCard timeframe="1min" title="1 Minute" />
          <BetCard timeframe="3min" title="3 Minutes" />
        </div>
      </div>
    </div>
  );
};

export default ManageBets;