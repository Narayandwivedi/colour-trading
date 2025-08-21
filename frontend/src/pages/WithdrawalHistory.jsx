import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ArrowUpRight, Hash, Calendar, Smartphone, Building2, Banknote, Copy } from "lucide-react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

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
      case 'upi': return <Smartphone className="w-5 h-5" />;
      case 'bank': case 'bank_transfer': return <Building2 className="w-5 h-5" />;
      default: return <Banknote className="w-5 h-5" />;
    }
  };

  const statusStyle = getStatusStyle();
  const isCompleted = status === "completed" || status === "success";

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Header with status indicator */}
      <div className={statusStyle.gradient}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-white text-sm font-medium">Withdrawal Transaction</span>
            </div>
          </div>
          <div className="text-white">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Amount - Most important */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs font-medium">Amount</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className="text-gray-800 font-bold text-lg">{amount || 0}</span>
          </div>
        </div>

        {/* Method and Status in one row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-orange-50 text-orange-600">
            {getPaymentMethodIcon(paymentMethod)}
            <span className="font-medium">
              {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'bank' ? 'Bank' : paymentMethod || 'N/A'}
            </span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${statusStyle.bg} ${statusStyle.color}`}>
            <span>{statusStyle.icon}</span>
            <span className="font-medium uppercase">{status || 'Unknown'}</span>
          </div>
        </div>

        {/* Date */}
        {createdAt && (
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {new Date(createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short'
              })} • {new Date(createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}

        {/* Transaction ID */}
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 py-1 px-2 rounded font-mono">
          <span>#{id || 'N/A'}</span>
          <Copy 
            className="w-3 h-3 cursor-pointer hover:text-gray-700 transition-colors" 
            onClick={() => {
              navigator.clipboard.writeText(id || '');
              toast.success('Transaction ID copied!');
            }}
          />
        </div>
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 pb-20">
          <div className="pt-8 pb-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-600">Loading your withdrawal history...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20">
        {/* Enhanced Header */}
        <div className="px-4 pt-6 pb-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mb-4">
              <ArrowUpRight className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
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
              <ArrowUpRight className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-gray-600 font-medium mb-2">No Withdrawals Yet</h3>
            <p className="text-gray-500 text-sm">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
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
      <BottomNav />
    </>
  );
};

export default WithdrawalHistory;