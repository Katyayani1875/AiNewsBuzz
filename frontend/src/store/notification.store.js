import { create } from 'zustand';
import { fetchNotifications, markNotificationsAsRead as markAsReadApi } from '../api/notification.api';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  fetchAndSetNotifications: async () => {
    try {
      const notifications = await fetchNotifications();
      set((state) => ({
        notifications: [...notifications, ...state.notifications],
        unreadCount: notifications.filter((n) => !n.isRead).length + state.unreadCount,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },

  markAllAsRead: async () => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    
    // API call in background
    try {
      await markAsReadApi();
    } catch (error) {
      console.error('Failed to mark notifications as read on server:', error);
      // Optionally revert state or show error message
    }
  },

  clearOldNotifications: () => {
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => Date.now() - new Date(n.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000 // Retain last 7 days
      ),
      // Recalculate unread count after clearing old notifications
      unreadCount: state.notifications.filter(
        (n) => Date.now() - new Date(n.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000 && !n.isRead
      ).length,
    }));
  },
}));