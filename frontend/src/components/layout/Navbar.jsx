export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Mobile menu button - only shows on small screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-2">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
              <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/news" className={({ isActive }) => `flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}>
              News
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}>
              About
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <WeatherWidget />
          </div>
          <ThemeToggle />
          
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none rounded-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <UserAvatar user={user} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover/80 backdrop-blur-md border-border/20" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Hi, {user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem onSelect={() => navigate('/news')} className="cursor-pointer">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate(`/news/user/${user.username}`)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:text-white focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-4 rounded-md text-sm">
                Login
              </Link>
              <Link to="/register" className="relative inline-flex items-center justify-center rounded-md px-5 py-2.5 overflow-hidden font-medium text-sm text-indigo-50 group bg-gradient-to-br from-purple-600 to-indigo-500 hover:text-white">
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative">Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu - appears as overlay on small screens */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed md:hidden inset-0 z-40 w-4/5 max-w-sm bg-background/95 backdrop-blur-lg border-r border-border/80 shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">
                      <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
                      <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1">
                  <NavLink
                    to="/news"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 text-base font-semibold transition-colors px-4 py-3 rounded-lg ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}
                  >
                    <Rss className="w-5 h-5" />
                    <span>News</span>
                  </NavLink>
                  <NavLink
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 text-base font-semibold transition-colors px-4 py-3 rounded-lg ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}
                  >
                    <Zap className="w-5 h-5" />
                    <span>About</span>
                  </NavLink>

                  {/* Mobile Weather Widget - only shows in mobile menu */}
                  <div className="mt-4 px-4 py-3">
                    <WeatherWidget />
                  </div>
                </nav>

                {!isLoggedIn && (
                  <div className="mt-auto pt-4 border-t border-border/20">
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 px-4 rounded-md font-medium text-sm bg-accent text-foreground hover:bg-accent/80 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 px-4 rounded-md font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </div>
    </header>
  );
};