import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// WithdrawalCard component with enhanced mobile design
function WithdrawalCard({ id, status, amount, paymentMethod, createdAt }) {
  const getStatusStyle = () => {
    if (status === "completed" || status === "success") return {
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "✅",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    };
    if (status === "pending") return {
      color: "text-yellow-500", 
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "⏳",
      gradient: "bg-gradient-to-r from-yellow-500 to-amber-500"
    };
    if (status === "failed" || status === "rejected") return {
      color: "text-red-500",
      bg: "bg-red-50", 
      border: "border-red-200",
      icon: "❌",
      gradient: "bg-gradient-to-r from-red-500 to-rose-500"
    };
    return {
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "📄",
      gradient: "bg-gradient-to-r from-gray-500 to-slate-500"
    };
  };

  const getPaymentMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'upi': return '📱';
      case 'bank': case 'bank_transfer': return '🏦';
      default: return '💸';
    }
  };

  const statusStyle = getStatusStyle();
  const isCompleted = status === "completed" || status === "success";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with status indicator */}
      <div className={`px-6 py-4 ${statusStyle.gradient}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-x-2">
            <span className="text-white text-sm font-medium">Transaction ID</span>
            <span className="bg-white px-2 py-1 mt-1 rounded-lg text-black text-xs font-mono">
              {id || 'N/A'}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCompleted ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {statusStyle.icon} {status?.toUpperCase() || 'UNKNOWN'}
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 space-y-4">
        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">Withdrawal Amount</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className="text-gray-800 font-bold text-xl">{amount || 0}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">Payment Method</span>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-lg">{getPaymentMethodIcon(paymentMethod)}</span>
            <span className="text-blue-600 font-semibold text-sm uppercase">
              {paymentMethod || 'N/A'}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">Status</span>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${statusStyle.bg} ${statusStyle.border} border`}>
            <span className="text-lg">{statusStyle.icon}</span>
            <span className={`font-bold text-sm uppercase ${statusStyle.color}`}>
              {status || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Date if available */}
        {createdAt && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Date</span>
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800 font-medium text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={`h-1 ${
        isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 
        status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 
        'bg-gradient-to-r from-red-400 to-rose-400'
      }`}></div>
    </div>
  );
}

// WithdrawalHistory component with enhanced mobile design
const WithdrawalHistory = () => {
  const { BACKEND_URL, userData } = useContext(AppContext);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithrawHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BACKEND_URL}/api/transaction/withdrawhistory`, {
        userId: userData._id,
      });
      if (data.success) {
        console.log(data);
        setWithdrawHistory(data.history);
      }
    } catch (err) {
      toast.error("Unable to fetch withdraw history. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithrawHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="pt-8 pb-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading your withdrawal history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">💸</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Withdrawal History
          </h1>
          <p className="text-gray-600 text-sm">Track your withdrawal transactions</p>
        </div>
      </div>

      {/* Withdrawal Cards */}
      <div className="px-4 pb-8">
        {withdrawHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">💸</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">No Withdrawals Yet</h3>
            <p className="text-gray-500 text-sm">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawHistory.map((item) => (
              <WithdrawalCard
                key={item._id}
                id={item._id}
                status={item.status}
                amount={item.amount}
                paymentMethod={item.paymentMethod}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;