import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle, Clock, XCircle, User, Calendar, Hash, DollarSign, Eye, CreditCard, ArrowUpCircle } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ManageWithdraw = () => {
  const [allWithdraw, setAllWithdraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
      
      const { data } = await axios.put(
        `${BACKEND_URL}/api/admin/approve-withdraw`,
        {
          withdrawId
        }
      );

      if (data.success) {
        toast.success(data.message || "Withdrawal approved successfully");
        // Refresh withdrawals after approval
        console.log(data);
        
        fetchWithdraw();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve withdrawal");
    }
  };

  const handleReject = async (withdrawId) => {
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/admin/reject-withdraw`,
        {
          withdrawId
        }
      );

      if (data.success) {
        toast.success(data.message || "Withdrawal rejected successfully");
        // Refresh withdrawals after rejection
        fetchWithdraw();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject withdrawal");
    }
  };

  const fetchWithdraw = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/allwithdraw`);
      if (data.success) {
        setAllWithdraw(data.allwithdraw);
        console.log("Withdrawals fetched successfully");
      }
    } catch (err) {
      toast.error("Unable to fetch withdrawals");
      setAllWithdraw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraw();
  }, []);

  const filteredWithdrawals = allWithdraw ? 
    allWithdraw.filter(withdrawal => 
      filter === "all" || withdrawal.status === filter
    ) : [];

  const getStatusCounts = () => {
    if (!allWithdraw) return { all: 0, success: 0, pending: 0, rejected: 0 };
    
    return allWithdraw.reduce((acc, withdrawal) => {
      acc.all++;
      acc[withdrawal.status] = (acc[withdrawal.status] || 0) + 1;
      return acc;
    }, { all: 0, success: 0, pending: 0, rejected: 0 });
  };

  const getTotalAmount = () => {
    if (!filteredWithdrawals.length) return 0;
    return filteredWithdrawals.reduce((total, withdrawal) => total + withdrawal.amount, 0);
  };

  const statusCounts = getStatusCounts();

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {filteredWithdrawals.length}
              </div>
              <div className="text-gray-600 text-sm">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatAmount(getTotalAmount())}
              </div>
              <div className="text-gray-600 text-sm">Total Amount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {statusCounts.pending || 0}
              </div>
              <div className="text-gray-600 text-sm">Pending Approval</div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: "all", label: "All Withdrawals", count: statusCounts.all },
              { key: "success", label: "Approved", count: statusCounts.success },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              { key: "rejected", label: "Rejected", count: statusCounts.rejected }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filter === key
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
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

        {/* Withdrawals Grid */}
        {filteredWithdrawals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWithdrawals.map((withdrawal) => {
              const statusConfig = getStatusConfig(withdrawal.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={withdrawal._id}
                  className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.shadowColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${statusConfig.badgeColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1`}>
                      <StatusIcon size={14} />
                      {withdrawal.status}
                    </span>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg flex items-center gap-1">
                      <CreditCard size={12} />
                      {withdrawal.paymentMethod?.toUpperCase() || 'UPI'}
                    </div>
                  </div>

                  {/* Withdrawal Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-700">{formatDate(withdrawal.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded">
                        {withdrawal.userId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Hash size={16} className="text-gray-500" />
                      <span className="text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded">
                        {withdrawal._id.slice(-8)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      <span className="text-xl font-bold text-gray-800">
                        {formatAmount(withdrawal.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Pending Withdrawals */}
                  {withdrawal.status === "pending" && (
                    <div className="space-y-3 pt-4 border-t border-amber-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(withdrawal._id)}
                          className="flex-1 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal._id)}
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
                <ArrowUpCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No withdrawals found</h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "There are no withdrawal requests to display." 
                  : `No ${filter} withdrawal requests found.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageWithdraw;