import React, { useState } from "react";

const AddBank = () => {
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountname, setAccountName] = useState("");

  const submitBankDetails = async () => {
    // Your logic here
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Bank Account</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter account number"
          />
        </div>

        <div>
          <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code
          </label>
          <input
            id="ifsc"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter IFSC code"
          />
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter bank name (e.g. STATE BANK OF INDIA)"
          />
        </div>

        <div>
          <label htmlFor="accountname" className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input
            id="accountname"
            value={accountname}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter name on bank account"
          />
        </div>

        <button
          onClick={submitBankDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Bank Account
        </button>
      </div>
    </div>
  );
};

export default AddBank;