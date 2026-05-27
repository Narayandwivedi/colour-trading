import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';

const ManageBets = () => {
  const { BACKEND_URL, onWSMessage } = useContext(AppContext);
  
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

  // WebSocket listener for live period updates
  useEffect(() => {
    const unsub = onWSMessage((msg) => {
      if (msg.type === 'game:open') {
        const gt = msg.gameType;
        if (gt && periods[gt] !== undefined) {
          setPeriods(prev => ({
            ...prev,
            [gt]: {
              period: msg.period,
              createdAt: msg.createdAt
            }
          }));
        }
      }
    });
    return unsub;
  }, [onWSMessage]);

  const BetCard = ({ timeframe, title }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-sm">{title}</h2>
          <div className="text-right">
            <p className="text-blue-100 text-[10px] uppercase">Period</p>
            <p className="text-white font-bold text-xs">{periods[timeframe].period || 'Loading...'}</p>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Number (0-9)</label>
          <input
            type="number"
            placeholder="Enter number"
            value={inputs[timeframe].number}
            onChange={(e) => handleInputChange(timeframe, 'number', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            min="0"
            max="9"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Colour</label>
          <select
            value={inputs[timeframe].colour}
            onChange={(e) => handleInputChange(timeframe, 'colour', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white"
          >
            <option value="">Select colour</option>
            <option value="red">🔴 Red</option>
            <option value="green">🟢 Green</option>
            <option value="violet">🟣 Violet</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Size</label>
          <select
            value={inputs[timeframe].size}
            onChange={(e) => handleInputChange(timeframe, 'size', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white"
          >
            <option value="">Select size</option>
            <option value="small">📏 Small</option>
            <option value="big">📐 Big</option>
          </select>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => createAdminResult(timeframe)}
            disabled={loading[timeframe]}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
              loading[timeframe]
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
            }`}
          >
            {loading[timeframe] ? (
              <div className="flex items-center justify-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                Creating...
              </div>
            ) : 'Set Result'}
          </button>
          <button
            onClick={() => fetchLatestPeriod(timeframe)}
            className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 border border-gray-300"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-base sm:text-lg font-bold text-gray-900">Manage Bets</h1>
          <p className="text-xs sm:text-sm text-gray-500">Control betting results for different time frames</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          <BetCard timeframe="30sec" title="30 Sec" />
          <BetCard timeframe="1min" title="1 Min" />
          <BetCard timeframe="3min" title="3 Min" />
        </div>
      </div>
    </div>
  );
};

export default ManageBets;