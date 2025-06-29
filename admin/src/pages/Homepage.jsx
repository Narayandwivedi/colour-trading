import React, { useState, useContext } from "react";
import {
  TrendingUp,
  Users,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {toast} from 'react-toastify'

// Enhanced Card Component
const Card = ({
  heading,
  data,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-900",
      subtext: "text-blue-700",
      accent: "text-blue-500",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      text: "text-green-900",
      subtext: "text-green-700",
      accent: "text-green-500",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      text: "text-purple-900",
      subtext: "text-purple-700",
      accent: "text-purple-500",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      text: "text-orange-900",
      subtext: "text-orange-700",
      accent: "text-orange-500",
    },
    yellow: {
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      text: "text-yellow-900",
      subtext: "text-yellow-700",
      accent: "text-yellow-500",
    },
  };

  const scheme = colorSchemes[color];

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${
        scheme.bg
      } border border-white/20 backdrop-blur-sm
                  transform transition-all duration-300 ease-out cursor-pointer
                  ${
                    isHovered
                      ? "scale-105 shadow-2xl"
                      : "shadow-lg hover:shadow-xl"
                  }
                  min-w-[280px] h-[160px] p-6`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorative elements */}
      <div
        className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${
          scheme.gradient
        } 
                      rounded-full opacity-10 transform transition-transform duration-300
                      ${isHovered ? "scale-110" : ""}`}
      />

      {/* Header with icon */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-2 rounded-lg bg-gradient-to-br ${scheme.gradient} shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm font-medium
                          ${
                            trend === "up" ? "text-green-600" : "text-red-500"
                          }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className={`text-sm font-medium ${scheme.subtext} leading-tight`}>
          {heading}
        </h3>
        <p className={`text-2xl font-bold ${scheme.text} leading-none`}>
          {data}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          scheme.gradient
        } opacity-0 
                      transition-opacity duration-300 ${
                        isHovered ? "opacity-5" : ""
                      }`}
      />
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
      trend: "up",
    },
    {
      heading: "Total Bets Today",
      data: `₹${stats.betToday.totalAmount}`,
      icon: TrendingUp,
      color: "green",
      trend: "up",
    },
    {
      heading: "Total Deposits",
      data: stats.depositsToday,
      icon: Wallet,
      color: "purple",
      trend: "up",
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
    
    // Handle success
    alert("Server restart initiated successfully!");
    console.log("Restart response:", response.data);
    
  } catch(err) {
    // Handle errors
    console.error("Restart failed:", err);
    alert("Failed to restart server. Please check console for details.");
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        {/* heading */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
        </div>

        {/* restart button */}

        <button onClick={handleServerRestart} className="bg-red-500 text-white px-3 py-2 rounded-md mt-10">Restart vps</button>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cardData.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            data={card.data}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            // trendValue={card.trendValue}
          />
        ))}
      </div>

      {/* Additional section for more content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-600">
          Your recent activity and analytics will appear here...
        </p>
      </div>
    </div>
  );
};

export default Homepage;
