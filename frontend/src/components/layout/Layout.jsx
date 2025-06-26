// src/components/layout/Layout.jsx (Updated)
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store';
import { Footer } from './Footer';
import io from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true // This is important for authenticated connections
});
export const Layout = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      socket.emit('join_user_room', user.id);
    }
    const handleNotification = (notification) => {
      addNotification(notification);
      toast.success(`${notification.sender.username} replied to your comment!`, {
        style: {
          background: 'hsl(var(--popover))',
          color: 'hsl(var(--popover-foreground))',
          border: '1px solid hsl(var(--border))'
        }
      });
    };
    socket.on('new_notification', handleNotification);
    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [user, addNotification]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Toaster position="top-right" />
      <Navbar />
      <main className="pt-4 sm:pt-6">
        <Outlet />
      </main>
       <Footer /> 
    </div>
  );
};