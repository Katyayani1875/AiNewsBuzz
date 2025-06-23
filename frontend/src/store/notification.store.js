// // src/store/notification.store.js
// import { create } from 'zustand';

// export const useNotificationStore = create((set) => ({
//   notifications: [],
//   unreadCount: 0,
//   setNotifications: (notifications) => {
//     const unread = notifications.filter(n => !n.isRead).length;
//     set({ notifications, unreadCount: unread });
//   },
//   addNotification: (notification) => {
//     set((state) => ({
//       notifications: [notification, ...state.notifications],
//       unreadCount: state.unreadCount + 1,
//     }));
//   },
//   markAllAsRead: () => {
//     set((state) => ({
//       notifications: state.notifications.map(n => ({ ...n, isRead: true })),
//       unreadCount: 0,
//     }));
//   },
// }));
import { create } from 'zustand';
import { fetchNotifications } from '../api/notification.api';

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
        unreadCount: notifications.filter((n) => !n.isRead).length,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearOldNotifications: () => {
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => Date.now() - new Date(n.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000 // Retain last 7 days
      ),
    }));
  },
}));