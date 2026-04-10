import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import ScrollToTop from './components/ScrollToTop';
import SOSButton from './components/SOSButton';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import LiveTracking from './pages/LiveTracking';
import DriverPortal from './pages/DriverPortal';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import TourPackages from './pages/TourPackages';
import DriverLeaderboard from './pages/DriverLeaderboard';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ToastNotification />
      <div className={`flex-1 ${isHome ? '' : 'pt-20'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/live-tracking" element={<LiveTracking />} />
              <Route path="/driver-portal" element={<DriverPortal />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tour-packages" element={<TourPackages />} />
              <Route path="/drivers" element={<DriverLeaderboard />} />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <ScrollToTop />
      <SOSButton />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-7xl mb-4">🚧</div>
        <h1 className="font-display text-4xl font-bold mb-2 text-charcoal dark:text-white">
          404 — Page Not Found
        </h1>
        <p className="text-charcoal/60 dark:text-slate-text mb-6">
          Looks like you took a wrong turn. Let&apos;s get you back on track.
        </p>
        <a href="/" className="inline-flex px-6 py-3 rounded-xl text-sm font-semibold premium-gradient text-charcoal no-underline hover:opacity-90 transition-opacity">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
