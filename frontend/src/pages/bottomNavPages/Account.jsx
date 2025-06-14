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
} from "lucide-react";

const Account = () => {
  const { userData, setUserData, BACKEND_URL } = useContext(AppContext);
  const navigate = useNavigate();

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
    if (!userData) return toast.error("Error during logout");
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
      toast.error("Logout error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 max-w-[440px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700/80 via-cyan-700/80 to-emerald-700/80 border-b border-cyan-600/30 px-4 py-6">
        <div className="text-center">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 rounded-full flex items-center justify-center border-4 border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-yellow-800" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-sm text-cyan-200 mt-1">
            Welcome back, <span className="text-white font-medium">{userData?.fullName || "User"}</span>
          </p>
          
          {/* Balance Card */}
          <div className="mt-3 bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wallet className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-300 text-xs">Current Balance</span>
            </div>
            <div className="text-xl font-bold text-white">
              ₹{userData?.balance || "0"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 mb-6 mt-4">
        <div className="flex gap-3">
          <Link
            to="/withdraw"
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-medium text-sm border border-red-400/30"
          >
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Withdraw
            </div>
          </Link>
          <Link
            to="/deposit"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-medium text-sm border border-emerald-400/30"
          >
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Deposit
            </div>
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 space-y-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              to={item.link}
              key={index}
              className="block bg-white/10 border border-white/20 rounded-xl p-3 hover:bg-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">{item.label}</span>
                    <p className="text-cyan-300 text-xs">View {item.label.toLowerCase()}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      {/* Logout Button - Blue Gradient */}
<div className="mt-4 px-3">
  <button
    onClick={handleLogout}
    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-sm border border-blue-500/30 shadow-md transition-colors"
  >
    <div className="flex items-center justify-center gap-2">
      <LogOut className="w-4 h-4" />
      Logout
    </div>
  </button>
</div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Account;