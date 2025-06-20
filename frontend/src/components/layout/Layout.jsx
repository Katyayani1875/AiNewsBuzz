// src/components/layout/Layout.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/auth.store';
import io from 'socket.io-client';

// We initialize the socket connection here, once.
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export const Layout = () => {
  const { user } = useAuthStore();

  // This useEffect hook manages the user's connection to their personal notification room
  useEffect(() => {
    // If a user is logged in, they should join their own room to receive notifications
    if (user && user.id) {
      socket.emit('join_user_room', user.id);
      console.log(`User ${user.username} joined socket room: ${user.id}`);
    }

    // Define the event handler for incoming notifications
    const handleNotification = (notification) => {
      console.log("Real-time notification received on frontend!", notification);
      
      // Here you would:
      // 1. Update a global notification count in a Zustand store.
      // 2. Show a toast notification using a library like react-hot-toast.
      // Example: toast.success(`${notification.sender.username} replied to your comment!`);
    };

    socket.on('new_notification', handleNotification);

    // This is the cleanup function that runs when the component unmounts or the user logs out
    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [user]); // This effect re-runs whenever the `user` object changes (login/logout)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};