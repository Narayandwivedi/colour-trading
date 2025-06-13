import React, { useContext } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Headphones, 
  ChevronRight, 
  LogOut,
  User,
  Wallet,
  Crown,
  Waves
} from "lucide-react";

const Account = () => {
  const { userData, setUserData, BACKEND_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const userId = "USER123456"; // Replace with actual user ID from auth state

  const menuItems = [
    {
      label: "Bet History",
      icon: History,
      link: "/bethistory",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "Withdraw History",
      icon: TrendingUp,
      link: "/withdrawhistory",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Deposit History",
      icon: TrendingDown,
      link: "/deposithistory",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      label: "Customer Support",
      icon: Headphones,
      link: "/support",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  async function handleLogout() {
    if (!userData) {
      return toast.error("some error while logout");
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        setUserData(null);
        navigate("/login");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("some error while login");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-24 max-w-[440px] mx-auto relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />
      
      {/* Ocean-themed header with floating elements */}
      <div className="relative">
        {/* Floating bubbles */}
        <div className="absolute top-4 left-8 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-12 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce"></div>
        <div className="absolute top-8 right-20 w-4 h-4 bg-teal-400/20 rounded-full animate-pulse"></div>
        
        <div className="bg-gradient-to-r from-teal-700/80 via-cyan-700/80 to-emerald-700/80 backdrop-blur-lg border-b border-cyan-600/30 px-4 py-8">
          <div className="text-center">
            {/* Profile Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              My Account
            </h1>
            <p className="text-lg text-cyan-200 mt-2 font-medium">
              Welcome back, <span className="text-white font-bold">{userData?.fullName || "User"}</span>
            </p>
            
            {/* Balance Card */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-cyan-300" />
                <span className="text-cyan-300 text-sm font-medium">Current Balance</span>
              </div>
              <div className="text-3xl font-bold text-white">
                ₹{userData?.balance || "0"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ocean wave decoration */}
      <div className="relative -mt-6 mb-6">
        <svg viewBox="0 0 400 40" className="w-full h-6 text-cyan-600/30">
          <path d="M0,20 Q100,0 200,20 T400,20 V40 H0 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-8">
        <div className="flex gap-4">
          <Link
            to="/withdraw"
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-4 rounded-2xl shadow-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-red-400/30 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Withdraw
            </div>
          </Link>
          <Link
            to="/deposit"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 rounded-2xl shadow-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-emerald-400/30 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Deposit
            </div>
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-4">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              to={item.link}
              key={index}
              className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-white font-semibold text-lg">{item.label}</span>
                    <p className="text-cyan-300 text-sm">View your {item.label.toLowerCase()}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-8 px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-4 rounded-2xl shadow-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-gray-600/30 backdrop-blur-sm group"
        >
          <div className="flex items-center justify-center gap-3">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Logout
          </div>
        </button>
      </div>

      {/* Decorative waves at bottom */}
      <div className="absolute bottom-20 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 400 60" className="w-full h-8 text-teal-600/20">
          <path d="M0,30 Q100,10 200,30 T400,30 V60 H0 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Account;