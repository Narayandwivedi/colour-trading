import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle, Clock, XCircle, User, Calendar, Hash, DollarSign, Eye, CreditCard, ArrowUpCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ManageWithdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending"); // Default to pending
  const [processingIds, setProcessingIds] = useState(new Set()); // Track processing withdrawals
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalWithdrawals: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });

  const {BACKEND_URL} = useContext(AppContext);

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

  const handleApprove = async (withdrawId) => {
    try {
      // Add to processing set
      setProcessingIds(prev => new Set(prev).add(withdrawId));
      
      const { data } = await axios.put(
        `${BACKEND_URL}/api/admin/approve-withdraw`,
        {
          withdrawId
        }
      );

      if (data.success) {
        toast.success(data.message || "Withdrawal approved successfully");
        // Refresh withdrawals after approval
        await fetchWithdrawals(currentStatus, pagination.currentPage);
      } else {
        toast.error(data.message || "Failed to approve withdrawal");
      }
    } catch (err) {
      console.error("Error approving withdrawal:", err);
      toast.error(err.response?.data?.message || "Failed to approve withdrawal");
    } finally {
      // Remove from processing set
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(withdrawId);
        return newSet;
      });
    }
  };

  const handleReject = async (withdrawId) => {
    try {
      // Add to processing set
      setProcessingIds(prev => new Set(prev).add(withdrawId));
      
      const { data } = await axios.put(
        `${BACKEND_URL}/api/admin/reject-withdraw`,
        {
          withdrawId
        }
      );

      if (data.success) {
        toast.success(data.message || "Withdrawal rejected successfully");
        // Refresh withdrawals after rejection
        await fetchWithdrawals(currentStatus, pagination.currentPage);
      } else {
        toast.error(data.message || "Failed to reject withdrawal");
      }
    } catch (err) {
      console.error("Error rejecting withdrawal:", err);
      toast.error(err.response?.data?.message || "Failed to reject withdrawal");
    } finally {
      // Remove from processing set
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(withdrawId);
        return newSet;
      });
    }
  };

  const fetchWithdrawals = async (status = currentStatus, page = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/transaction/withdrawals?status=${status}&page=${page}&limit=${pagination.limit}`
      );
      
      if (data.success) {
        setWithdrawals(data.data.withdrawals);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch withdrawals");
        setWithdrawals([]);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      toast.error(err.response?.data?.message || "Unable to fetch withdrawals");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    fetchWithdrawals(newStatus, 1);
  };

  const handlePageChange = (newPage) => {
    fetchWithdrawals(currentStatus, newPage);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const getTotalAmount = () => {
    if (!withdrawals.length) return 0;
    return withdrawals.reduce((total, withdrawal) => total + withdrawal.amount, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowUpCircle className="text-purple-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-800">Withdrawal Management</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all withdrawal requests</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {withdrawals.length}
              </div>
              <div className="text-gray-600 text-sm">Current Page</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {pagination.totalWithdrawals}
              </div>
              <div className="text-gray-600 text-sm">Total {currentStatus}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatAmount(getTotalAmount())}
              </div>
              <div className="text-gray-600 text-sm">Page Amount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {pagination.currentPage}/{pagination.totalPages}
              </div>
              <div className="text-gray-600 text-sm">Page Info</div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: "pending", label: "Pending", icon: Clock },
              { key: "success", label: "Approved", icon: CheckCircle },
              { key: "rejected", label: "Rejected", icon: XCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentStatus === key
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <button
              onClick={() => fetchWithdrawals(currentStatus, pagination.currentPage)}
              className="px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Withdrawals Grid */}
        {withdrawals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {withdrawals.map((withdrawal) => {
              const statusConfig = getStatusConfig(withdrawal.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={withdrawal._id}
                  className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.shadowColor} border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[280px] flex flex-col max-w-sm`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${statusConfig.badgeColor} px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1`}>
                      <StatusIcon size={12} />
                      {withdrawal.status}
                    </span>
                    <div className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
                      {withdrawal._id.slice(-6)}
                    </div>
                  </div>

                  {/* Withdrawal Details */}
                  <div className="space-y-3 mb-4 flex-grow">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-700">{formatDate(withdrawal.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                          {withdrawal.userId?.fullName || 'N/A'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {withdrawal.userId?.email || withdrawal.userId?.mobile || 'No contact info'}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="flex items-start gap-2 text-sm">
                      <CreditCard size={16} className="text-gray-500 mt-0.5" />
                      <div className="flex flex-col w-full">
                        {withdrawal.paymentMethod === 'upi' && withdrawal.userId?.upiId?.upi ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-gray-700 font-medium">UPI:</span>
                              <span className="text-blue-600 font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                                {withdrawal.userId.upiId.upi}
                              </span>
                            </div>
                            {withdrawal.userId.upiId.accountHolderName && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs">Holder:</span>
                                <span className="text-gray-700 text-xs font-medium">
                                  {withdrawal.userId.upiId.accountHolderName}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : withdrawal.paymentMethod === 'bank' && withdrawal.userId?.bankAccount ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-gray-700 font-medium">Bank:</span>
                              <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                                {withdrawal.userId.bankAccount.bankName || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">A/C:</span>
                                <span className="text-gray-700 font-mono">
                                  {withdrawal.userId.bankAccount.accountNumber || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">IFSC:</span>
                                <span className="text-gray-700 font-mono">
                                  {withdrawal.userId.bankAccount.ifscCode || 'N/A'}
                                </span>
                              </div>
                            </div>
                            {withdrawal.userId.bankAccount.accountHolderName && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs">Holder:</span>
                                <span className="text-gray-700 text-xs font-medium">
                                  {withdrawal.userId.bankAccount.accountHolderName}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-700 font-medium">
                            {withdrawal.paymentMethod?.toUpperCase() || 'UPI'} - No details available
                          </span>
                        )}
                      </div>
                    </div>


                    <div className="flex items-center justify-between bg-white bg-opacity-50 rounded-lg p-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={16} className="text-gray-600" />
                        <span className="text-gray-600 font-medium text-sm">Amount</span>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {formatAmount(withdrawal.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Pending Withdrawals */}
                  {withdrawal.status === "pending" && (
                    <div className="pt-3 border-t border-amber-200 mt-auto">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleApprove(withdrawal._id)}
                          disabled={processingIds.has(withdrawal._id)}
                          className={`flex-1 text-white text-xs px-2 py-1.5 rounded-md transition-colors duration-200 font-medium flex items-center justify-center gap-1 ${
                            processingIds.has(withdrawal._id)
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {processingIds.has(withdrawal._id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span className="hidden sm:inline">Processing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} />
                              <span className="hidden sm:inline">Approve</span>
                              <span className="sm:hidden">✓</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal._id)}
                          disabled={processingIds.has(withdrawal._id)}
                          className={`flex-1 text-white text-xs px-2 py-1.5 rounded-md transition-colors duration-200 font-medium flex items-center justify-center gap-1 ${
                            processingIds.has(withdrawal._id)
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {processingIds.has(withdrawal._id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span className="hidden sm:inline">Processing...</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              <span className="hidden sm:inline">Reject</span>
                              <span className="sm:hidden">✗</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {pagination.currentPage} of {pagination.totalPages} 
                    ({pagination.totalWithdrawals} total {currentStatus} withdrawals)
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        pagination.hasPrevPage
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                      {pagination.currentPage}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        pagination.hasNextPage
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <ArrowUpCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No withdrawals found</h3>
              <p className="text-gray-500">
                {`No ${currentStatus} withdrawal requests found.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageWithdraw;