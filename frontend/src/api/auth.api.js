import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Primary API instance for all auth routes
const authApi = axios.create({ 
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to get auth headers
const getAuthHeaders = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return {};
    
    const parsedStorage = JSON.parse(authStorage);
    const token = parsedStorage?.state?.token;
    
    return token ? { 
      Authorization: `Bearer ${token}`
    } : {};
  } catch (error) {
    console.error("Error parsing auth storage:", error);
    return {};
  }
};

// Request interceptor for auth headers
authApi.interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      ...config.headers,
      ...getAuthHeaders()
    }
  };
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
authApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response.data);
      // Optionally clear auth state or trigger logout
    }
    return Promise.reject(error);
  }
);

/**
 * Standardizes error handling for API calls
 */
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      'An error occurred';
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

// Authentication API functions
export const registerUser = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyToken = async () => {
  try {
    const response = await authApi.get('/verify');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await authApi.post('/logout');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Password Reset API functions
export const forgotPassword = async ({ email }) => {
  try {
    const response = await authApi.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const validateResetToken = async (token) => {
  try {
    const response = await authApi.get(`/validate-reset-token/${token}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await authApi.post(`/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
// // src/api/auth.api.js
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const api = axios.create({ 
//   baseURL: `${API_URL}/auth`,
//   withCredentials: true // Enable cookies for sessions if needed
// });

// // Helper function to get auth headers with proper error handling
// const getAuthHeaders = () => {
//   try {
//     const authStorage = localStorage.getItem('auth-storage');
//     if (!authStorage) return {};
    
//     const parsedStorage = JSON.parse(authStorage);
//     const token = parsedStorage?.state?.token;
    
//     return token ? { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     } : {};
//   } catch (error) {
//     console.error("Error parsing auth storage:", error);
//     return {};
//   }
// };

// // Add request interceptor for auth headers
// api.interceptors.request.use(config => {
//   const headers = getAuthHeaders();
//   config.headers = {
//     ...config.headers,
//     ...headers
//   };
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized (token expired, invalid, etc.)
//       console.error("Authentication error:", error.response.data);
//       // Optionally: clear local storage or trigger logout
//     }
//     return Promise.reject(error);
//   }
// );

// export const registerUser = async (userData) => {
//   try {
//     console.log("Registering user with data:", userData);
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error || 
//                         'Registration failed. Please try again.';
//     console.error("Registration error:", errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// export const loginUser = async (credentials) => {
//   try {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error || 
//                         'Login failed. Please check your credentials.';
//     console.error("Login error:", errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// // Add more auth-related API calls as needed
// export const verifyToken = async () => {
//   try {
//     const response = await api.get('/auth/verify');
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Token verification failed');
//   }
// };

// export const logoutUser = async () => {
//   try {
//     const response = await api.post('/auth/logout');
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Logout failed');
//   }
// };

// /**
//  * Sends a request to the backend to initiate the password reset process.
//  * @param {{ email: string }} payload - The user's email.
//  * @returns {Promise<object>} The success message from the server.
//  */
// export const forgotPassword = async ({ email }) => {
//     try {
//         // FIX: Changed authApi to api
//         const response = await api.post('/forgot-password', { email });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Failed to send reset link.');
//     }
// };

// /**
//  * Asks the backend to validate a password reset token from the URL.
//  */
// export const validateResetToken = async (token) => {
//     try {
//         // FIX: Changed authApi to api
//         const response = await api.get(`/reset-password/${token}`);
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Invalid or expired token.');
//     }
// };

// /**
//  * Sends the new password to the backend to finalize the reset.
//  */
// export const resetPassword = async ({ token, password }) => {
//     try {
//         // FIX: Changed authApi to api
//         const response = await api.put(`/reset-password/${token}`, { password });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Failed to update password.');
//     }
// };
