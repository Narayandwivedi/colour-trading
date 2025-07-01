import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Users, Wallet, UserCheck, UserX, Eye, Edit3, Trash2, Search, Filter, Download, MapPin, CreditCard, Repeat } from 'lucide-react';

const ManageUser = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

  async function fetchAllUsers() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/allusers`);
      if (data.success) {
        setUsers(data.allUsers);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
  const totalWithdrawable = users.reduce((sum, user) => sum + (user.withdrawableBalance || 0), 0);
  const activeUsers = users.filter(user => (user.balance || 0) > 0).length;

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.referralCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && (user.balance || 0) > 0) ||
                         (filterStatus === 'inactive' && (user.balance || 0) === 0) ||
                         (filterStatus === 'first-deposit' && user.isFirstDeposit) ||
                         (filterStatus === 'bank-added' && user.isBankAdded) ||
                         (filterStatus === 'upi-added' && user.isUpiAdded);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleView = (userId) => {
    // Implement view user functionality
    console.log('View user:', userId);
    // You can add navigation to user detail page or open a modal
    // Example: navigate(`/admin/users/${userId}`);
  };

  const handleEdit = (userId) => {
    // Implement edit user functionality
    console.log('Edit user:', userId);
    // You can add navigation to edit page or open edit modal
    // Example: navigate(`/admin/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    // Implement delete user functionality
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { data } = await axios.delete(`${BACKEND_URL}/api/admin/deleteuser/${userId}`);
        if (data.success) {
          toast.success('User deleted successfully');
          fetchAllUsers(); // Refresh the user list
        } else {
          toast.error(data.message || 'Failed to delete user');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and monitor all user accounts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-5 w-0 flex-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="text-lg sm:text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-5 w-5 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-5 w-0 flex-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd className="text-lg sm:text-2xl font-bold text-gray-900">{activeUsers.toLocaleString()}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wallet className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-5 w-0 flex-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                <dd className="text-sm sm:text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Download className="h-5 w-5 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <div className="ml-2 sm:ml-5 w-0 flex-1">
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Withdrawable</dt>
                <dd className="text-sm sm:text-2xl font-bold text-gray-900">{formatCurrency(totalWithdrawable)}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <select
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                  <option value="first-deposit">First Deposit</option>
                  <option value="bank-added">Bank Added</option>
                  <option value="upi-added">UPI Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6">
          {currentUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              {/* Header with Avatar and Actions */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {(user.fullName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{user.fullName || 'Unknown User'}</h3>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleView(user._id)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                    title="View User"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(user._id)}
                    className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                    title="Edit User"
                  >
                    <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    title="Delete User"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* User ID */}
              <div className="mb-3">
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-xs font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded truncate">{user._id}</p>
              </div>

              {/* Balance Information */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Wallet className="h-3 w-3 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Balance</span>
                  </div>
                  <p className="text-sm font-bold text-blue-900">{formatCurrency(user.balance)}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Download className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600 font-medium">Withdrawable</span>
                  </div>
                  <p className="text-sm font-bold text-green-900">{formatCurrency(user.withdrawableBalance)}</p>
                </div>
              </div>

              {/* Referral Information */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Referral Code</p>
                  <p className="text-xs font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">{user.referralCode || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Repeat className="h-3 w-3 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">Referrals</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{user.totalReferal || 0}</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Payment Methods</p>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.isBankAdded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <CreditCard className="inline h-3 w-3 mr-1" />
                    Bank
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.isUpiAdded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <Wallet className="inline h-3 w-3 mr-1" />
                    UPI
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1">
                {(user.balance || 0) > 0 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Active
                  </span>
                )}
                {user.isFirstDeposit && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    First Deposit
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                    <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;