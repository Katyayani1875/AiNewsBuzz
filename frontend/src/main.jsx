// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your main stylesheet from Tailwind setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuthStore } from './store/auth.store.js';
// import { toast } from 'react-hot-toast';
const queryClient = new QueryClient();

// window.handleGoogleCredentialResponse = async (response) => {
//   const idToken = response.credential;
//   console.log("Encoded ID Token (from Google):", idToken);
//   const loginAction = useAuthStore.getState().login;

//   try {
//     // Determine the backend URL. `import.meta.env.VITE_API_URL` is set via Vite's environment config.
//     // For local dev, this would be http://localhost:5000/api.
//     // For deployed, this would be https://ainewsbuzz-1.onrender.com/api.
//     const backendBaseUrl = import.meta.env.VITE_API_URL;
//     const googleAuthEndpoint = `${backendBaseUrl}/auth/google`; // The new endpoint you created in your backend

//     console.log("Sending ID Token to backend:", googleAuthEndpoint);

//     const backendResponse = await fetch(googleAuthEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ token: idToken }),
//     });

//     if (!backendResponse.ok) {
//       const errorData = await backendResponse.json();
//       console.error('Backend Google Auth failed:', errorData);
//       toast.error(errorData.message || 'Google Sign-In failed on our server. Please try again.');
//       return;
//     }
//     const data = await backendResponse.json();
//     console.log('Backend Google Auth successful:', data);
//     loginAction(data.token, data.user);
//     toast.success('Successfully signed in with Google!');
//     window.location.href = '/news'; 
//   } catch (error) {
//     console.error('Error during Google Sign-In process:', error);
//     toast.error('An unexpected error occurred during Google Sign-In. Please check console.');
//   }
// };
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);