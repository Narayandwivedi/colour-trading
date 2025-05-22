import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Transaction = () => {
  const [allTransaction, setAllTransaction] = useState(null);
  const [amountInputs, setAmountInputs] = useState({}); // store per-transaction amount
  const [loading, setLoading] = useState(true);
  
  const BACKEND_URL = 'http://localhost:8080';

  const handleApprove = async (userId) => {
    const totalAmount = amountInputs[userId];

    if (!totalAmount) {
      return toast.error("Please enter amount");
    }

    try {
      const { data } = await axios.put(`${BACKEND_URL}/api/users/updatebalance`, {
        userId,
        totalAmount
      });

      if (data.success) {
        toast.success(data.message);
      } 
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async () => {
    toast.info("Reject functionality coming soon!");
  };

  useEffect(() => {
    async function fetchAllTransaction() {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/transaction`);
        if (data.success) {
          setAllTransaction(data.allTransaction);
        }
      } catch (err) {
        toast.error("Unable to fetch transactions");
        setAllTransaction([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllTransaction();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-10 text-gray-600">
        Loading transactions...
      </div>
    );
  }

  if (!allTransaction || allTransaction.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-10 text-gray-600">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-7 items-center gap-4 bg-gray-50 p-4 border-b border-gray-200">
        <p className="text-lg font-medium text-gray-700">Created At</p>
        <p className="text-lg font-medium text-gray-700">User ID</p>
        <p className="text-lg font-medium text-gray-700 text-center">UTR</p>
        <p className="text-lg font-medium text-gray-700">Status</p>
        <p className="text-lg font-medium text-gray-700">Total Amount</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {allTransaction.map((transaction) => {
          const createdAtDate = new Date(transaction.createdAt);
          const formattedDate = createdAtDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          return (
            <div
              key={transaction._id}
              className="grid grid-cols-7 items-center gap-4 p-4 hover:bg-gray-50 transition-colors mb-2"
            >
              {/* Created At */}
              <p className="text-xs text-gray-600">{formattedDate}</p>

              {/* User ID */}
              <p className="text-gray-800 text-xs font-medium">{transaction.userId}</p>

              {/* UTR */}
              <p className="text-gray-600 text-sm text-center">{transaction.UTR}</p>

              {/* Status with colored indicator */}
              <div className="flex items-center text-xs">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${
                    transaction.status === 'pending'
                      ? 'bg-yellow-500'
                      : transaction.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></span>
                <span className="capitalize">{transaction.status}</span>
              </div>

              {/* Total Amount Input */}
              <input
                onChange={(e) =>
                  setAmountInputs((prev) => ({
                    ...prev,
                    [transaction.userId]: e.target.value,
                  }))
                }
                value={amountInputs[transaction.userId] || ""}
                className="border border-gray-400 w-[90px] rounded-md px-2 py-1 text-sm"
                placeholder="₹0.00"
                type="number"
              />

              {/* Approve Button */}
              <button
                onClick={() => handleApprove(transaction.userId)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium w-[100px]"
              >
                Approve
              </button>

              {/* Reject Button */}
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium w-[100px]"
              >
                Reject
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transaction;
