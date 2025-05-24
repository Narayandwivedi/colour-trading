import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';

const Refer = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://winnersclub.app/referral/XYZ123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 max-w-[440px] mx-auto relative">
      {/* Header */}
      <div className="text-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-purple-700">Refer & Earn</h1>
        <p className="text-gray-600 mt-2 text-sm">Invite your friends and get ₹50 bonus!</p>
      </div>

      {/* Bonus Card */}
      <div className="mx-4 mt-6 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white rounded-2xl shadow-xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Get ₹50</p>
            <p className="text-sm">when your friend deposits ₹500</p>
          </div>
          <div className="text-4xl">🎁</div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="mx-4 mt-5 bg-white border border-gray-200 rounded-xl p-4 shadow">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Referral Link</p>
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
          <span className="text-xs truncate">{referralLink}</span>
          <button
            onClick={handleCopy}
            className="ml-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-full transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-4 mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-md font-semibold text-gray-700 mb-3">How It Works</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Share your referral link with friends</li>
          <li>👥 They sign up and deposit ₹500</li>
          <li>💸 You get ₹50 bonus instantly</li>
        </ul>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Refer;
