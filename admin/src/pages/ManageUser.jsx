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
  
  // Edit user modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    balance: '',
    withdrawableBalance: '',
    password: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [togglingIds, setTogglingIds] = useState(new Set());

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
                         (user.mobile || '').toString().includes(searchTerm) ||
                         (user.referralCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'banned' && !user.isActive) ||
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
    const user = users.find(u => u._id === userId);
    if (user) {
      setEditingUser(user);
      setEditFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        balance: user.balance?.toString() || '0',
        withdrawableBalance: user.withdrawableBalance?.toString() || '0',
        password: ''
      });
      setIsEditModalOpen(true);
    }
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

  const toggleUserStatus = async (userId) => {
    try {
      setTogglingIds(prev => new Set(prev).add(userId));
      const { data } = await axios.put(`${BACKEND_URL}/api/admin/toggle-user-status/${userId}`);
      if (data.success) {
        toast.success(data.message);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
      } else {
        toast.error(data.message || 'Failed to toggle user status');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error toggling user status');
    } finally {
      setTogglingIds(prev => { const next = new Set(prev); next.delete(userId); return next; });
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setIsUpdating(true);
      
      // Validate form data
      if (!editFormData.fullName.trim()) {
        toast.error('Full name is required');
        return;
      }
      
      if (!editFormData.email.trim()) {
        toast.error('Email is required');
        return;
      }
      
      const balanceNum = parseFloat(editFormData.balance);
      const withdrawableBalanceNum = parseFloat(editFormData.withdrawableBalance);
      
      if (isNaN(balanceNum) || balanceNum < 0) {
        toast.error('Balance must be a valid non-negative number');
        return;
      }
      
      if (isNaN(withdrawableBalanceNum) || withdrawableBalanceNum < 0) {
        toast.error('Withdrawable balance must be a valid non-negative number');
        return;
      }

      // Validate password if provided
      if (editFormData.password && editFormData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      const requestData = {
        fullName: editFormData.fullName.trim(),
        email: editFormData.email.trim(),
        balance: balanceNum,
        withdrawableBalance: withdrawableBalanceNum
      };

      // Only include password if it's not empty
      if (editFormData.password.trim()) {
        requestData.password = editFormData.password.trim();
      }

      const { data } = await axios.put(`${BACKEND_URL}/api/users/edit/${editingUser._id}`, requestData);

      if (data.success) {
        toast.success(data.message || 'User updated successfully');
        if (data.changes && data.changes.length > 0) {
          console.log('Changes made:', data.changes);
        }
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchAllUsers(); // Refresh the user list
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({
      fullName: '',
      email: '',
      balance: '',
      withdrawableBalance: '',
      password: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-base sm:text-lg font-bold text-gray-900">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage and monitor all user accounts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Total</dt>
                <dd className="text-xs sm:text-sm font-bold text-gray-900">{totalUsers.toLocaleString()}</dd>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Active</dt>
                <dd className="text-xs sm:text-sm font-bold text-gray-900">{activeUsers.toLocaleString()}</dd>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Balance</dt>
                <dd className="text-[11px] sm:text-sm font-bold text-gray-900 truncate">{formatCurrency(totalBalance)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] sm:text-xs text-gray-500 truncate">Withdrawable</dt>
                <dd className="text-[11px] sm:text-sm font-bold text-gray-900 truncate">{formatCurrency(totalWithdrawable)}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 p-2 sm:p-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-7 sm:pl-8 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-32 sm:w-36">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <select
                className="w-full pl-7 sm:pl-8 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-1 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
                <option value="first-deposit">First Deposit</option>
                <option value="bank-added">Bank Added</option>
                <option value="upi-added">UPI Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile: User Cards */}
        <div className="sm:hidden space-y-2 mb-4">
          {currentUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-white">{(user.fullName || 'U').charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.fullName || 'Unknown'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleUserStatus(user._id)} disabled={togglingIds.has(user._id)} className={`p-0.5 rounded ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`} title={user.isActive ? 'Deactivate' : 'Activate'}>
                    {togglingIds.has(user._id) ? <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : user.isActive ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg> : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
                  </button>
                  <button onClick={() => handleEdit(user._id)} className="text-green-600 p-0.5 hover:bg-green-50 rounded" title="Edit"><Edit3 className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-600 p-0.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 p-1.5 rounded">
                  <span className="text-[10px] text-blue-600 block">Balance</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(user.balance)}</span>
                </div>
                <div className="bg-green-50 p-1.5 rounded">
                  <span className="text-[10px] text-green-600 block">Withdrawable</span>
                  <span className="font-semibold text-green-900">{formatCurrency(user.withdrawableBalance)}</span>
                </div>
                <div className="bg-gray-50 p-1.5 rounded text-center">
                  <span className="text-[10px] text-gray-500 block">Ref</span>
                  <span className="font-semibold text-gray-800">{user.totalReferal || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px]">
                <div className="flex gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${
                    user.isBankAdded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>Bank</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${
                    user.isUpiAdded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>UPI</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{user.isActive ? 'Active' : 'Banned'}</span>
                </div>
                <span className="text-gray-400 font-mono">{user._id.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: User Table */}
        <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Withdrawable</th>
                  <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Ref</th>
                  <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-medium text-white">{(user.fullName || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate max-w-[140px]">{user.fullName || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[140px]">{user.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-mono text-gray-500">{user._id.slice(-8)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{user.mobile || '-'}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-xs font-semibold text-gray-900">{formatCurrency(user.balance)}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-xs font-semibold text-gray-900">{formatCurrency(user.withdrawableBalance)}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-xs text-gray-700">{user.totalReferal || 0}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.isBankAdded ? 'bg-green-500' : 'bg-red-400'}`} title={user.isBankAdded ? 'Bank added' : 'No bank'} />
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.isUpiAdded ? 'bg-green-500' : 'bg-red-400'}`} title={user.isUpiAdded ? 'UPI added' : 'No UPI'} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <button onClick={() => toggleUserStatus(user._id)} disabled={togglingIds.has(user._id)} className={`p-1 rounded ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`} title={user.isActive ? 'Deactivate' : 'Activate'}>
                          {togglingIds.has(user._id) ? <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={user.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}/></svg>}
                        </button>
                        <button onClick={() => handleEdit(user._id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit"><Edit3 className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(user._id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-600">
                {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-6 h-6 text-[10px] sm:text-xs font-medium rounded ${
                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <UserX className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-1 text-xs text-gray-500">No users found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Edit User</h3>
              <button onClick={handleCloseEditModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">User ID</label>
                <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded font-mono">{editingUser._id}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditFormChange} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Balance (₹)</label>
                <input type="number" name="balance" value={editFormData.balance} onChange={handleEditFormChange} min="0" step="0.01" className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Withdrawable Balance (₹)</label>
                <input type="number" name="withdrawableBalance" value={editFormData.withdrawableBalance} onChange={handleEditFormChange} min="0" step="0.01" className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="password" name="password" value={editFormData.password} onChange={handleEditFormChange} minLength="6" className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" placeholder="Leave blank to keep current" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={handleCloseEditModal} disabled={isUpdating} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50">Cancel</button>
              <button onClick={handleSaveUser} disabled={isUpdating} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1">
                {isUpdating ? (
                  <><svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
                ) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;