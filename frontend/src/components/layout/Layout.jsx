import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <main>
        <Outlet /> {/* This is where the page content will be rendered */}
      </main>
    </div>
  );
};