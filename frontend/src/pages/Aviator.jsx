import React from 'react';
import BottomNav from '../components/BottomNav';

const Aviator = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 animate-pulse">🛩️ Aviator</h1>
        <p className="text-lg text-gray-300">Coming soon...</p>
        <div className="mt-6">
          <div className="w-24 h-1 bg-pink-500 rounded-full mx-auto animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Aviator;
