import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { login, otpLogin } from '../redux/authSlice';
import { addToast } from '../redux/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [mode, setMode] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    dispatch(login({ email, password }));
    const user = JSON.parse(localStorage.getItem('rajmarg_user') || 'null');
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(otp);
    setOtpSent(true);
    console.log(`%c[RajMarg OTP] Your OTP is: ${otp}`, 'color: #FF9933; font-size: 18px; font-weight: bold;');
    dispatch(addToast({ message: `OTP sent! Check console (${otp})`, type: 'info', duration: 6000 }));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    if (otpInput === generatedOtp) {
      dispatch(otpLogin({ phone }));
      dispatch(addToast({ message: 'OTP verified! Welcome!', type: 'success' }));
      navigate('/dashboard');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-8 md:p-10 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🏛️</span>
          <h1 className="font-display text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-sm text-charcoal/60 dark:text-slate-text">
            Sign in to your Rajmarg Elite account
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-cream-dark dark:bg-charcoal-mid p-1 mb-6">
          <button
            onClick={() => { setMode('email'); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all ${
              mode === 'email'
                ? 'premium-gradient text-white shadow-md'
                : 'bg-transparent text-charcoal/60 dark:text-slate-text'
            }`}
          >
            ✉️ Email Login
          </button>
          <button
            onClick={() => { setMode('otp'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all ${
              mode === 'otp'
                ? 'premium-gradient text-white shadow-md'
                : 'bg-transparent text-charcoal/60 dark:text-slate-text'
            }`}
          >
            📱 Phone OTP
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'email' ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleEmailSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
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
                Sign In
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
                      />
                    </div>
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
                    Send OTP
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center mb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-3xl mb-2"
                    >
                      📩
                    </motion.div>
                    <p className="text-sm text-charcoal/60 dark:text-slate-text">
                      OTP sent to +91 {phone}
                    </p>
                    <p className="text-xs text-saffron dark:text-gold mt-1">
                      Check browser console for OTP
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider text-center">
                      Enter 4-Digit OTP
                    </label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                      maxLength={4}
                      placeholder="● ● ● ●"
                      className="w-full px-4 py-3 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
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
                    Verify & Login
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpInput(''); setError(''); }}
                    className="w-full text-center text-xs text-saffron dark:text-gold bg-transparent border-none cursor-pointer"
                  >
                    ← Change phone number
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal/60 dark:text-slate-text">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron dark:text-gold font-semibold no-underline">
              Register
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-saffron/5 dark:bg-gold/5 border border-saffron/20 dark:border-gold/20">
          <p className="text-xs font-semibold text-charcoal/70 dark:text-slate-text mb-2 uppercase tracking-wider">
            Demo Accounts
          </p>
          <div className="space-y-1.5 text-xs text-charcoal/60 dark:text-slate-text">
            <div>
              <span className="font-medium">Customer:</span> demo@rajmarg.com / 123456
            </div>
            <div>
              <span className="font-medium">Admin:</span> admin@rajmarg.com / admin123
            </div>
            <div>
              <span className="font-medium">OTP:</span> Any 10-digit phone number
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
