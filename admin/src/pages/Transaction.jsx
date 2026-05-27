import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  Hash,
  DollarSign,
  Eye,
  RefreshCw,
} from "lucide-react";
import { AppContext } from "../context/AppContext";

const Transaction = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending"); // Default to pending
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDeposits: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });

  const { BACKEND_URL } = useContext(AppContext);

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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
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
          shadowColor: "shadow-green-100",
        };
      case "pending":
        return {
          icon: Clock,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          badgeColor: "bg-amber-100 text-amber-800",
          shadowColor: "shadow-amber-100",
        };
      case "rejected":
        return {
          icon: XCircle,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          badgeColor: "bg-red-100 text-red-800",
          shadowColor: "shadow-red-100",
        };
      default:
        return {
          icon: Eye,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          badgeColor: "bg-gray-100 text-gray-800",
          shadowColor: "shadow-gray-100",
        };
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/transaction/approve`,
        {
          transactionId,
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Refresh current page
        fetchDepositsByStatus(currentStatus, pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error approving deposit");
    }
  };

  const handleReject = async (transactionId) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/transaction/reject`,
        {
          transactionId,
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Refresh current page
        fetchDepositsByStatus(currentStatus, pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting deposit");
    }
  };

  const fetchDepositsByStatus = async (status, page = 1) => {
    try {
      setLoading(true);
      console.log(`Fetching deposits with status: ${status}, page: ${page}`);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/transaction/deposits?status=${status}&page=${page}&limit=20`
      );
      
      console.log('API Response:', data);
      
      if (data.success) {
        setDeposits(data.data.deposits);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch deposits");
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
      toast.error(err.response?.data?.message || "Unable to fetch deposits");
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1
    fetchDepositsByStatus(status, 1);
  };

  const handlePageChange = (newPage) => {
    fetchDepositsByStatus(currentStatus, newPage);
  };

  useEffect(() => {
    fetchDepositsByStatus("pending", 1);
  }, []); // Only run once on mount

  useEffect(() => {
    // Auto-refresh every 30 seconds for pending deposits only
    if (currentStatus === "pending") {
      const interval = setInterval(() => {
        fetchDepositsByStatus(currentStatus, pagination.currentPage);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [currentStatus, pagination.currentPage]);

  if (loading && deposits.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600">Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">Deposit Management</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Monitor and manage deposit requests — {pagination.totalDeposits} total {currentStatus} deposits
            </p>
          </div>
          <button
            onClick={() => fetchDepositsByStatus(currentStatus, pagination.currentPage)}
            className="self-start bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <div className="flex flex-wrap items-center gap-2 p-2 sm:p-3">
          {[
            { key: "pending", label: "Pending", activeColor: "bg-amber-600 text-white shadow-lg shadow-amber-200", inactiveColor: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
            { key: "success", label: "Approved", activeColor: "bg-green-600 text-white shadow-lg shadow-green-200", inactiveColor: "bg-green-100 text-green-800 hover:bg-green-200" },
            { key: "rejected", label: "Rejected", activeColor: "bg-red-600 text-white shadow-lg shadow-red-200", inactiveColor: "bg-red-100 text-red-800 hover:bg-red-200" },
          ].map(({ key, label, activeColor, inactiveColor }) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                currentStatus === key ? activeColor : inactiveColor
              }`}
            >
              {label}
              {currentStatus === key && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-white bg-opacity-20">
                  {pagination.totalDeposits}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Grid */}
      {deposits.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {deposits.map((deposit) => {
              const statusConfig = getStatusConfig(deposit.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={deposit._id}
                  className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-3 shadow-sm`}
                >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`${statusConfig.badgeColor} px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1`}
                      >
                        <StatusIcon size={10} />
                        {deposit.status}
                      </span>
                      <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded">
                        {deposit.type}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={12} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600">{formatDate(deposit.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <User size={12} className="text-gray-400 shrink-0" />
                        <div>
                          <span className="text-gray-700 font-medium">{deposit.userId?.fullName || 'N/A'}</span>
                          <span className="text-gray-400 ml-1">{deposit.userId?.email || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <Hash size={12} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 font-mono">UTR: {deposit.UTR}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <DollarSign size={12} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-900">{formatAmount(deposit.amount)}</span>
                      </div>
                    </div>

                    {deposit.status === "pending" && (
                      <div className="flex gap-1.5 pt-2 border-t border-amber-200">
                        <button
                          onClick={() => handleApprove(deposit._id)}
                          className="flex-1 bg-green-600 text-white text-[10px] px-2 py-1 rounded hover:bg-green-700 font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={10} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(deposit._id)}
                          className="flex-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded hover:bg-red-600 font-medium flex items-center justify-center gap-1"
                        >
                          <XCircle size={10} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalDeposits} total)
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <span className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded bg-gray-100 text-gray-700">
                      {pagination.currentPage}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Eye className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-1 text-xs text-gray-500">No {currentStatus} deposits found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;