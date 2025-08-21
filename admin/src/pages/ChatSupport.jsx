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
  Phone,
  Paperclip,
  Download
} from 'lucide-react';

const ChatSupport = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    isRead: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    categories: {}
  });
  const replyInputRef = useRef(null);

  const categories = ['Deposit Related', 'Withdraw', 'KYC', 'Game Related', 'Other'];

  // Group messages by user and calculate stats
  const groupMessagesByUser = (messages) => {
    const userGroups = {};
    
    messages.forEach(message => {
      const userId = message.userId?._id;
      if (!userId) return;
      
      if (!userGroups[userId]) {
        userGroups[userId] = {
          user: message.userId,
          messages: [],
          unreadCount: 0,
          lastMessageAt: message.createdAt,
          hasUnreplied: false
        };
      }
      
      userGroups[userId].messages.push(message);
      
      // Count unread messages for this user
      if (!message.isRead) {
        userGroups[userId].unreadCount++;
      }
      
      // Check if user has unreplied messages
      if (!message.adminReply || message.isAutoReply) {
        userGroups[userId].hasUnreplied = true;
      }
      
      // Update last message time
      if (new Date(message.createdAt) > new Date(userGroups[userId].lastMessageAt)) {
        userGroups[userId].lastMessageAt = message.createdAt;
      }
    });
    
    // Convert to array and sort by last message time
    return Object.values(userGroups).sort((a, b) => 
      new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );
  };

  // Fetch messages with filters
  const fetchMessages = async (silentRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (loading || isRefreshing) return;
    
    try {
      if (!silentRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
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
            msg.message?.toLowerCase().includes(filters.search.toLowerCase()) ||
            msg.userId?.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            msg.userId?.email?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        const groupedConversations = groupMessagesByUser(filteredMessages);
        
        // Preserve selected conversation if it still exists
        const currentSelectedId = selectedConversation?.user._id;
        if (currentSelectedId) {
          const updatedSelectedConv = groupedConversations.find(conv => conv.user._id === currentSelectedId);
          if (updatedSelectedConv) {
            setSelectedConversation(updatedSelectedConv);
          }
        }
        
        // Only update if data has actually changed to prevent unnecessary re-renders
        setConversations(prev => {
          const hasChanged = JSON.stringify(prev.map(c => ({id: c.user._id, unread: c.unreadCount}))) !== 
                           JSON.stringify(groupedConversations.map(c => ({id: c.user._id, unread: c.unreadCount})));
          return hasChanged ? groupedConversations : prev;
        });
        
        // Calculate stats
        const categoryStats = {};
        data.messages.forEach(msg => {
          categoryStats[msg.category] = (categoryStats[msg.category] || 0) + 1;
        });
        
        const newStats = {
          total: groupedConversations.length,
          unread: data.unreadCount,
          categories: categoryStats
        };
        
        // Only update stats if changed
        setStats(prev => {
          return JSON.stringify(prev) !== JSON.stringify(newStats) ? newStats : prev;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silentRefresh) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  // Mark all messages from user as read
  const markConversationAsRead = async (userId) => {
    try {
      const conversation = conversations.find(conv => conv.user._id === userId);
      if (!conversation || conversation.unreadCount === 0) return;

      const originalUnreadCount = conversation.unreadCount;
      
      // Update UI immediately for better UX
      const updatedConversations = conversations.map(conv => {
        if (conv.user._id === userId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(msg => ({
              ...msg,
              isRead: true
            }))
          };
        }
        return conv;
      });
      setConversations(updatedConversations);

      // Update selected conversation if it's the current one
      if (selectedConversation?.user._id === userId) {
        const updatedSelectedConv = updatedConversations.find(conv => conv.user._id === userId);
        setSelectedConversation(updatedSelectedConv);
      }

      // Update stats immediately
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - originalUnreadCount)
      }));

      // Update backend with single API call
      await fetch(`${BACKEND_URL}/api/chat/mark-user-read/${userId}`, {
        method: 'PATCH',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      // Revert UI changes on error
      fetchMessages(true);
    }
  };

  // Send reply to latest message from user
  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      // Get the latest message from this user
      const latestMessage = selectedConversation.messages
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const response = await fetch(`${BACKEND_URL}/api/chat/reply/${latestMessage._id}`, {
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
        // Use silent refresh to prevent flickering
        await fetchMessages(true);
        
        // Update selected conversation after silent refresh
        setTimeout(() => {
          const updatedConversation = conversations.find(c => c.user._id === selectedConversation.user._id);
          if (updatedConversation) {
            setSelectedConversation(updatedConversation);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Auto-refresh messages every 30 seconds (reduced frequency to minimize flickering)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      // Only refresh if no conversation is selected and not currently loading/refreshing
      if (!selectedConversation && !loading && !isRefreshing) {
        fetchMessages(true); // Use silent refresh for auto-refresh
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  // Focus reply input when conversation is selected and auto-mark as read
  useEffect(() => {
    if (selectedConversation && replyInputRef.current) {
      replyInputRef.current.focus();
      
      // Auto-mark conversation as read when viewing it
      if (selectedConversation.unreadCount > 0) {
        // Mark as read immediately when conversation is selected
        markConversationAsRead(selectedConversation.user._id);
      }
    }
  }, [selectedConversation?.user._id]);

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

  const getLastMessagePreview = (conversation) => {
    const lastMessage = conversation.messages
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    
    if (!lastMessage) return '';
    
    if (lastMessage.message) {
      return lastMessage.message.length > 50 
        ? lastMessage.message.substring(0, 50) + '...'
        : lastMessage.message;
    } else if (lastMessage.attachment) {
      return lastMessage.attachmentType === 'image' ? '📷 Image' : '📎 File';
    }
    
    return '[No content]';
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Stats Cards */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Users</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.unread}</div>
            <div className="text-sm opacity-90">Unread Messages</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">
              {conversations.filter(c => c.messages.some(m => m.hasRealReply)).length}
            </div>
            <div className="text-sm opacity-90">Replied Users</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">
              {conversations.filter(c => c.hasUnreplied).length}
            </div>
            <div className="text-sm opacity-90">Need Reply</div>
          </div>
        </div>
      </div>

      {/* User Conversations List */}
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
              <option value="false">Has Unread</option>
              <option value="true">All Read</option>
            </select>

            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => fetchMessages(false)}
              disabled={loading || isRefreshing}
              className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Conversations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              User Conversations
              {stats.unread > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.unread}
                </span>
              )}
              {isRefreshing && (
                <span className="ml-2 text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin inline" />
                </span>
              )}
            </h3>
          </div>
          
          <div className="overflow-y-auto h-96 lg:h-[calc(100vh-300px)]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.user._id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                    }}
                    className={`p-4 border border-gray-100 rounded-lg mb-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedConversation?.user._id === conversation.user._id ? 'bg-blue-50 border-blue-300' : 
                      conversation.unreadCount > 0 ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <User className="w-8 h-8 text-gray-500 bg-gray-100 rounded-full p-1" />
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-800">
                            {conversation.user.fullName || 'Unknown User'}
                          </span>
                          <p className="text-xs text-gray-500">{conversation.user.email}</p>
                        </div>
                      </div>
                      
                      {conversation.unreadCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markConversationAsRead(conversation.user._id);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Mark all as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getLastMessagePreview(conversation)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(conversation.lastMessageAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Detail & Reply */}
      <div className="lg:w-1/2 flex flex-col">
        {selectedConversation ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {selectedConversation.user.fullName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedConversation.user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedConversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {selectedConversation.unreadCount} unread
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {selectedConversation.messages.length} messages
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {selectedConversation.messages
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((message) => (
                    <div key={message._id} className="space-y-4">
                      {/* User Message */}
                      <div className={`rounded-lg p-4 ${!message.isRead ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Customer Message</span>
                            {!message.isRead && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                        </div>
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {message.category}
                          </span>
                        </div>
                        
                        {message.message ? (
                          <p className="text-gray-800">{message.message}</p>
                        ) : (
                          <p className="text-gray-500 italic">No text message - file attachment only</p>
                        )}
                        
                        {/* Show user attachment */}
                        {message.attachment && (
                          <div className="mt-3">
                            {message.attachmentType === 'image' ? (
                              <div className="space-y-2">
                                <img 
                                  src={`${BACKEND_URL}${message.attachment}`}
                                  alt="User attachment"
                                  className="max-w-full h-auto rounded-lg cursor-pointer border border-gray-300 shadow-sm"
                                  onClick={() => window.open(`${BACKEND_URL}${message.attachment}`, '_blank')}
                                  style={{ maxHeight: '200px', maxWidth: '300px' }}
                                />
                                <p className="text-xs text-gray-500 flex items-center space-x-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>Click to view full size</span>
                                </p>
                              </div>
                            ) : (
                              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                                <a 
                                  href={`${BACKEND_URL}${message.attachment}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm">Download Attachment</span>
                                </a>
                                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>User uploaded file</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Admin Reply */}
                      {message.adminReply && (
                        <div className={`rounded-lg p-4 ${message.isAutoReply ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {message.isAutoReply ? 'Auto Reply' : 'Admin Reply'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.adminRepliedAt)}
                            </span>
                          </div>
                          <p className="text-gray-800">{message.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
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
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a user from the list to view their messages and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;