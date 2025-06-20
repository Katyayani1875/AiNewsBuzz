import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-cyan-400">
          AI NewsBuzz
        </Link>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user.username}!</span>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
