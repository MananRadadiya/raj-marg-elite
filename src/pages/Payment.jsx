import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';
import { generatePaymentId, generateOrderId } from '../utils/generatePaymentId';
import { recordPayment, clearPendingPayment } from '../redux/paymentSlice';
import { updateBookingStatus } from '../redux/bookingSlice';
import { addToast } from '../redux/notificationSlice';
import useAutoAssignDriver from '../hooks/useAutoAssignDriver';
import FakeRazorpayModal from '../components/FakeRazorpayModal';

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { pendingPayment } = useSelector((s) => s.payment);
  const { bookings } = useSelector((s) => s.booking);

  const [showModal, setShowModal] = useState(false);
  const assignAndSimulate = useAutoAssignDriver();

  /* Recover from localStorage if Redux state lost on refresh */
  const [localPending, setLocalPending] = useState(null);

  useEffect(() => {
    if (!pendingPayment) {
      const stored = localStorage.getItem('rajmarg_pending_payment');
      if (stored) {
        try { setLocalPending(JSON.parse(stored)); } catch { /* ignore */ }
      }
    }
  }, [pendingPayment]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const booking = pendingPayment || localPending;

  /* If no booking data, redirect to booking page */
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-xl font-bold mb-2">No Pending Payment</h2>
          <p className="text-charcoal/60 dark:text-slate-text text-sm mb-6">
            Book a ride first to proceed with payment.
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

  const fare = booking.fare || {};
  const subtotal = fare.total || 0;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const handlePaymentSuccess = (method) => {
    const paymentData = {
      paymentId: generatePaymentId(),
      orderId: generateOrderId(),
      bookingId: booking.bookingId,
      amount: grandTotal,
      subtotal,
      gst,
      method,
      status: 'Success',
    };

    dispatch(recordPayment(paymentData));
    dispatch(updateBookingStatus({ id: booking.bookingId, status: 'confirmed' }));
    dispatch(clearPendingPayment());
    localStorage.removeItem('rajmarg_pending_payment');
    dispatch(addToast({ message: 'Payment successful!', type: 'payment' }));

    /* Auto-assign driver and start lifecycle simulation */
    const matchedBooking = bookings.find((b) => b.id === booking.bookingId);
    if (matchedBooking) {
      assignAndSimulate(matchedBooking);
    }

    setShowModal(false);
    navigate('/live-tracking');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    /* booking stays pending — user can retry */
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">
            Complete <span className="text-saffron dark:text-gold">Payment</span>
          </h1>
          <p className="text-center text-charcoal/60 dark:text-slate-text mb-8">
            Review your booking and pay securely
          </p>
        </motion.div>

        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            📋 Booking Summary
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <SummaryField label="Booking ID" value={booking.bookingId} />
            <SummaryField label="Route" value={`${booking.from} → ${booking.to}`} />
            <SummaryField label="Trip Type" value={booking.tripType === 'round-trip' ? 'Round Trip' : 'One Way'} />
            <SummaryField label="Vehicle" value={booking.carType} />
            <SummaryField label="Driver Tier" value={booking.driverTier} />
            <SummaryField label="Distance" value={`${booking.distance} km`} />
          </div>

          {/* Fare Breakdown */}
          <div className="border-t border-charcoal/10 dark:border-white/10 pt-4 space-y-2">
            <FareRow label="Fare Subtotal" value={formatINR(subtotal)} />
            <FareRow label="GST (5%)" value={formatINR(gst)} />
            <div className="flex justify-between items-center pt-3 border-t border-saffron/30 dark:border-gold/30">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-extrabold text-saffron dark:text-gold">{formatINR(grandTotal)}</span>
            </div>
          </div>
        </motion.div>

        {/* Pay Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-12 py-4 rounded-xl premium-gradient text-white font-bold text-base tracking-wide border-none cursor-pointer shadow-lg hover:shadow-saffron/30 dark:hover:shadow-gold/30 transition-shadow"
          >
            💳 Pay Now — {formatINR(grandTotal)}
          </motion.button>
          <p className="text-xs text-charcoal/40 dark:text-slate-text/60 mt-3">
            🔒 Simulated payment · No real charges
          </p>
        </motion.div>

        {/* Razorpay Modal */}
        {showModal && (
          <FakeRazorpayModal
            amount={grandTotal}
            onSuccess={handlePaymentSuccess}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-cream-dark/50 dark:bg-charcoal-mid/50">
      <div className="text-[10px] uppercase tracking-wider text-charcoal/40 dark:text-slate-text/60">{label}</div>
      <div className="text-sm font-semibold text-charcoal dark:text-white mt-0.5 break-all">{value}</div>
    </div>
  );
}

function FareRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-charcoal/60 dark:text-slate-text">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
