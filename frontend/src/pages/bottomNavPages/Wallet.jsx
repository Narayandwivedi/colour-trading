import React from 'react';
import BottomNav from '../../components/BottomNav';

const Wallet = () => {
  // Dummy Data (replace with real data from backend later)
  const walletBalance = 1250;
  const addHistory = [
    { amount: 500, date: '2025-05-20', method: 'UPI' },
    { amount: 1000, date: '2025-05-15', method: 'Card' },
  ];
  const withdrawHistory = [
    { amount: 250, date: '2025-05-22', method: 'Bank Transfer' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 max-w-[440px] mx-auto relative">
      {/* Header */}
      <div className="text-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-indigo-700">My Wallet</h1>
        <p className="text-sm text-gray-600 mt-1">Track your balance and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl shadow-xl mx-4 mt-6 p-5 text-center">
        <p className="text-md font-medium">Available Balance</p>
        <h2 className="text-3xl font-bold mt-2">₹{walletBalance}</h2>
      </div>

          {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Wallet;
