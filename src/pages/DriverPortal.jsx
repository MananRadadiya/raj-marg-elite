import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { driverLogin, driverLogout, acceptRide, rejectRide, updateRideStatus } from '../redux/driverSlice';
import { updateBookingStatus } from '../redux/bookingSlice';
import { addToast } from '../redux/notificationSlice';

const RIDE_STATUS_OPTIONS = ['on-the-way', 'arrived', 'completed'];
const STATUS_CONFIG = {
  confirmed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '✅', label: 'Confirmed' },
  accepted: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '👍', label: 'Accepted' },
  rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '❌', label: 'Rejected' },
  'on-the-way': { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '🚗', label: 'On The Way' },
  arrived: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '📍', label: 'Arrived' },
  completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🏁', label: 'Completed' },
};

export default function DriverPortal() {
  const dispatch = useDispatch();
  const { currentDriver, isDriverAuthenticated, assignedBookings } = useSelector((s) => s.driver);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    dispatch(driverLogin({ email, password }));
    const stored = JSON.parse(localStorage.getItem('rajmarg_driver') || 'null');
    if (!stored) {
      setError('Invalid driver credentials');
    }
  };

  const handleLogout = () => {
    dispatch(driverLogout());
  };

  const handleAccept = (bookingId) => {
    dispatch(acceptRide(bookingId));
    dispatch(addToast({ message: 'Ride accepted!', type: 'success' }));
  };

  const handleReject = (bookingId) => {
    dispatch(rejectRide(bookingId));
    dispatch(addToast({ message: 'Ride rejected', type: 'warning' }));
  };

  const handleStatusUpdate = (bookingId, newStatus) => {
    dispatch(updateRideStatus({ bookingId, status: newStatus }));
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
    const label = STATUS_CONFIG[newStatus]?.label || newStatus;
    dispatch(addToast({ message: `Status updated: ${label}`, type: 'driver' }));
  };

  /* Login Screen */
  if (!isDriverAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 md:p-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <span className="text-4xl mb-3 block">🚗</span>
            <h1 className="font-display text-2xl font-bold mb-1">Driver Portal</h1>
            <p className="text-sm text-charcoal/60 dark:text-slate-text">
              Sign in with your driver account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="driver@rajmarg.com"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 text-center">
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-xl premium-gradient text-white font-semibold text-sm border-none cursor-pointer"
            >
              Sign In as Driver
            </motion.button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-saffron/5 dark:bg-gold/5 border border-saffron/20 dark:border-gold/20">
            <p className="text-xs font-semibold text-charcoal/70 dark:text-slate-text mb-2 uppercase tracking-wider">
              Demo Driver Account
            </p>
            <div className="space-y-1.5 text-xs text-charcoal/60 dark:text-slate-text">
              <div><span className="font-medium">Email:</span> driver@rajmarg.com</div>
              <div><span className="font-medium">Password:</span> 123456</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* Driver Dashboard */
  const driverBookings = assignedBookings.filter(
    (b) => b.driverId === currentDriver.id
  );
  const activeRides = driverBookings.filter(
    (b) => !['completed', 'rejected'].includes(b.status)
  );
  const completedRides = driverBookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <img
              src={currentDriver.photo}
              alt={currentDriver.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-saffron/30 dark:border-gold/30"
            />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Welcome, <span className="text-saffron dark:text-gold">{currentDriver.name}</span>
              </h1>
              <p className="text-sm text-charcoal/60 dark:text-slate-text">
                {currentDriver.vehicle} · {currentDriver.tier} tier · ⭐ {currentDriver.rating}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold border-none cursor-pointer hover:bg-red-500/20 transition"
          >
            🚪 Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <DriverStat icon="📋" label="Total Rides" value={driverBookings.length} delay={0} />
          <DriverStat icon="🚗" label="Active" value={activeRides.length} delay={0.05} />
          <DriverStat icon="🏁" label="Completed" value={completedRides.length} delay={0.1} />
          <DriverStat icon="⭐" label="Rating" value={currentDriver.rating} delay={0.15} highlight />
        </div>

        {/* Active Rides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden mb-8"
        >
          <div className="p-5 border-b border-charcoal/10 dark:border-white/10">
            <h2 className="font-display text-xl font-semibold">🚗 Active Rides</h2>
          </div>
          {activeRides.length === 0 ? (
            <div className="p-12 text-center text-charcoal/40 dark:text-slate-text">
              <div className="text-4xl mb-3">🛣️</div>
              <p>No active rides. Waiting for assignments...</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal/5 dark:divide-white/5">
              {activeRides.map((ride) => {
                const cfg = STATUS_CONFIG[ride.status] || STATUS_CONFIG.confirmed;
                return (
                  <motion.div
                    key={ride.bookingId}
                    layout
                    className="p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                          <span className="text-xs text-charcoal/40 dark:text-slate-text/60 font-mono">
                            {ride.bookingId?.slice(0, 16)}
                          </span>
                        </div>
                        <p className="font-semibold">{ride.from} → {ride.to}</p>
                        <p className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                          {ride.carType} · {ride.distance} km · {ride.tripType}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {ride.status === 'confirmed' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleAccept(ride.bookingId)}
                              className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold border-none cursor-pointer"
                            >
                              ✅ Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleReject(ride.bookingId)}
                              className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold border-none cursor-pointer"
                            >
                              ❌ Reject
                            </motion.button>
                          </>
                        )}
                        {(ride.status === 'accepted' || ride.status === 'on-the-way' || ride.status === 'arrived') && (
                          <div className="flex gap-2">
                            {RIDE_STATUS_OPTIONS.filter((s) => {
                              const order = ['accepted', 'on-the-way', 'arrived', 'completed'];
                              return order.indexOf(s) > order.indexOf(ride.status);
                            }).map((statusOpt) => (
                              <motion.button
                                key={statusOpt}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleStatusUpdate(ride.bookingId, statusOpt)}
                                className="px-3 py-2 rounded-lg premium-gradient text-white text-xs font-semibold border-none cursor-pointer"
                              >
                                {STATUS_CONFIG[statusOpt]?.icon} {STATUS_CONFIG[statusOpt]?.label}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Completed Rides */}
        {completedRides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-charcoal/10 dark:border-white/10">
              <h2 className="font-display text-xl font-semibold">🏁 Completed Rides</h2>
            </div>
            <div className="divide-y divide-charcoal/5 dark:divide-white/5">
              {completedRides.map((ride) => (
                <div key={ride.bookingId} className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{ride.from} → {ride.to}</p>
                    <p className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                      {ride.carType} · {ride.distance} km
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    🏁 Completed
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DriverStat({ icon, label, value, delay = 0, highlight = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card rounded-xl p-5 ${highlight ? 'ring-2 ring-saffron/30 dark:ring-gold/30' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-xs text-charcoal/50 dark:text-slate-text uppercase tracking-wider">{label}</div>
          <div className={`text-xl font-bold mt-0.5 ${highlight ? 'text-saffron dark:text-gold' : ''}`}>{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
