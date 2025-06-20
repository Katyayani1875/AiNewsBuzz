// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      loginAction(data.token, { username: data.username, id: data._id, profilePicture: data.profilePicture });
      navigate('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="container mx-auto max-w-md p-8 text-white">
      <div className="bg-[#161B22] border border-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-6">Log in to continue to AI NewsBuzz.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" />
          </div>

          <button type="submit" disabled={mutation.isPending} className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
            {mutation.isPending ? 'Logging In...' : 'Login'}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-center text-sm">{mutation.error.message}</p>
          )}
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};