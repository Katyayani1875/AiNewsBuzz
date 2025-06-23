import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      loginAction(data.token, {
        username: data.username,
        id: data._id,
        profilePicture: data.profilePicture,
      });
      setTimeout(() => navigate('/news'), 1500); // Brief delay to confirm registration success
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const validateInputs = () => {
    if (!username.trim()) return 'Username is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Join the AI NewsBuzz community.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          >
            {mutation.isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="w-full flex items-center justify-center bg-gray-100 text-gray-700 border border-gray-300 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        >
          <img
            src="https://img.icons8.com/color/20/000000/google-logo.png"
            alt="Google"
            className="h-5 w-5 mr-2"
          />
          Sign up with Google
        </button>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
