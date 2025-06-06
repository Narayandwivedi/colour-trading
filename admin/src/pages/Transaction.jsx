import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Transaction = () => {
  const [allTransaction, setAllTransaction] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:8080";
  //  const BACKEND_URL = `http://168.231.120.131:8080`;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleApprove = async (userId, transactionId) => {
    const totalAmount = amountInputs[transactionId];
    if (!totalAmount) return toast.error("Please enter amount");

    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/users/updatebalance`,
        {
          userId,
          totalAmount,
          transactionId
        }
      );

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-10 text-gray-600">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        All Transactions
      </h2>

      {allTransaction && allTransaction.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allTransaction.map((transaction) => (
            <div
              key={transaction._id}
              className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200"
            >
              <div className="mb-2 text-sm text-gray-600">
                {formatDate(transaction.createdAt)}
              </div>
              <div>
                {transaction.userId}
              </div>
              <div className="text-sm"><span className="font-medium text-gray-800">UTR:</span> {transaction.UTR}</div>
              <div className="text-sm"><span className="font-medium text-gray-800">Amount:</span> ₹{transaction.amount}</div>
              <div className="text-sm">
                <span className="font-medium text-gray-800">Status:</span>{" "}
                <span
                  className={`capitalize font-semibold ${
                    transaction.status === "pending"
                      ? "text-yellow-600"
                      : transaction.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>

              {transaction.status === "pending" && (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="border border-gray-300 p-2 rounded w-full text-sm"
                    value={amountInputs[transaction._id] || ""}
                    onChange={(e) =>
                      setAmountInputs((prev) => ({
                        ...prev,
                        [transaction._id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleApprove(transaction.userId, transaction._id)
                      }
                      className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No transactions found.</p>
      )}
    </div>
  );
};

export default Transaction;
