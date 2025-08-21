import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
  Eye, 
  EyeOff, 
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';

const ChatSupport = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    isRead: '',
    search: ''
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    categories: {}
  });
  const replyInputRef = useRef(null);

  const categories = ['Deposit Related', 'Withdraw', 'KYC', 'Game Related', 'Other'];

  // Fetch messages with filters
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.isRead !== '') params.append('isRead', filters.isRead);
      
      const response = await fetch(`${BACKEND_URL}/api/chat/messages?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        let filteredMessages = data.messages;
        
        // Apply search filter on frontend
        if (filters.search) {
          filteredMessages = filteredMessages.filter(msg => 
            msg.message.toLowerCase().includes(filters.search.toLowerCase()) ||
            msg.userId?.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            msg.userId?.email?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setMessages(filteredMessages);
        setUnreadCount(data.unreadCount);
        
        // Calculate stats
        const categoryStats = {};
        data.messages.forEach(msg => {
          categoryStats[msg.category] = (categoryStats[msg.category] || 0) + 1;
        });
        
        setStats({
          total: data.messages.length,
          unread: data.unreadCount,
          categories: categoryStats
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/mark-read/${messageId}`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Send reply
  const sendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/reply/${selectedMessage._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          adminReply: replyText
        })
      });

      if (response.ok) {
        setReplyText('');
        fetchMessages();
        // Update selected message
        const updatedMessage = messages.find(m => m._id === selectedMessage._id);
        if (updatedMessage) {
          setSelectedMessage({
            ...updatedMessage,
            adminReply: replyText,
            adminRepliedAt: new Date(),
            hasRealReply: true
          });
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Auto-refresh messages every 10 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [filters]);

  // Focus reply input when message is selected
  useEffect(() => {
    if (selectedMessage && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [selectedMessage]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (message) => {
    if (message.hasRealReply) return 'text-green-600 bg-green-100';
    if (message.isAutoReply) return 'text-yellow-600 bg-yellow-100';
    if (message.isRead) return 'text-blue-600 bg-blue-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = (message) => {
    if (message.hasRealReply) return 'Replied';
    if (message.isAutoReply) return 'Auto-Reply';
    if (message.isRead) return 'Read';
    return 'New';
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Stats Cards */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Messages</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.unread}</div>
            <div className="text-sm opacity-90">Unread</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">
              {messages.filter(m => m.hasRealReply).length}
            </div>
            <div className="text-sm opacity-90">Replied</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">
              {messages.filter(m => m.isAutoReply && !m.hasRealReply).length}
            </div>
            <div className="text-sm opacity-90">Auto-Reply</div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="lg:w-1/2 flex flex-col">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.isRead}
              onChange={(e) => setFilters({...filters, isRead: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>

            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={fetchMessages}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Support Messages
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
          </div>
          
          <div className="overflow-y-auto h-96 lg:h-[calc(100vh-300px)]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p>No messages found</p>
              </div>
            ) : (
              <div className="p-2">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border border-gray-100 rounded-lg mb-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedMessage?._id === message._id ? 'bg-blue-50 border-blue-300' : 
                      !message.isRead ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm text-gray-800">
                          {message.userId?.fullName || 'Unknown User'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message)}`}>
                          {getStatusText(message)}
                        </span>
                      </div>
                      {!message.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(message._id);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-1">
                        {message.category}
                      </span>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{message.userId?.email}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail & Reply */}
      <div className="lg:w-1/2 flex flex-col">
        {selectedMessage ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {selectedMessage.userId?.fullName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedMessage.userId?.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage)}`}>
                  {getStatusText(selectedMessage)}
                </span>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* User Message */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Message</span>
                    <span className="text-xs text-gray-500">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedMessage.category}
                    </span>
                  </div>
                  <p className="text-gray-800">{selectedMessage.message}</p>
                </div>

                {/* Admin Reply */}
                {selectedMessage.adminReply && (
                  <div className={`rounded-lg p-4 ${selectedMessage.isAutoReply ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedMessage.isAutoReply ? 'Auto Reply' : 'Admin Reply'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(selectedMessage.adminRepliedAt)}
                      </span>
                    </div>
                    <p className="text-gray-800">{selectedMessage.adminReply}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <textarea
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
              
              {/* Quick Replies */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Thank you for contacting us. We're looking into your issue.",
                    "Your request has been processed successfully.",
                    "Please provide more details about your issue.",
                    "We'll get back to you within 24 hours."
                  ].map((quick, index) => (
                    <button
                      key={index}
                      onClick={() => setReplyText(quick)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a message</h3>
              <p className="text-sm">Choose a message from the list to view details and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;