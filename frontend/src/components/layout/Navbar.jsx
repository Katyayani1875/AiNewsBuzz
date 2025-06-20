// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirect to homepage after logout
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          AINewsBuzz
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
              {/* This will be the user profile dropdown in a later step */}
              <div className="flex items-center gap-2 cursor-pointer">
                <img src={user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} alt={user.username} className="w-8 h-8 rounded-full object-cover border-2 border-gray-700" />
                <span className="text-white font-semibold">{user.username}</span>
              </div>
              <button onClick={handleLogout} className="bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-bold hover:bg-gray-600 transition-colors">
                Logout
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors py-2 px-4">
                Login
              </Link>
              <Link to="/register" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors">
                Sign Up
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};