import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updateBookingStatus } from '../redux/bookingSlice';
import { updateRideStatus } from '../redux/driverSlice';
import { addToast } from '../redux/notificationSlice';
import DriverRating from '../components/DriverRating';

const STATUS_FLOW = ['confirmed', 'on-the-way', 'arrived', 'completed'];
const STATUS_LABELS = {
  confirmed: 'Booking Confirmed',
  'on-the-way': 'Driver On The Way',
  arrived: 'Driver Arrived',
  completed: 'Ride Completed',
};
const STATUS_ICONS = {
  confirmed: '✅',
  'on-the-way': '🚗',
  arrived: '📍',
  completed: '🏁',
};

const CITIES = [
  'Ahmedabad', 'Gandhinagar', 'Vadodara', 'Anand', 'Nadiad',
  'Bharuch', 'Surat', 'Navsari', 'Valsad', 'Mumbai',
];

export default function LiveTracking() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.booking);
  const { assignedBookings } = useSelector((s) => s.driver);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [carPosition, setCarPosition] = useState(0);
  const [currentStatusIdx, setCurrentStatusIdx] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(45);
  const [showRating, setShowRating] = useState(false);
  const intervalRef = useRef(null);
  const etaRef = useRef(null);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const activeBooking = bookings.find(
    (b) => b.status === 'confirmed' || b.status === 'on-the-way' || b.status === 'arrived'
  );
  const latestCompleted = bookings.find((b) => b.status === 'completed');

  const assignment = assignedBookings.find(
    (a) => a.bookingId === (activeBooking?.id || latestCompleted?.id)
  );

  const trackingBooking = activeBooking || latestCompleted;

  useEffect(() => {
    if (!activeBooking) return;

    const statusIdx = STATUS_FLOW.indexOf(activeBooking.status);
    if (statusIdx >= 0) setCurrentStatusIdx(statusIdx);

    /* Auto-progress simulation */
    const timers = [];

    if (activeBooking.status === 'confirmed') {
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'on-the-way' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'on-the-way' }));
          dispatch(addToast({ message: 'Your driver is on the way!', type: 'driver' }));
          setCurrentStatusIdx(1);
        }, 5000)
      );
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'arrived' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'arrived' }));
          dispatch(addToast({ message: 'Your driver has arrived!', type: 'driver' }));
          setCurrentStatusIdx(2);
        }, 10000)
      );
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'completed' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'completed' }));
          dispatch(addToast({ message: 'Ride completed! Rate your driver.', type: 'ride' }));
          setCurrentStatusIdx(3);
          setShowRating(true);
        }, 15000)
      );
    } else if (activeBooking.status === 'on-the-way') {
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'arrived' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'arrived' }));
          dispatch(addToast({ message: 'Your driver has arrived!', type: 'driver' }));
          setCurrentStatusIdx(2);
        }, 5000)
      );
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'completed' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'completed' }));
          dispatch(addToast({ message: 'Ride completed! Rate your driver.', type: 'ride' }));
          setCurrentStatusIdx(3);
          setShowRating(true);
        }, 10000)
      );
    } else if (activeBooking.status === 'arrived') {
      timers.push(
        setTimeout(() => {
          dispatch(updateBookingStatus({ id: activeBooking.id, status: 'completed' }));
          if (assignment) dispatch(updateRideStatus({ bookingId: activeBooking.id, status: 'completed' }));
          dispatch(addToast({ message: 'Ride completed! Rate your driver.', type: 'ride' }));
          setCurrentStatusIdx(3);
          setShowRating(true);
        }, 5000)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [activeBooking?.id, activeBooking?.status]);

  /* Car animation */
  useEffect(() => {
    if (!activeBooking) {
      setCarPosition(100);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCarPosition((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 0.6;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [activeBooking?.id]);

  /* ETA countdown */
  useEffect(() => {
    if (!activeBooking) return;
    setEtaSeconds(45);
    etaRef.current = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(etaRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(etaRef.current);
  }, [activeBooking?.id]);

  const formatEta = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!trackingBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">🛣️</div>
          <h2 className="font-display text-xl font-bold mb-2">No Active Ride</h2>
          <p className="text-charcoal/60 dark:text-slate-text text-sm mb-6">
            Book a ride first to track it live.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/booking')}
            className="px-6 py-2.5 rounded-xl premium-gradient text-white font-semibold text-sm border-none cursor-pointer"
          >
            Book a Ride
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentStatus = STATUS_FLOW[currentStatusIdx] || 'completed';
  const isCompleted = currentStatus === 'completed' || trackingBooking.status === 'completed';

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">
            Live <span className="text-saffron dark:text-gold">Tracking</span>
          </h1>
          <p className="text-center text-charcoal/60 dark:text-slate-text mb-8">
            {isCompleted ? 'Your ride has been completed' : 'Track your ride in real-time'}
          </p>
        </motion.div>

        {/* Route & Map-like UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text mb-1">Route</p>
              <p className="font-display text-lg font-bold">
                {trackingBooking.from} → {trackingBooking.to}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text mb-1">ETA</p>
              <p className="font-display text-2xl font-bold text-saffron dark:text-gold">
                {isCompleted ? '0:00' : formatEta(etaSeconds)}
              </p>
            </div>
          </div>

          {/* Simulated Map */}
          <div className="relative bg-linear-to-r from-green-100 via-yellow-50 to-green-100 dark:from-green-900/20 dark:via-charcoal-mid dark:to-green-900/20 rounded-xl p-4 mb-4 overflow-hidden h-32 md:h-40">
            {/* Road */}
            <div className="absolute top-1/2 left-4 right-4 h-3 bg-charcoal/20 dark:bg-white/10 rounded-full -translate-y-1/2">
              <div className="absolute inset-0 flex items-center justify-between px-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-3 h-0.5 bg-yellow-400 dark:bg-yellow-600 rounded" />
                ))}
              </div>
            </div>

            {/* Cities along route */}
            <div className="absolute top-2 left-4 text-xs font-bold text-green-700 dark:text-green-400">
              📍 {trackingBooking.from}
            </div>
            <div className="absolute top-2 right-4 text-xs font-bold text-red-600 dark:text-red-400">
              🏁 {trackingBooking.to}
            </div>

            {/* Moving car */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${Math.min(carPosition, 92)}%` }}
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <span className="text-3xl drop-shadow-lg">🚗</span>
            </motion.div>

            {/* Trail */}
            <motion.div
              className="absolute top-1/2 left-4 h-1 bg-saffron/40 dark:bg-gold/40 rounded-full -translate-y-1/2"
              style={{ width: `${Math.min(carPosition, 92)}%` }}
            />
          </div>

          {/* Distance info */}
          <div className="flex justify-between text-xs text-charcoal/50 dark:text-slate-text">
            <span>{trackingBooking.distance} km total distance</span>
            <span>{trackingBooking.carType} · {trackingBooking.tripType}</span>
          </div>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="font-display text-lg font-semibold mb-6">Ride Status</h2>
          <div className="space-y-0">
            {STATUS_FLOW.map((status, idx) => {
              const isActive = idx === currentStatusIdx;
              const isDone = idx < currentStatusIdx || isCompleted;
              return (
                <div key={status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isDone || isActive ? '#FF9933' : 'transparent',
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                        isDone || isActive
                          ? 'border-saffron dark:border-gold text-white'
                          : 'border-charcoal/20 dark:border-white/20 text-charcoal/30 dark:text-white/30'
                      }`}
                    >
                      {isDone ? '✓' : STATUS_ICONS[status]}
                    </motion.div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div
                        className={`w-0.5 h-8 transition-colors ${
                          isDone ? 'bg-saffron dark:bg-gold' : 'bg-charcoal/10 dark:bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-semibold ${
                      isDone || isActive ? 'text-charcoal dark:text-white' : 'text-charcoal/40 dark:text-white/40'
                    }`}>
                      {STATUS_LABELS[status]}
                    </p>
                    {isActive && !isCompleted && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-saffron dark:text-gold mt-0.5"
                      >
                        Current status
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Driver Info */}
        {assignment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 md:p-8 mb-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Your Driver</h2>
            <div className="flex items-center gap-4">
              <img
                src={assignment.driverPhoto}
                alt={assignment.driverName}
                className="w-16 h-16 rounded-full object-cover border-2 border-saffron/30 dark:border-gold/30"
              />
              <div className="flex-1">
                <p className="font-semibold text-base">{assignment.driverName}</p>
                <p className="text-xs text-charcoal/60 dark:text-slate-text">{assignment.driverVehicle}</p>
                <p className="text-xs text-charcoal/50 dark:text-slate-text/60 mt-0.5">
                  {assignment.driverPhone}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-saffron/10 dark:bg-gold/10 text-saffron dark:text-gold capitalize">
                  {assignment.driverTier}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {isCompleted && assignment && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRating(true)}
              className="flex-1 py-3 rounded-xl premium-gradient text-white font-semibold text-sm border-none cursor-pointer"
            >
              ⭐ Rate Your Driver
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 rounded-xl bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-white font-semibold text-sm border-none cursor-pointer"
          >
            📊 Go to Dashboard
          </motion.button>
        </motion.div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && assignment && (
          <DriverRating
            bookingId={trackingBooking.id}
            driverId={assignment.driverId}
            driverName={assignment.driverName}
            onClose={() => setShowRating(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
