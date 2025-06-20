export const Navbar = () => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">AI NewsBuzz</h1>
        <div>
          <button className="text-white hover:text-cyan-400 transition-colors">Login</button>
        </div>
      </div>
    </nav>
  );
};