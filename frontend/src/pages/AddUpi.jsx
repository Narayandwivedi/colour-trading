import React, { useState } from "react";

const AddUpi = () => {
  const [upiId, setUpiId] = useState("");
  const [bankingName, setBankingName] = useState("");

  const submitUpiDetails = () => {
    // Your logic here
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add UPI ID</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter UPI ID (e.g. yourname@upi)"
          />
        </div>

        <div>
          <label htmlFor="bankingName" className="block text-sm font-medium text-gray-700 mb-1">
            Banking Name
          </label>
          <input
            id="bankingName"
            value={bankingName}
            onChange={(e) => setBankingName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter banking name"
          />
        </div>

        <button
          onClick={submitUpiDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add UPI ID
        </button>
      </div>
    </div>
  );
};

export default AddUpi;