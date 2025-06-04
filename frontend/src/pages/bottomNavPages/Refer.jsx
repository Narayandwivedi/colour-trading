import React, { useState, useContext } from 'react';
import BottomNav from '../../components/BottomNav';
import { AppContext } from '../../context/AppContext';

const Refer = () => {
  const [copied, setCopied] = useState(false);
  const { userData } = useContext(AppContext);

  const handleCopy = () => {
    navigator.clipboard.writeText(userData?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 max-w-[440px] mx-auto relative">
      {/* Header */}
      <div className="text-center pt-8 px-6 pb-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Refer & Earn
        </h1>
        <p className="text-gray-600 mt-2 text-sm max-w-md mx-auto">
          Invite friends and earn ₹50 for each successful referral
        </p>
      </div>

      {/* Bonus Card */}
      <div className="mx-6 mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg p-5 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-sm font-medium opacity-90">GET ₹50</p>
            <p className="text-2xl font-bold mt-1">On ₹500 Deposit</p>
            <p className="text-xs mt-2 opacity-90">By your friend</p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Referral Code</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
            <span className="text-sm font-mono text-gray-800 tracking-wide">
              {userData ? userData.referralCode : ''}
            </span>
            <button
              onClick={handleCopy}
              className={`ml-2 text-sm px-4 py-2 rounded-md font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Tiers Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bonus Tiers</h2>
        <ul className="space-y-3">
          {[
            { deposit: 500, bonus: 50 },
            { deposit: 1000, bonus: 120 },
            { deposit: 2000, bonus: 250 },
            { deposit: 4000, bonus: 520 },
            { deposit: 8000, bonus: 1100 },
          ].map((tier, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
            >
              <span className="text-sm text-gray-700">Deposit ₹{tier.deposit}</span>
              <span className="text-sm font-semibold text-purple-700">Get ₹{tier.bonus}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How It Works Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="space-y-3">
          <div className="flex items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Share your referral link</h3>
              <p className="text-sm text-gray-600 mt-1">Send your unique code to friends</p>
            </div>
          </div>

          <div className="flex items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Friend signs up & deposits</h3>
              <p className="text-sm text-gray-600 mt-1">They need to deposit ₹500 to qualify</p>
            </div>
          </div>

          <div className="flex items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-800">You get rewarded</h3>
              <p className="text-sm text-gray-600 mt-1">₹50 bonus credited instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Refer;
