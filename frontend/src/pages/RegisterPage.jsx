// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // On successful registration, automatically log the user in
      login(data.token, { username: data.username, id: data._id });
      // Redirect to the homepage
      navigate('/');
    },
    // You can add an onError handler here to display specific error messages
    onError: (error) => {
        // This assumes your backend sends a message property in the error response
        console.error("Registration failed:", error.response.data.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-400 block mb-2">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Choose a unique username" 
            required 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" 
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-400 block mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@gmail.com" 
            required 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" 
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-400 block mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Create a strong password" 
            required 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" 
          />
        </div>
        <button 
          type="submit" 
          disabled={mutation.isPending} 
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </button>
        {mutation.isError && (
            // Access the error message from the backend response if available
            <p className="text-red-400 text-center">{mutation.error.response?.data?.message || 'An unexpected error occurred.'}</p>
        )}
      </form>
      <p className="text-center text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};