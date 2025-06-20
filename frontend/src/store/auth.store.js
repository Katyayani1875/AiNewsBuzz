// src/store/auth.store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  // The 'persist' middleware automatically saves the store's state to localStorage.
  // This means the user will stay logged in even after refreshing the page.
  persist(
    (set) => ({
      token: null,
      user: null, // Will hold user info like { username, id, profilePicture }
      isLoggedIn: false,
      
      // Action to perform on successful login/registration
      login: (token, user) => {
        // We also store the token in localStorage directly for easy access in API headers
        localStorage.setItem('token', token);
        set({ token, user, isLoggedIn: true });
      },

      // Action to perform on logout
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: 'auth-storage', // The key used in localStorage
    }
  )
);