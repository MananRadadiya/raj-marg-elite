import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../redux/authSlice';
import { updateSavedAddress, setPreferredCar, setPreferredTier } from '../redux/profileSlice';
import { formatINR } from '../utils/fareCalculator';
import cars from '../data/cars';
import driverTiers from '../data/drivers';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.booking);
  const { payments } = useSelector((s) => s.payment);
  const { points, totalEarned, history } = useSelector((s) => s.loyalty);
  const { savedAddresses, preferredCar, preferredTier } = useSelector((s) => s.profile);
  const { activePlan } = useSelector((s) => s.subscription);

  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-card rounded-2xl p-12">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold mb-2 text-charcoal dark:text-white">Login Required</h2>
          <p className="text-sm text-charcoal/60 dark:text-slate-text mb-4">Please login to view your profile</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-xl text-sm font-semibold premium-gradient text-charcoal border-none cursor-pointer">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalRides = bookings.length;
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedRides = bookings.filter((b) => b.status === 'completed').length;

  const TABS = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'rides', label: 'Ride History', icon: '🚕' },
    { id: 'loyalty', label: 'Loyalty Points', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div {...fadeUp} className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-3xl font-bold text-charcoal shadow-lg shadow-saffron/20">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold text-charcoal dark:text-white">{user.name}</h1>
              <p className="text-sm text-charcoal/50 dark:text-slate-text">{user.email || user.phone}</p>
              {activePlan && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-bold bg-gold/10 text-gold">
                  💎 {activePlan} Plan
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-xl font-bold text-saffron dark:text-gold">{totalRides}</div><div className="text-[10px] text-charcoal/40 dark:text-slate-text uppercase">Rides</div></div>
              <div><div className="text-xl font-bold text-saffron dark:text-gold">{formatINR(totalSpent)}</div><div className="text-[10px] text-charcoal/40 dark:text-slate-text uppercase">Spent</div></div>
              <div><div className="text-xl font-bold text-saffron dark:text-gold">{points}</div><div className="text-[10px] text-charcoal/40 dark:text-slate-text uppercase">Points</div></div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border-none cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'premium-gradient text-charcoal shadow-md'
                  : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <motion.div {...fadeUp} className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-charcoal dark:text-white">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow label="Full Name" value={user.name} />
                <InfoRow label="Email" value={user.email || '—'} />
                <InfoRow label="Phone" value={user.phone || '—'} />
                <InfoRow label="Role" value={user.role || 'Customer'} />
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-charcoal dark:text-white">Saved Addresses</h3>
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-dark/50 dark:bg-charcoal-mid/50">
                    <span className="text-lg">{addr.label === 'Home' ? '🏠' : '🏢'}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-charcoal dark:text-white">{addr.label}</div>
                      <div className="text-xs text-charcoal/50 dark:text-slate-text">{addr.city || 'Not set'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rides' && (
          <motion.div {...fadeUp} className="space-y-3">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">🚕</div>
                <p className="text-charcoal/50 dark:text-slate-text">No rides yet. Book your first ride!</p>
              </div>
            ) : (
              bookings.slice(0, 15).map((b) => (
                <div key={b.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-charcoal dark:text-white">{b.from} → {b.to}</div>
                      <div className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                        {b.carType} · {b.distance} km · {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-saffron dark:text-gold">{formatINR(b.fare?.total || 0)}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        b.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        b.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                        'bg-saffron/10 text-saffron'
                      }`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'loyalty' && (
          <motion.div {...fadeUp} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-saffron dark:text-gold">{points}</div>
                <div className="text-xs text-charcoal/50 dark:text-slate-text">Available Points</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-charcoal dark:text-white">{formatINR(points)}</div>
                <div className="text-xs text-charcoal/50 dark:text-slate-text">Redeemable Value</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-charcoal dark:text-white">{totalEarned}</div>
                <div className="text-xs text-charcoal/50 dark:text-slate-text">Total Earned</div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-charcoal dark:text-white">Points History</h3>
              {history.length === 0 ? (
                <p className="text-sm text-charcoal/50 dark:text-slate-text text-center py-4">No points earned yet. Complete a ride to earn points!</p>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 10).map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream-dark/50 dark:bg-charcoal-mid/50">
                      <div>
                        <div className="text-sm text-charcoal dark:text-white">{h.description}</div>
                        <div className="text-xs text-charcoal/40 dark:text-slate-text">{new Date(h.timestamp).toLocaleDateString()}</div>
                      </div>
                      <span className={`font-bold text-sm ${h.type === 'earned' ? 'text-green-500' : 'text-red-400'}`}>
                        {h.type === 'earned' ? '+' : '-'}{h.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div {...fadeUp} className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-charcoal dark:text-white">Preferred Vehicle</h3>
              <div className="flex flex-wrap gap-2">
                {cars.map((car) => (
                  <button key={car.id} onClick={() => dispatch(setPreferredCar(car.id))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                      preferredCar === car.id ? 'premium-gradient text-charcoal' : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text'
                    }`}
                  >
                    {car.image} {car.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-charcoal dark:text-white">Preferred Driver Tier</h3>
              <div className="flex flex-wrap gap-2">
                {driverTiers.map((t) => (
                  <button key={t.id} onClick={() => dispatch(setPreferredTier(t.id))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                      preferredTier === t.id ? 'premium-gradient text-charcoal' : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text'
                    }`}
                  >
                    {t.icon} {t.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { dispatch(logout()); navigate('/'); }}
              className="w-full py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 border-none cursor-pointer hover:bg-red-500/20 transition-colors"
            >
              🚪 Logout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-cream-dark/50 dark:bg-charcoal-mid/50">
      <div className="text-[10px] uppercase tracking-wider text-charcoal/40 dark:text-slate-text/60 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-charcoal dark:text-white">{value}</div>
    </div>
  );
}
