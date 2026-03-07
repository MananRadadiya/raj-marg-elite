import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';
import Invoice from '../components/Invoice';
import DriverRating from '../components/DriverRating';

const STATUS_CONFIG = {
  pending:      { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳', label: 'Pending' },
  confirmed:    { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '✅', label: 'Confirmed' },
  'on-the-way': { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '🚗', label: 'On The Way' },
  arrived:      { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: '📍', label: 'Arrived' },
  completed:    { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🏁', label: 'Completed' },
  cancelled:    { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '❌', label: 'Cancelled' },
};

const PAYMENT_STATUS = {
  paid:   { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: '💳 Paid' },
  unpaid: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: '⏳ Unpaid' },
};

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.booking);
  const { payments } = useSelector((s) => s.payment);
  const { assignedBookings } = useSelector((s) => s.driver);
  const { ratings } = useSelector((s) => s.rating);
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState(null);
  const [ratingData, setRatingData] = useState(null);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userBookings =
    user.role === 'admin'
      ? bookings
      : bookings.filter(() => true);

  /* Map payments by bookingId for quick lookup */
  const paymentMap = {};
  payments.forEach((p) => { paymentMap[p.bookingId] = p; });

  const totalSpent = payments
    .filter((p) => p.status === 'Success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const paidCount = payments.filter((p) => p.status === 'Success').length;
  const pendingCount   = userBookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = userBookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = userBookings.filter((b) => b.status === 'completed').length;

  const openInvoice = (booking) => {
    const payment = paymentMap[booking.id];
    if (payment) setInvoiceData({ booking, payment });
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome, <span className="text-saffron dark:text-gold">{user.name}</span>
          </h1>
          <p className="text-charcoal/60 dark:text-slate-text mb-8">Your booking dashboard</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatCard icon="📋" label="Total" value={userBookings.length} delay={0} />
          <StatCard icon="⏳" label="Pending" value={pendingCount} delay={0.05} />
          <StatCard icon="✅" label="Confirmed" value={confirmedCount} delay={0.1} />
          <StatCard icon="🏁" label="Completed" value={completedCount} delay={0.15} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="💰" label="Total Spent" value={formatINR(totalSpent)} delay={0.2} highlight />
          <StatCard icon="💳" label="Payments" value={paidCount} delay={0.25} />
          <StatCard icon="⭐" label="Preferred Tier" value={getMostUsedTier(userBookings)} delay={0.3} />
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-2xl overflow-hidden mb-8"
        >
          <div className="p-5 border-b border-charcoal/10 dark:border-white/10 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Booking History</h2>
            <Link
              to="/booking"
              className="px-4 py-1.5 rounded-full text-xs font-semibold premium-gradient text-white no-underline"
            >
              + New Booking
            </Link>
          </div>

          {userBookings.length === 0 ? (
            <div className="p-12 text-center text-charcoal/40 dark:text-slate-text">
              <div className="text-4xl mb-3">🚕</div>
              <p>No bookings yet. Book your first ride!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text border-b border-charcoal/5 dark:border-white/5">
                    <th className="text-left p-4 font-semibold">Booking ID</th>
                    <th className="text-left p-4 font-semibold">Route</th>
                    <th className="text-left p-4 font-semibold">Vehicle</th>
                    <th className="text-right p-4 font-semibold">Fare</th>
                    <th className="text-center p-4 font-semibold">Status</th>
                    <th className="text-center p-4 font-semibold">Payment</th>
                    <th className="text-center p-4 font-semibold">Invoice</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <AnimatePresence>
                  <tbody>
                    {userBookings.map((b) => {
                      const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                      const hasPaid = !!paymentMap[b.id];
                      const pCfg = hasPaid ? PAYMENT_STATUS.paid : PAYMENT_STATUS.unpaid;
                      return (
                        <motion.tr
                          key={b.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-charcoal/5 dark:border-white/5 hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors"
                        >
                          <td className="p-4 font-mono text-xs text-charcoal/50 dark:text-slate-text">
                            {b.id?.slice(0, 16) || '—'}
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{b.from} → {b.to}</div>
                            <div className="text-xs text-charcoal/40 dark:text-slate-text/60 mt-0.5">
                              {b.tripType} · {new Date(b.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">{b.carType}</td>
                          <td className="p-4 text-right font-semibold text-saffron dark:text-gold">
                            {formatINR(b.fare?.total || 0)}
                          </td>
                          <td className="p-4 text-center">
                            <motion.span
                              key={b.status}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}
                            >
                              <span>{cfg.icon}</span> {cfg.label}
                            </motion.span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pCfg.color}`}>
                              {pCfg.label}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {hasPaid ? (
                              <button
                                onClick={() => openInvoice(b)}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-saffron/10 dark:bg-gold/10 text-saffron dark:text-gold border-none cursor-pointer hover:bg-saffron/20 dark:hover:bg-gold/20 transition"
                              >
                                View
                              </button>
                            ) : (
                              <span className="text-xs text-charcoal/30 dark:text-slate-text/40">—</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {['confirmed', 'on-the-way', 'arrived'].includes(b.status) && (
                                <button
                                  onClick={() => navigate('/live-tracking')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-none cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                                >
                                  📍 Track
                                </button>
                              )}
                              {b.status === 'completed' && (() => {
                                const assignment = assignedBookings.find((a) => a.bookingId === b.id);
                                const alreadyRated = ratings.find((r) => r.bookingId === b.id);
                                if (assignment && !alreadyRated) {
                                  return (
                                    <button
                                      onClick={() => setRatingData({ bookingId: b.id, driverId: assignment.driverId, driverName: assignment.driverName })}
                                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-none cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
                                    >
                                      ⭐ Rate
                                    </button>
                                  );
                                }
                                if (alreadyRated) {
                                  return <span className="text-xs text-charcoal/40 dark:text-slate-text/60">⭐ {alreadyRated.rating}/5</span>;
                                }
                                return <span className="text-xs text-charcoal/30 dark:text-slate-text/40">—</span>;
                              })()}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          )}
        </motion.div>

        {/* Payment History */}
        {payments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-charcoal/10 dark:border-white/10">
              <h2 className="font-display text-xl font-semibold">💳 Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text border-b border-charcoal/5 dark:border-white/5">
                    <th className="text-left p-4 font-semibold">Payment ID</th>
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Method</th>
                    <th className="text-right p-4 font-semibold">Amount</th>
                    <th className="text-center p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.paymentId} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors">
                      <td className="p-4 font-mono text-xs">{p.paymentId}</td>
                      <td className="p-4 font-mono text-xs text-charcoal/50 dark:text-slate-text">{p.orderId}</td>
                      <td className="p-4">{p.method}</td>
                      <td className="p-4 text-right font-semibold text-saffron dark:text-gold">{formatINR(p.amount)}</td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-charcoal/50 dark:text-slate-text">
                        {new Date(p.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceData && (
          <Invoice
            booking={invoiceData.booking}
            payment={invoiceData.payment}
            onClose={() => setInvoiceData(null)}
          />
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingData && (
          <DriverRating
            bookingId={ratingData.bookingId}
            driverId={ratingData.driverId}
            driverName={ratingData.driverName}
            onClose={() => setRatingData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, delay = 0, highlight = false }) {
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

function getMostUsedTier(bookings) {
  if (bookings.length === 0) return 'N/A';
  const counts = {};
  bookings.forEach((b) => { counts[b.driverTier] = (counts[b.driverTier] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}
