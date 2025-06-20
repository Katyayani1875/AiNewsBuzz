// src/components/layout/Layout.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store'; // Import notification store
import io from 'socket.io-client';

// npm install react-hot-toast
import { Toaster, toast } from 'react-hot-toast';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export const Layout = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore(); // Get the action from the store

  useEffect(() => {
    if (user && user.id) {
      socket.emit('join_user_room', user.id);
    }

    const handleNotification = (notification) => {
      console.log("Real-time notification received!", notification);
      // Add the new notification to our global state
      addNotification(notification);
      // Show a toast notification
      toast.success(`${notification.sender.username} replied to your comment!`, {
        style: {
          background: '#161B22',
          color: '#E6EDF3',
          border: '1px solid #444c56'
        }
      });
    };

    socket.on('new_notification', handleNotification);

    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [user, addNotification]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Toaster component for displaying pop-up notifications */}
      <Toaster position="top-right" />
      <Navbar />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};