// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';

const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="url(#paint0_linear_footer)" />
      <path d="M14 18L20 12L26 18L20 24L14 18Z" fill="url(#paint1_linear_footer)" />
      <defs>
        <linearGradient id="paint0_linear_footer" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#22D3EE"/><stop offset="1" stopColor="#0EA5E9"/></linearGradient>
        <linearGradient id="paint1_linear_footer" x1="20" y1="12" x2="20" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#A78BFA"/><stop offset="1" stopColor="#818CF8"/></linearGradient>
      </defs>
    </svg>
  );

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-bold text-foreground">AI NewsBuzz</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI NewsBuzz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};