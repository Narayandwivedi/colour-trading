import React, { useContext } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { userData, setUserData, BACKEND_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const userId = "USER123456";
  // Replace with actual user ID from auth state

  const menuItems = [
    {
      label: "Bet History",
      icon: "fa-solid fa-clock-rotate-left",
      link: "/bethistory",
    },
    {
      label: "Withdraw History",
      icon: "fa-solid fa-arrow-up-right-dots",
      link: "/withdrawhistory",
    },
    {
      label: "Deposit History",
      icon: "fa-solid fa-arrow-down",
      link: "/deposithistory",
    },
    {
      label: "Customer Support",
      icon: "fa-solid fa-headset",
      link: "/support",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 max-w-[440px] mx-auto relative">
      {/* Header */}
      <div className="text-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold">{userData?.fullName}</span>
        </p>
      </div>

      {/* Withdraw and Deposit Buttons */}
      <div className="mt-6 px-4 flex justify-center gap-4">
        <Link
          to="/withdraw"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-md font-medium transition"
        >
          Withdraw
        </Link>
        <Link
          to="/deposit"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md font-medium transition"
        >
          Deposit
        </Link>
      </div>

      {/* Options Menu */}
      <div className="mt-8 mx-4 space-y-4">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <i className={`${item.icon} text-lg text-indigo-600`}></i>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
          </Link>
        ))}
      </div>
      <div className="mt-8 px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 text-white py-3 rounded-xl shadow-md hover:bg-gray-900 transition text-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Account;
