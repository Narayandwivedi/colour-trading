import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageCircle, Bell } from 'lucide-react';

const ChatNotification = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/messages?isRead=false&limit=1`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Check for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
        {unreadCount > 99 ? '99+' : unreadCount}
      </div>
      <Bell className="w-4 h-4" />
    </div>
  );
};

export default ChatNotification;