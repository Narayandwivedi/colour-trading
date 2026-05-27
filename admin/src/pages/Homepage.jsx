import React, { useContext } from "react";
import {
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {toast} from 'react-toastify'

// Enhanced Card Component
const Card = ({
  heading,
  data,
  icon: Icon,
  color = "blue",
}) => {

  const colorSchemes = {
    blue: { gradient: "from-blue-500 to-blue-600", text: "text-blue-900", subtext: "text-blue-500" },
    green: { gradient: "from-green-500 to-green-600", text: "text-green-900", subtext: "text-green-500" },
    purple: { gradient: "from-purple-500 to-purple-600", text: "text-purple-900", subtext: "text-purple-500" },
    orange: { gradient: "from-orange-500 to-orange-600", text: "text-orange-900", subtext: "text-orange-500" },
    yellow: { gradient: "from-yellow-500 to-yellow-600", text: "text-yellow-900", subtext: "text-yellow-500" },
  };

  const scheme = colorSchemes[color];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${scheme.gradient}`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <dt className={`text-[10px] sm:text-xs ${scheme.subtext} truncate`}>
            {heading}
          </dt>
          <dd className={`text-xs sm:text-sm font-bold ${scheme.text}`}>
            {data}
          </dd>
        </div>
      </div>
    </div>
  );
};

// Homepage Component using Context API
const Homepage = () => {
  const { stats , BACKEND_URL } = useContext(AppContext);


  // Loading state
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Card data configuration using actual context data
  const cardData = [
    {
      heading: "Total Users",
      data: stats.totalUsers,
      icon: Users,
      color: "blue",
    },
    {
      heading: "Total Bets Today",
      data: `₹${stats.betToday.totalAmount}`,
      icon: TrendingUp,
      color: "green",
    },
    {
      heading: "Total Deposits",
      data: stats.depositsToday,
      icon: Wallet,
      color: "purple",
    },
  ];

async function handleServerRestart() {
  try {
    // Use a more modern confirmation dialog
    const userConfirmed = window.confirm("Are you sure you want to restart the server? This will cause temporary downtime.");
    
    if (!userConfirmed) {
      console.log("Server restart cancelled by user");
      return;
    }

    // Show loading state (optional)
    await axios.post(`${BACKEND_URL}/restart-server`);
    toast.success("server started successfully")
    
  } catch(err) {
     toast.success("server started successfully")
    console.error("Restart failed:", err);
  }
}

  return (
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-xs sm:text-sm text-gray-500">Welcome back! Here's what's happening with your platform today.</p>
          </div>
          <button onClick={handleServerRestart} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">Restart VPS</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {cardData.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            data={card.data}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* Additional section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-xs text-gray-500">Your recent activity and analytics will appear here...</p>
      </div>
      </div>
    </div>
  );
};

export default Homepage;
