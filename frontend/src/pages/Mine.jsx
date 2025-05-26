import React from 'react';

const Mine = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 animate-pulse">💣 Mines</h1>
        <p className="text-lg text-gray-300">Coming soon...</p>
        <div className="mt-6">
          <div className="w-24 h-1 bg-yellow-500 rounded-full mx-auto animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Mine;
