// src/App.jsx (Definitive Version with Landing Page and Original Navigation)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AboutPage } from './pages/AboutPage';
import LuxuryLandingPage from './pages/LuxuryLandingPage'; 
import { useAuthStore } from './store/auth.store';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    // If logged in, redirect to the main news feed, otherwise show the page
    return !token ? children : <Navigate to="/news" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><LuxuryLandingPage /></PublicOnlyRoute>} />  
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />     
        <Route path="/" 
            element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }
        >
          <Route path="news" element={<HomePage />} />
          <Route path="news/article/:id" element={<ArticlePage />} />
          <Route path="news/user/:username" element={<UserProfilePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        
        {/* --- Catch-all for any routes that don't match --- */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1>404: Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;