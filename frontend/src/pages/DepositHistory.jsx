import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// TransactionCard component that handles both deposits and referrals
function TransactionCard({ id, status, amount, paymentMethod, createdAt, type, utr }) {
  const isReferral = type === "referral-bonus";
  
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

  const getReferralStyle = () => {
    return {
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "🎁",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500"
    };
  };

  const getPaymentMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'upi': return '📱';
      case 'bank': case 'bank_transfer': return '🏦';
      default: return '💰';
    }
  };

  const statusStyle = getStatusStyle();
  const referralStyle = getReferralStyle();
  const cardStyle = isReferral ? referralStyle : statusStyle;
  const isCompleted = status === "completed" || status === "success";

  return (
    <div className={`bg-white rounded-3xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isReferral ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-100'
    }`}>
      {/* Header with status indicator */}
      <div className={cardStyle.gradient}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col items-center space-x-2">
            <span className="text-white text-sm font-medium">
              {isReferral ? 'Referral ID' : 'Order ID'}
            </span>
            <span className="bg-white px-2 py-1 mt-1 rounded-lg text-black text-xs font-mono">
              {id || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 space-y-4">
        {/* Transaction Type Badge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">Transaction Type</span>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${
            isReferral ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <span className="text-lg">
              {isReferral ? '🎁' : '💰'}
            </span>
            <span className={`font-semibold text-sm uppercase ${
              isReferral ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {isReferral ? 'Referral' : 'Deposit'}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm font-medium">
            {isReferral ? 'Bonus Amount' : 'Deposit Amount'}
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-gray-500 text-lg font-medium">₹</span>
            <span className={`font-bold text-2xl ${
              isReferral ? 'text-purple-600' : 'text-gray-800'
            } `}>
              {amount || 0}
            </span>
          </div>
        </div>

        {/* UTR for deposits */}
        {!isReferral && utr && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">UTR Number</span>
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800 font-mono text-sm">
              {utr}
            </span>
          </div>
        )}

        {/* Payment Method for deposits */}
        {!isReferral && paymentMethod && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Payment Method</span>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-lg">{getPaymentMethodIcon(paymentMethod)}</span>
              <span className="text-blue-600 font-semibold text-sm uppercase">
                {paymentMethod || 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* Referral message for referral bonuses */}
        {isReferral && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Earned From</span>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-lg">👥</span>
              <span className="text-purple-600 font-semibold text-sm">
                Friend Referral
              </span>
            </div>
          </div>
        )}

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
              {new Date(createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={`h-1 ${
        isReferral ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
        isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 
        status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 
        'bg-gradient-to-r from-red-400 to-rose-400'
      }`}></div>
    </div>
  );
}

// Enhanced DepositHistory component
const DepositHistory = () => {
  const { userData, BACKEND_URL } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'deposits', 'referrals'

  const fetchDepositHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/transaction/deposithistory`,
        {
          userId: userData._id,
        }
      );
      if (data.success) {
        console.log(data);
        setTransactions(data.depositHistory);
      }
    } catch (err) {
      toast.error("Unable to fetch deposit history. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'deposits') return transaction.type === 'deposit';
    if (filter === 'referrals') return transaction.type === 'referral-bonus';
    return true; // 'all'
  });

  const getFilterStats = () => {
    const deposits = transactions.filter(t => t.type === 'deposit');
    const referrals = transactions.filter(t => t.type === 'referral-bonus');
    return {
      total: transactions.length,
      deposits: deposits.length,
      referrals: referrals.length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      depositAmount: deposits.reduce((sum, t) => sum + (t.amount || 0), 0),
      referralAmount: referrals.reduce((sum, t) => sum + (t.amount || 0), 0)
    };
  };

  const stats = getFilterStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="pt-8 pb-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading your transaction history...</p>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transaction History
          </h1>
          <p className="text-gray-600 text-sm">Track your deposits and referral bonuses</p>
        </div>
      </div>

     
      {/* Filter Buttons */}
      {transactions.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('deposits')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filter === 'deposits' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Deposits ({stats.deposits})
            </button>
            <button
              onClick={() => setFilter('referrals')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filter === 'referrals' 
                  ? 'bg-purple-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Referrals ({stats.referrals})
            </button>
          </div>
        </div>
      )}

      {/* Transaction Cards */}
      <div className="px-4 pb-8">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">
                {filter === 'referrals' ? '🎁' : filter === 'deposits' ? '💰' : '📊'}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">
              {filter === 'referrals' ? 'No Referral Bonuses Yet' : 
               filter === 'deposits' ? 'No Deposits Yet' : 
               'No Transactions Yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {filter === 'referrals' ? 'Your referral bonuses will appear here' : 
               filter === 'deposits' ? 'Your deposits will appear here' : 
               'Your transaction history will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  id={transaction._id}
                  status={transaction.status}
                  amount={transaction.amount}
                  paymentMethod={transaction.paymentMethod}
                  createdAt={transaction.createdAt}
                  type={transaction.type}
                  utr={transaction.UTR}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;