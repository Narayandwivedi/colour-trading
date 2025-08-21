import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { CreditCard, Gift, TrendingUp, Calendar, Hash, Smartphone, Building2, Copy } from "lucide-react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

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
      case 'upi': return <Smartphone className="w-5 h-5" />;
      case 'bank': case 'bank_transfer': return <Building2 className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const statusStyle = getStatusStyle();
  const referralStyle = getReferralStyle();
  const cardStyle = isReferral ? referralStyle : statusStyle;
  const isCompleted = status === "completed" || status === "success";

  return (
    <div className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-all duration-200 ${
      isReferral ? 'border-purple-200' : 'border-gray-200'
    }`}>
      {/* Header with status indicator */}
      <div className={cardStyle.gradient}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-white text-sm font-medium">
                {isReferral ? 'Referral Bonus' : 'Deposit Transaction'}
              </span>
            </div>
          </div>
          <div className="text-white">
            {isReferral ? <Gift className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Amount - Most important, show first */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs font-medium">
            {isReferral ? 'Bonus Amount' : 'Amount'}
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-gray-500 text-sm">₹</span>
            <span className={`font-bold text-lg ${
              isReferral ? 'text-purple-600' : 'text-gray-800'
            }`}>
              {amount || 0}
            </span>
          </div>
        </div>

        {/* Type and Status in one row */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
            isReferral ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600'
          }`}>
            {isReferral ? <Gift className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            <span className="font-medium">
              {isReferral ? 'Referral' : 'Deposit'}
            </span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${statusStyle.bg} ${statusStyle.color}`}>
            <span>{statusStyle.icon}</span>
            <span className="font-medium uppercase">{status || 'Unknown'}</span>
          </div>
        </div>

        {/* Payment Method and Date in one row for deposits */}
        {!isReferral && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Via:</span>
              <div className="flex items-center space-x-1 text-teal-600">
                {getPaymentMethodIcon(paymentMethod)}
                <span className="font-medium">
                  {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'bank' ? 'Bank' : paymentMethod || 'N/A'}
                </span>
              </div>
            </div>
            {createdAt && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Date for referrals */}
        {isReferral && createdAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Friend Referral Bonus</span>
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short'
                })}
              </span>
            </div>
          </div>
        )}

        {/* UTR if available */}
        {!isReferral && utr && (
          <div className="text-xs text-gray-500 text-center bg-gray-50 py-1 px-2 rounded font-mono">
            UTR: {utr}
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 px-4 pb-20">
          <div className="pt-8 pb-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <p className="mt-2 text-gray-600">Loading your transaction history...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 pb-20">
        {/* Enhanced Header */}
        <div className="px-4 pt-6 pb-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
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
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('deposits')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filter === 'deposits' 
                  ? 'bg-emerald-500 text-white shadow-sm' 
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
              <div className="text-gray-400">
                {filter === 'referrals' ? <Gift className="w-12 h-12" /> : 
                 filter === 'deposits' ? <CreditCard className="w-12 h-12" /> : 
                 <TrendingUp className="w-12 h-12" />}
              </div>
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
          <div className="space-y-3">
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
      <BottomNav />
    </>
  );
};

export default DepositHistory;