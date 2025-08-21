import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, Send, X, ArrowLeft, CreditCard, Banknote, FileCheck, Gamepad2, HelpCircle, Paperclip } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Deposit Related');
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { BACKEND_URL } = useContext(AppContext);
  const messagesEndRef = useRef(null);

  const categories = [
    { id: 'Deposit Related', label: 'Deposit Related', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'Withdraw', label: 'Withdraw', icon: <Banknote className="w-4 h-4" /> },
    { id: 'KYC', label: 'KYC', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'Game Related', label: 'Game Related', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'Other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File size must be less than 5MB. Your file is ${formatFileSize(file.size)}.`);
        event.target.value = '';
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not allowed. Please upload images, PDFs, or documents.');
        event.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  // Upload file
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('chatFile', file);

    const response = await fetch(`${BACKEND_URL}/api/upload/chat`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'File upload failed');
    }

    return result;
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/my-messages`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const sortedMessages = data.messages.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message with optional file
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    
    setIsLoading(true);
    setIsUploading(true);
    
    try {
      let fileData = null;
      
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: newMessage || '',
          category: activeCategory,
          attachment: fileData?.file_url || null,
          attachmentType: fileData?.file_type || null
        })
      });

      if (response.ok) {
        setNewMessage('');
        setSelectedFile(null);
        setShowCategorySelect(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await fetchMessages();
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        toast.success('Message sent successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  // Polling for new messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 max-w-[440px] mx-auto relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-3 backdrop-blur-sm border-b border-cyan-600/50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-cyan-600/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-200" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-2 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Support Chat</h1>
                <p className="text-sm text-cyan-200">We're here to help you</p>
              </div>
            </div>
          </div>
          
          {/* Category Button */}
          <button
            onClick={() => setShowCategorySelect(!showCategorySelect)}
            className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 px-3 py-2 rounded-lg text-xs transition-colors"
          >
            {activeCategory}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-xl shadow-lg border border-cyan-200/50 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          
          {/* Messages */}
          <div className="p-4 overflow-y-auto bg-white/70" style={{ height: selectedFile ? 'calc(100vh - 280px)' : showCategorySelect ? 'calc(100vh - 300px)' : 'calc(100vh - 200px)' }}>
            {messages.length === 0 ? (
              <div className="text-center text-teal-600 mt-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-teal-400" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start a conversation with our support team!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length > 0 && (
                  <div className="text-center">
                    <div className="inline-block bg-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Category: {messages[0].category}
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div key={message._id} className="space-y-3">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white p-4 rounded-lg max-w-lg shadow-lg">
                        {message.message && <p className="text-sm leading-relaxed">{message.message}</p>}
                        {message.attachment && (
                          <div className="mt-3">
                            {message.attachmentType === 'image' ? (
                              <img 
                                src={`${BACKEND_URL}${message.attachment}`}
                                alt="Attachment"
                                className="max-w-full h-auto rounded cursor-pointer border border-cyan-200"
                                onClick={() => window.open(`${BACKEND_URL}${message.attachment}`, '_blank')}
                                style={{ maxHeight: '200px' }}
                              />
                            ) : (
                              <a 
                                href={`${BACKEND_URL}${message.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-cyan-100 hover:text-white underline"
                              >
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm">View Attachment</span>
                              </a>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-cyan-100 mt-2">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Admin reply */}
                    {message.adminReply && !message.isAutoReply && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-teal-200 text-teal-800 p-4 rounded-lg max-w-lg shadow-lg">
                          <div className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded mb-2">
                            Support Team
                          </div>
                          <p className="text-sm leading-relaxed">{message.adminReply}</p>
                          <p className="text-xs text-teal-500 mt-2">
                            {formatDate(message.adminRepliedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Auto reply */}
                    {message.isAutoReply && !message.hasRealReply && (
                      <div className="flex justify-start">
                        <div className="bg-cyan-50 border border-cyan-200 text-teal-800 p-4 rounded-lg max-w-lg shadow-lg">
                          <div className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded mb-2">
                            Auto Reply
                          </div>
                          <p className="text-sm leading-relaxed">{message.adminReply}</p>
                          <p className="text-xs text-teal-500 mt-2">
                            {formatDate(message.adminRepliedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Category selector */}
          {showCategorySelect && (
            <div className="p-4 border-t bg-white/70 border-teal-200">
              <div className="text-sm font-medium text-teal-700 mb-3">Select Category:</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setShowCategorySelect(false);
                    }}
                    className={`flex items-center space-x-2 p-3 rounded text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-teal-100 text-teal-700 border border-teal-300'
                        : 'bg-white hover:bg-teal-50 border border-teal-200'
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveCategory('Other');
                  setShowCategorySelect(false);
                }}
                className={`w-full mt-2 flex items-center justify-center space-x-2 p-3 rounded text-sm transition-colors ${
                  activeCategory === 'Other'
                    ? 'bg-teal-100 text-teal-700 border border-teal-300'
                    : 'bg-white hover:bg-teal-50 border border-teal-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Other</span>
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-white/70 border-teal-200">
            {/* File preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-teal-50 rounded-lg flex items-center justify-between border border-teal-200">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Paperclip className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-teal-700 truncate block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-teal-500">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-red-500 hover:text-red-700 flex-shrink-0 ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex space-x-3 items-end">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                title="Attach file (Max 5MB: Images, PDFs, Documents)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !selectedFile) || isLoading || isUploading}
                className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px] transition-all shadow-lg"
              >
                {(isLoading || isUploading) ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;