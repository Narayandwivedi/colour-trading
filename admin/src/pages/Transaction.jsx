import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle, Clock, XCircle, User, Calendar, Hash, DollarSign, Eye } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Transaction = () => {
  const [allTransaction, setAllTransaction] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const {BACKEND_URL} = useContext(AppContext)


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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          badgeColor: "bg-green-100 text-green-800",
          shadowColor: "shadow-green-100"
        };
      case "pending":
        return {
          icon: Clock,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          badgeColor: "bg-amber-100 text-amber-800",
          shadowColor: "shadow-amber-100"
        };
      case "rejected":
        return {
          icon: XCircle,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          badgeColor: "bg-red-100 text-red-800",
          shadowColor: "shadow-red-100"
        };
      default:
        return {
          icon: Eye,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          badgeColor: "bg-gray-100 text-gray-800",
          shadowColor: "shadow-gray-100"
        };
    }
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
        // Refresh transactions after approval
        fetchAllTransaction();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async () => {
    toast.info("Reject functionality coming soon!");
  };

  const fetchAllTransaction = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/transaction`);
      if (data.success) {
        setAllTransaction(data.allTransaction);
        console.log("transaction fetched successfully");
        
      }
    } catch (err) {
      toast.error("Unable to fetch transactions");
      setAllTransaction([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransaction()
    setInterval(() => {
      fetchAllTransaction()
    }, 8000);
  }, []);

  const filteredTransactions = allTransaction ? 
    allTransaction.filter(transaction => 
      filter === "all" || transaction.status === filter
    ) : [];

  const getStatusCounts = () => {
    if (!allTransaction) return { all: 0, success: 0, pending: 0, rejected: 0 };
    
    return allTransaction.reduce((acc, transaction) => {
      acc.all++;
      acc[transaction.status] = (acc[transaction.status] || 0) + 1;
      return acc;
    }, { all: 0, success: 0, pending: 0, rejected: 0 });
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Transaction Management</h1>
          <p className="text-gray-600">Monitor and manage all transaction requests</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: "all", label: "All Transactions", count: statusCounts.all },
              { key: "success", label: "Approved", count: statusCounts.success },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              { key: "rejected", label: "Rejected", count: statusCounts.rejected }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filter === key
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white bg-opacity-20">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Grid */}
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTransactions.map((transaction) => {
              const statusConfig = getStatusConfig(transaction.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={transaction._id}
                  className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.shadowColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${statusConfig.badgeColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1`}>
                      <StatusIcon size={14} />
                      {transaction.status}
                    </span>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
                      {transaction.type}
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-700">{formatDate(transaction.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded">
                        {transaction.userId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Hash size={16} className="text-gray-500" />
                      <span className="text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded">
                        {transaction.UTR}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      <span className="text-xl font-bold text-gray-800">
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Pending Transactions */}
                  {transaction.status === "pending" && (
                    <div className="space-y-3 pt-4 border-t border-amber-200">
                      <input
                        type="number"
                        placeholder="Enter approved amount"
                        className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
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
                          className="flex-1 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={handleReject}
                          className="flex-1 bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium flex items-center justify-center gap-1"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Eye size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "There are no transactions to display." 
                  : `No ${filter} transactions found.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;