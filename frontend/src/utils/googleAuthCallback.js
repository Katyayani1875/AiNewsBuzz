// frontend/src/utils/googleAuthCallback.js
import { useAuthStore } from '../store/auth.store.js';
import { toast } from 'react-hot-toast';
const BACKEND_API_BASE_URL = import.meta.env.VITE_API_URL;

export async function handleGoogleCredentialResponse(response) {
  if (!response?.credential) {
    console.error('Invalid Google response:', response);
    toast.error('Invalid response from Google. Please try again.');
    return;
  }

  const idToken = response.credential;
  console.log("Encoded ID Token (from Google):", idToken);

  try {
    const loginAction = useAuthStore.getState().login;
    const googleAuthEndpoint = `${BACKEND_API_BASE_URL}/auth/google`;

    const backendResponse = await fetch(googleAuthEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ token: idToken }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error('Backend Google Auth failed:', errorData);
      toast.error(errorData.message || 'Google Sign-In failed on our server. Please try again.');
      return;
    }

    const data = await backendResponse.json();
    console.log('Backend Google Auth successful:', data);

    loginAction(data.token, data.user);
    toast.success('Successfully signed in with Google!');
    
    window.location.href = '/news'; 

  } catch (error) {
    console.error('Error during Google Sign-In process:', error);
    toast.error('An unexpected error occurred during Google Sign-In. Please try again.');
  }
}
// // frontend/src/utils/googleAuthCallback.js

// import { useAuthStore } from '../store/auth.store.js';
// import { toast } from 'react-hot-toast';
// const BACKEND_API_BASE_URL = import.meta.env.VITE_API_URL;

// export async function handleGoogleCredentialResponse(response) {
//   const idToken = response.credential;
//   console.log("Encoded ID Token (from Google):", idToken);

//   try {
//     const loginAction = useAuthStore.getState().login;
//     const googleAuthEndpoint = `${BACKEND_API_BASE_URL}/auth/google`;

//     console.log("Sending ID Token to backend:", googleAuthEndpoint);

//     const backendResponse = await fetch(googleAuthEndpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
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
// }