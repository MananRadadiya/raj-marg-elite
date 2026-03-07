import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollPosition from '../hooks/useScrollPosition';

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem('rajmarg_theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScrollPosition(60);
  const dropdownRef = useRef(null);

  const isHome = location.pathname === '/';
  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('rajmarg_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/booking', label: 'Book Ride' },
    { to: '/driver-portal', label: 'Drivers' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ...(isAuthenticated ? [{ to: '/live-tracking', label: 'Track Ride' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const isScrolledOrNotHome = scrolled || !isHome;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolledOrNotHome
          ? 'bg-white/80 dark:bg-charcoal/80 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-14' : 'h-18'
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-saffron to-gold flex items-center justify-center">
                <span className="text-charcoal font-display font-bold text-sm">RM</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-linear-to-br from-saffron to-gold opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold tracking-wider text-saffron dark:text-gold">
                RAJ
              </span>
              <span className={`font-display text-xl font-light tracking-wider transition-colors duration-300 ${
                isScrolledOrNotHome ? 'text-charcoal dark:text-white' : 'text-white'
              }`}>
                MARG
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 no-underline group"
              >
                <motion.span
                  whileHover={{ y: -1 }}
                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 ${
                    location.pathname === link.to
                      ? 'text-saffron dark:text-gold'
                      : isScrolledOrNotHome
                      ? 'text-charcoal/60 dark:text-slate-text group-hover:text-saffron dark:group-hover:text-gold'
                      : 'text-white/70 group-hover:text-white'
                  }`}
                >
                  {link.label}
                </motion.span>
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-saffron to-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Booking Badge */}
            {isAuthenticated && pendingCount > 0 && (
              <Link to="/dashboard" className="relative no-underline mr-1">
                <span className="text-lg">🎫</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {pendingCount}
                </motion.span>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setDark(!dark)}
              className={`relative w-9 h-9 rounded-xl border cursor-pointer flex items-center justify-center transition-all duration-300 ${
                isScrolledOrNotHome
                  ? 'bg-cream-dark/80 dark:bg-charcoal-mid/80 border-charcoal/5 dark:border-white/10 text-charcoal dark:text-gold'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={dark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm"
                >
                  {dark ? '☀️' : '🌙'}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Auth Buttons / User Dropdown */}
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border cursor-pointer transition-all duration-300 ${
                    isScrolledOrNotHome
                      ? 'bg-cream-dark/80 dark:bg-charcoal-mid/80 border-charcoal/5 dark:border-white/10 text-charcoal dark:text-white'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-linear-to-br from-saffron/20 to-gold/20 flex items-center justify-center text-xs font-bold text-saffron dark:text-gold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden lg:inline text-[13px]">{user.name}</span>
                  <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/90 dark:bg-charcoal-light/90 backdrop-blur-2xl shadow-2xl border border-charcoal/10 dark:border-white/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-charcoal/5 dark:border-white/5">
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">{user.email}</div>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl hover:bg-saffron/5 dark:hover:bg-gold/5 text-charcoal dark:text-white no-underline transition-colors"
                        >
                          <span className="text-base">📊</span> Dashboard
                        </Link>
                        <Link
                          to="/booking"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl hover:bg-saffron/5 dark:hover:bg-gold/5 text-charcoal dark:text-white no-underline transition-colors"
                        >
                          <span className="text-base">🚕</span> New Booking
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl hover:bg-saffron/5 dark:hover:bg-gold/5 text-charcoal dark:text-white no-underline transition-colors"
                          >
                            <span className="text-base">⚙️</span> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="p-1.5 border-t border-charcoal/5 dark:border-white/5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent border-none cursor-pointer transition-colors"
                        >
                          <span className="text-base">🚪</span> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium no-underline border transition-all duration-300 ${
                    isScrolledOrNotHome
                      ? 'border-charcoal/10 dark:border-white/10 text-charcoal dark:text-white hover:border-saffron/30 dark:hover:border-gold/30'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold no-underline btn-royal hover:opacity-90 transition-opacity duration-300"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`lg:hidden p-2 border-none bg-transparent cursor-pointer transition-colors ${
                isScrolledOrNotHome ? 'text-charcoal dark:text-white' : 'text-white'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-white/95 dark:bg-charcoal/95 backdrop-blur-2xl border-t border-charcoal/5 dark:border-white/5"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors no-underline ${
                    location.pathname === link.to
                      ? 'text-saffron dark:text-gold bg-saffron/5 dark:bg-gold/5'
                      : 'text-charcoal/70 dark:text-slate-text hover:bg-cream-dark dark:hover:bg-charcoal-mid'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-charcoal/5 dark:border-white/5 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout ({user.name})
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-charcoal/10 dark:border-white/10 text-charcoal dark:text-white no-underline"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold btn-royal no-underline"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
