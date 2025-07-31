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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Deposit Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage deposit requests - {pagination.totalDeposits} total {currentStatus} deposits
            </p>
          </div>
          <button
            onClick={() => fetchDepositsByStatus(currentStatus, pagination.currentPage)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: "pending", label: "Pending Deposits", activeColor: "bg-amber-600 text-white shadow-lg shadow-amber-200", inactiveColor: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
              { key: "success", label: "Approved Deposits", activeColor: "bg-green-600 text-white shadow-lg shadow-green-200", inactiveColor: "bg-green-100 text-green-800 hover:bg-green-200" },
              { key: "rejected", label: "Rejected Deposits", activeColor: "bg-red-600 text-white shadow-lg shadow-red-200", inactiveColor: "bg-red-100 text-red-800 hover:bg-red-200" },
            ].map(({ key, label, activeColor, inactiveColor }) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStatus === key ? activeColor : inactiveColor
                }`}
              >
                {label}
                {currentStatus === key && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white bg-opacity-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deposits.map((deposit) => {
                const statusConfig = getStatusConfig(deposit.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={deposit._id}
                    className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.shadowColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`${statusConfig.badgeColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1`}
                      >
                        <StatusIcon size={14} />
                        {deposit.status}
                      </span>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
                        {deposit.type}
                      </div>
                    </div>

                    {/* Deposit Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-700">
                          {formatDate(deposit.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-gray-500" />
                        <div>
                          <div className="text-gray-700 font-medium">
                            {deposit.userId?.fullName || 'N/A'}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {deposit.userId?.email || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Hash size={16} className="text-gray-500" />
                        <span className="text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded">
                          UTR: {deposit.UTR}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-500" />
                        <span className="text-xl font-bold text-gray-800">
                          {formatAmount(deposit.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons for Pending Deposits */}
                    {deposit.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t border-amber-200">
                        <button
                          onClick={() => handleApprove(deposit._id)}
                          className="flex-1 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(deposit._id)}
                          className="flex-1 bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium flex items-center justify-center gap-1"
                        >
                          <XCircle size={16} />
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
              <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 mt-8">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                  <span className="ml-2 text-gray-500">
                    ({pagination.totalDeposits} total {currentStatus} deposits)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      pagination.hasPrevPage
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      pagination.hasNextPage
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Eye size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No {currentStatus} deposits found
              </h3>
              <p className="text-gray-500">
                There are no {currentStatus} deposits to display at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;