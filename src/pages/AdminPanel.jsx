import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePrice, resetPrices } from '../redux/fareSlice';
import { cancelBooking, updateBookingStatus } from '../redux/bookingSlice';
import { formatINR } from '../utils/fareCalculator';
import cars from '../data/cars';
import Invoice from '../components/Invoice';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
  confirmed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '✅' },
  completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🏁' },
  cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '❌' },
};

export default function AdminPanel() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.booking);
  const { payments } = useSelector((s) => s.payment);
  const prices = useSelector((s) => s.fare.prices);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('bookings');

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  /* Payment map for quick lookup */
  const paymentMap = {};
  payments.forEach((p) => { paymentMap[p.bookingId] = p; });

  const totalRevenue = payments
    .filter((p) => p.status === 'Success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const successfulPayments = payments.filter((p) => p.status === 'Success').length;

  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const tabs = [
    { id: 'bookings', label: 'All Bookings', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'drivers', label: 'Drivers', icon: '🚗' },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Admin <span className="text-saffron dark:text-gold">Panel</span>
          </h1>
          <p className="text-charcoal/60 dark:text-slate-text mb-8">Manage bookings, payments, pricing, and drivers</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatCard icon="📋" label="Total Bookings" value={bookings.length} />
          <StatCard icon="⏳" label="Pending" value={statusCounts.pending || 0} />
          <StatCard icon="✅" label="Confirmed" value={statusCounts.confirmed || 0} />
          <StatCard icon="🏁" label="Completed" value={statusCounts.completed || 0} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="💰" label="Total Revenue" value={formatINR(totalRevenue)} highlight />
          <StatCard icon="💳" label="Successful Payments" value={successfulPayments} />
          <StatCard icon="❌" label="Cancelled" value={statusCounts.cancelled || 0} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'premium-gradient text-white shadow-lg'
                  : 'glass-card text-charcoal/70 dark:text-slate-text'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} dispatch={dispatch} paymentMap={paymentMap} />}
          {activeTab === 'payments' && <PaymentsTab payments={payments} bookings={bookings} paymentMap={paymentMap} />}
          {activeTab === 'pricing' && <PricingTab prices={prices} dispatch={dispatch} />}
          {activeTab === 'drivers' && <DriversTab />}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKINGS TAB — City filter + Status + Paid/Unpaid filter + Invoice
   ═══════════════════════════════════════════════════════════ */
function BookingsTab({ bookings, dispatch, paymentMap }) {
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState(''); // 'paid' | 'unpaid' | ''
  const [invoiceData, setInvoiceData] = useState(null);

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (cityFilter) list = list.filter((b) => b.from === cityFilter || b.to === cityFilter);
    if (statusFilter) list = list.filter((b) => b.status === statusFilter);
    if (paidFilter === 'paid') list = list.filter((b) => !!paymentMap[b.id]);
    if (paidFilter === 'unpaid') list = list.filter((b) => !paymentMap[b.id]);
    return list;
  }, [bookings, cityFilter, statusFilter, paidFilter, paymentMap]);

  const cities = [...new Set(bookings.flatMap((b) => [b.from, b.to]).filter(Boolean))].sort();

  const openInvoice = (booking) => {
    const payment = paymentMap[booking.id];
    if (payment) setInvoiceData({ booking, payment });
  };

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-charcoal/10 dark:border-white/10 flex flex-wrap gap-3 items-center">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-saffron/50"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-saffron/50"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select
            value={paidFilter}
            onChange={(e) => setPaidFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-saffron/50"
          >
            <option value="">All Payments</option>
            <option value="paid">💳 Paid</option>
            <option value="unpaid">⏳ Unpaid</option>
          </select>
          <span className="text-xs text-charcoal/40 dark:text-slate-text ml-auto">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 dark:text-slate-text">No bookings match filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text border-b border-charcoal/5 dark:border-white/5">
                  <th className="text-left p-4 font-semibold">ID</th>
                  <th className="text-left p-4 font-semibold">Route</th>
                  <th className="text-left p-4 font-semibold">Vehicle</th>
                  <th className="text-right p-4 font-semibold">Fare</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Payment</th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <AnimatePresence>
                <tbody>
                  {filtered.map((b) => {
                    const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    const hasPaid = !!paymentMap[b.id];
                    return (
                      <motion.tr
                        key={b.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-charcoal/5 dark:border-white/5 hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors"
                      >
                        <td className="p-4 font-mono text-xs">{b.id?.slice(0, 16) || '—'}</td>
                        <td className="p-4">
                          {b.from} → {b.to}
                          <div className="text-xs text-charcoal/40 dark:text-slate-text/60">{b.distance} km · {b.tripType}</div>
                        </td>
                        <td className="p-4">{b.carType}</td>
                        <td className="p-4 text-right font-semibold text-saffron dark:text-gold">{formatINR(b.fare?.total || 0)}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            <span>{cfg.icon}</span> {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            hasPaid
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {hasPaid ? '💳 Paid' : '⏳ Unpaid'}
                          </span>
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <select
                            value={b.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus === 'cancelled') dispatch(cancelBooking(b.id));
                              else dispatch(updateBookingStatus({ id: b.id, status: newStatus }));
                            }}
                            className="px-2 py-1 rounded-lg text-xs bg-cream-dark dark:bg-charcoal-mid border border-charcoal/10 dark:border-white/10 text-charcoal dark:text-white focus:outline-none cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          {hasPaid && (
                            <button
                              onClick={() => openInvoice(b)}
                              className="px-2 py-1 rounded-lg text-xs font-medium bg-saffron/10 dark:bg-gold/10 text-saffron dark:text-gold border-none cursor-pointer hover:bg-saffron/20 dark:hover:bg-gold/20 transition"
                            >
                              Invoice
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </AnimatePresence>
            </table>
          </div>
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
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAYMENTS TAB — All payment records
   ═══════════════════════════════════════════════════════════ */
function PaymentsTab({ payments, bookings, paymentMap }) {
  const [invoiceData, setInvoiceData] = useState(null);

  const openInvoice = (payment) => {
    const booking = bookings.find((b) => b.id === payment.bookingId);
    if (booking) setInvoiceData({ booking, payment });
  };

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 dark:text-slate-text">No payments recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text border-b border-charcoal/5 dark:border-white/5">
                  <th className="text-left p-4 font-semibold">Payment ID</th>
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Booking</th>
                  <th className="text-left p-4 font-semibold">Method</th>
                  <th className="text-right p-4 font-semibold">Amount</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors">
                    <td className="p-4 font-mono text-xs">{p.paymentId}</td>
                    <td className="p-4 font-mono text-xs text-charcoal/50 dark:text-slate-text">{p.orderId}</td>
                    <td className="p-4 font-mono text-xs text-charcoal/50 dark:text-slate-text">{p.bookingId?.slice(0, 16) || '—'}</td>
                    <td className="p-4">{p.method}</td>
                    <td className="p-4 text-right font-semibold text-saffron dark:text-gold">{formatINR(p.amount)}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-charcoal/50 dark:text-slate-text">{new Date(p.timestamp).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openInvoice(p)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-saffron/10 dark:bg-gold/10 text-saffron dark:text-gold border-none cursor-pointer hover:bg-saffron/20 dark:hover:bg-gold/20 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {invoiceData && (
          <Invoice
            booking={invoiceData.booking}
            payment={invoiceData.payment}
            onClose={() => setInvoiceData(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICING TAB
   ═══════════════════════════════════════════════════════════ */
function PricingTab({ prices, dispatch }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold">Per KM Pricing</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch(resetPrices())}
          className="px-4 py-1.5 rounded-lg text-xs font-medium bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/70 dark:text-slate-text border-none cursor-pointer hover:bg-charcoal/10 dark:hover:bg-charcoal-mid/80 transition"
        >
          Reset Defaults
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="p-4 rounded-xl bg-cream-dark/50 dark:bg-charcoal-mid/50 border border-charcoal/5 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{car.image}</span>
              <div>
                <div className="font-semibold text-sm">{car.name}</div>
                <div className="text-xs text-charcoal/40 dark:text-slate-text/60">Default: ₹{car.perKm}/km</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">₹</span>
              <input
                type="number"
                min="1"
                value={prices[car.id] || car.perKm}
                onChange={(e) => dispatch(updatePrice({ carId: car.id, price: Number(e.target.value) }))}
                className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-charcoal text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              />
              <span className="text-sm text-charcoal/50 dark:text-slate-text">/km</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRIVERS TAB
   ═══════════════════════════════════════════════════════════ */
function DriversTab() {
  const [drivers] = useState([
    { id: 1, name: 'Ramesh Patel', tier: 'Gold', rides: 542, rating: 4.8, status: 'approved', city: 'Ahmedabad' },
    { id: 2, name: 'Suresh Shah', tier: 'Silver', rides: 213, rating: 4.6, status: 'approved', city: 'Surat' },
    { id: 3, name: 'Kiran Desai', tier: 'Platinum', rides: 1204, rating: 4.9, status: 'approved', city: 'Vadodara' },
    { id: 4, name: 'Vijay Mehta', tier: 'Bronze', rides: 45, rating: 4.3, status: 'pending', city: 'Rajkot' },
    { id: 5, name: 'Amit Joshi', tier: 'Bronze', rides: 12, rating: 4.1, status: 'pending', city: 'Gandhinagar' },
  ]);

  const [localDrivers, setLocalDrivers] = useState(drivers);

  const handleApprove = (id) => {
    setLocalDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)));
  };

  const driverStatusColors = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-charcoal/50 dark:text-slate-text border-b border-charcoal/5 dark:border-white/5">
              <th className="text-left p-4 font-semibold">Driver</th>
              <th className="text-left p-4 font-semibold">City</th>
              <th className="text-left p-4 font-semibold">Tier</th>
              <th className="text-right p-4 font-semibold">Rides</th>
              <th className="text-right p-4 font-semibold">Rating</th>
              <th className="text-center p-4 font-semibold">Status</th>
              <th className="text-center p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {localDrivers.map((d) => (
              <tr key={d.id} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors">
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4 text-charcoal/60 dark:text-slate-text">{d.city}</td>
                <td className="p-4">{d.tier}</td>
                <td className="p-4 text-right">{d.rides}</td>
                <td className="p-4 text-right">⭐ {d.rating}</td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${driverStatusColors[d.status]}`}>{d.status}</span>
                </td>
                <td className="p-4 text-center">
                  {d.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(d.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-none cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card rounded-xl p-5 ${highlight ? 'ring-2 ring-saffron/30 dark:ring-gold/30' : ''}`}>
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
