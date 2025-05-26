import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Transaction = () => {
  const [allTransaction, setAllTransaction] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

  const BACKEND_URL = "http://localhost:8080";

  const handleApprove = async (userId, transactionId) => {
    const totalAmount = amountInputs[transactionId];
    if (!totalAmount) return toast.error("Please enter amount");

    try {
      const { data } = await axios.put(`${BACKEND_URL}/api/users/updatebalance`, {
        userId,
        totalAmount,
      });

      if (data.success) {
        toast.success(data.message);
        setAmountInputs((prev) => ({
          ...prev,
          [transactionId]: "",
        }));
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

  const filteredTransactions = allTransaction?.filter(
    (t) => t.status === filterStatus
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-10 text-gray-600">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-4">
        {["pending", "completed", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md font-medium capitalize ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <div className="min-w-[768px] grid grid-cols-7 sm:grid-cols-7 gap-4 items-center bg-gray-100 p-4 border-b">
          <p className="text-sm font-semibold text-gray-700">Created At</p>
          <p className="text-sm font-semibold text-gray-700">User ID</p>
          <p className="text-sm font-semibold text-gray-700 text-center">UTR</p>
          <p className="text-sm font-semibold text-gray-700">Status</p>
          <p className="text-sm font-semibold text-gray-700">Total Amount</p>
          <p className="text-sm font-semibold text-gray-700 text-center">Approve</p>
          <p className="text-sm font-semibold text-gray-700 text-center">Reject</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTransactions?.length === 0 ? (
            <div className="text-center py-6 text-gray-500 col-span-7">
              No {filterStatus} transactions.
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const formattedDate = new Date(transaction.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={transaction._id}
                  className="min-w-[768px] grid grid-cols-7 sm:grid-cols-7 gap-4 items-center p-4 hover:bg-gray-50 transition"
                >
                  <p className="text-xs text-gray-600">{formattedDate}</p>
                  <p className="text-gray-800 text-xs break-all">{transaction.userId}</p>
                  <p className="text-gray-600 text-sm text-center">{transaction.UTR}</p>

                  <div className="flex items-center text-xs">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${
                        transaction.status === "pending"
                          ? "bg-yellow-500"
                          : transaction.status === "completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="capitalize">{transaction.status}</span>
                  </div>

                  <input
                    onChange={(e) =>
                      setAmountInputs((prev) => ({
                        ...prev,
                        [transaction._id]: e.target.value,
                      }))
                    }
                    value={amountInputs[transaction._id] || ""}
                    className="border border-gray-300 w-full max-w-[100px] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="₹0.00"
                    type="number"
                  />

                  <button
                    onClick={() => handleApprove(transaction.userId, transaction._id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md text-sm font-medium transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm font-medium transition"
                  >
                    Reject
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
