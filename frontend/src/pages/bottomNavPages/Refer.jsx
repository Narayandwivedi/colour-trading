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
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 max-w-[440px] mx-auto relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Header */}
      <div className="text-center pt-8 px-6 pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
          Refer & Earn
        </h1>
        <p className="text-cyan-200 mt-3 text-base max-w-md mx-auto">
          Invite friends and earn ₹50 for each successful referral
        </p>
      </div>

      {/* Stats Card */}
      <div className="mx-6 mt-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-cyan-400/30">
        {/* Ocean glow effects */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full z-0"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/15 blur-2xl rounded-full z-0"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-cyan-100">Total Referrals</p>
              <p className="text-3xl font-bold mt-1">{userData?.totalReferal || 0}</p>
            </div>
            <div className="text-5xl">👥</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-cyan-100">GET ₹50</p>
                <p className="text-xl font-bold mt-1">On ₹500 Deposit</p>
                <p className="text-xs mt-1 text-cyan-200">By your friend</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-xl font-semibold text-cyan-200 mb-4">Your Referral Code</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-4 shadow-2xl">
          <div className="flex items-center justify-between bg-black/20 backdrop-blur-sm rounded-xl px-4 py-4 border border-cyan-500/30">
            <span className="text-lg font-mono text-cyan-100 tracking-widest font-bold">
              {userData ? userData.referralCode : 'Loading...'}
            </span>
            <button
              onClick={handleCopy}
              className={`ml-3 text-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                copied
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Tiers Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-xl font-semibold text-cyan-200 mb-4">Bonus Tiers</h2>
        <div className="space-y-3">
          {[
            { deposit: 500, bonus: 50 },
            { deposit: 1000, bonus: 120 },
            { deposit: 2000, bonus: 250 },
            { deposit: 4000, bonus: 520 },
            { deposit: 8000, bonus: 1100 },
          ].map((tier, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm px-5 py-4 rounded-xl border border-cyan-400/20 shadow-lg hover:bg-white/15 transition-all duration-300"
            >
              <span className="text-sm text-cyan-200 font-medium">Deposit ₹{tier.deposit}</span>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-lg">
                <span className="text-sm font-bold text-white">Get ₹{tier.bonus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-6 mt-8">
        <h2 className="text-xl font-semibold text-cyan-200 mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-cyan-400/20 shadow-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-lg">
              1
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 text-base">Share your referral code</h3>
              <p className="text-sm text-cyan-300 mt-2">Send your unique code to friends and family</p>
            </div>
          </div>

          <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-cyan-400/20 shadow-lg">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-lg">
              2
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 text-base">Friend signs up & deposits</h3>
              <p className="text-sm text-cyan-300 mt-2">They need to deposit minimum ₹500 to qualify</p>
            </div>
          </div>

          <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-cyan-400/20 shadow-lg">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-lg">
              3
            </div>
            <div>
              <h3 className="font-semibold text-cyan-100 text-base">You get rewarded instantly</h3>
              <p className="text-sm text-cyan-300 mt-2">₹50 bonus credited to your account immediately</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-8"></div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Refer;