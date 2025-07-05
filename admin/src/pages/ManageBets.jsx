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
    <div className="h-[450px] w-[320px] bg-gray-200 rounded-lg shadow-md p-4 m-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-gray-300 mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Period</p>
          <p className="text-lg font-bold text-blue-600">
            {periods[timeframe].period || 'Loading...'}
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-3">
        <input
          type="number"
          placeholder="Enter number (0-9)"
          value={inputs[timeframe].number}
          onChange={(e) => handleInputChange(timeframe, 'number', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          max="9"
        />
        
        <select
          value={inputs[timeframe].colour}
          onChange={(e) => handleInputChange(timeframe, 'colour', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select colour</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="violet">Violet</option>
        </select>
        
        <select
          value={inputs[timeframe].size}
          onChange={(e) => handleInputChange(timeframe, 'size', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select size</option>
          <option value="small">Small</option>
          <option value="big">Big</option>
        </select>
        
        {/* Two buttons: Set Result and Create Admin Result */}

        <button
          onClick={() => createAdminResult(timeframe)}
          disabled={loading[timeframe]}
          className={`py-2 px-4 rounded font-semibold transition-colors ${
            loading[timeframe]
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {loading[timeframe] ? 'Creating...' : 'Set Result'}
        </button>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => fetchLatestPeriod(timeframe)}
        className="mt-3 w-full py-1 px-3 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Refresh Period
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Bets</h1>
        <p className="text-gray-600">Control betting results for different time frames</p>
      </div>
      
      <div className="flex flex-wrap justify-center lg:justify-start">
        <BetCard timeframe="30sec" title="30 Second" />
        <BetCard timeframe="1min" title="1 Minute" />
        <BetCard timeframe="3min" title="3 Minutes" />
      </div>
    </div>
  );
};

export default ManageBets;