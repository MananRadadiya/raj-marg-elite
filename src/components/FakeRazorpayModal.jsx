import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';

const METHODS = [
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Netbanking', icon: '🏦' },
];

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'];

export default function FakeRazorpayModal({ amount, onSuccess, onClose }) {
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  /* Dummy form state (no validation) */
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : 'Netbanking');
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!processing && !success ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* ── Razorpay-style Header ── */}
          <div className="bg-[#072654] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                R
              </div>
              <div>
                <div className="text-white text-sm font-bold tracking-wide">RAJMARG ELITE</div>
                <div className="text-blue-200 text-[11px]">Secure Payment Gateway</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-lg font-bold">{formatINR(amount)}</div>
              <div className="text-blue-200 text-[10px]">Amount Due</div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="bg-white dark:bg-charcoal-light p-6">
            {success ? (
              <SuccessView amount={amount} />
            ) : processing ? (
              <ProcessingView />
            ) : (
              <>
                {/* Method Tabs */}
                <div className="flex rounded-xl overflow-hidden mb-5 border border-gray-200 dark:border-white/10">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                        method === m.id
                          ? 'bg-[#072654] text-white'
                          : 'bg-white dark:bg-charcoal-mid text-gray-500 dark:text-slate-text hover:bg-gray-50 dark:hover:bg-charcoal-mid/80'
                      }`}
                    >
                      <span>{m.icon}</span> {m.label}
                    </button>
                  ))}
                </div>

                {/* ── Card Form ── */}
                {method === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <ModalInput
                      label="Card Number"
                      value={cardNumber}
                      onChange={setCardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <ModalInput
                      label="Cardholder Name"
                      value={cardName}
                      onChange={setCardName}
                      placeholder="Name on card"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <ModalInput
                        label="Expiry"
                        value={cardExpiry}
                        onChange={setCardExpiry}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <ModalInput
                        label="CVV"
                        value={cardCvv}
                        onChange={setCardCvv}
                        placeholder="•••"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── UPI Form ── */}
                {method === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <ModalInput
                      label="UPI ID"
                      value={upiId}
                      onChange={setUpiId}
                      placeholder="yourname@upi"
                    />
                    <div className="flex gap-2 mt-2">
                      {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                        <button
                          key={app}
                          onClick={() => setUpiId(`user@${app.toLowerCase().replace(/\s/g, '')}`)}
                          className="flex-1 py-2 rounded-lg bg-gray-50 dark:bg-charcoal-mid border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-slate-text cursor-pointer hover:bg-gray-100 dark:hover:bg-charcoal-mid/80 transition"
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Netbanking Form ── */}
                {method === 'netbanking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-slate-text mb-2 uppercase tracking-wider">
                      Select Bank
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {BANKS.map((b) => (
                        <button
                          key={b}
                          onClick={() => setBank(b)}
                          className={`py-2.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                            bank === b
                              ? 'bg-[#072654] text-white border-[#072654]'
                              : 'bg-white dark:bg-charcoal-mid border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-text hover:border-[#072654]/30'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePay}
                  className="w-full mt-6 py-3.5 rounded-xl bg-[#072654] text-white font-semibold text-sm tracking-wide border-none cursor-pointer hover:bg-[#0A3573] transition-colors shadow-lg"
                >
                  Pay {formatINR(amount)}
                </motion.button>

                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-2 text-xs text-gray-400 dark:text-slate-text/60 bg-transparent border-none cursor-pointer hover:text-gray-600 dark:hover:text-slate-text transition"
                >
                  Cancel Payment
                </button>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="bg-gray-50 dark:bg-charcoal-mid/50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-text/60">
              <span>🔒</span> Secured by <strong className="text-gray-500 dark:text-slate-text">Razorpay</strong>
            </div>
            <div className="flex gap-2 text-[10px] text-gray-400 dark:text-slate-text/60">
              <span>💳 Visa</span>
              <span>💳 MC</span>
              <span>📱 UPI</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════ Sub-components ═══════════════════ */

function ModalInput({ label, value, onChange, placeholder, maxLength, type = 'text' }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 dark:text-slate-text mb-1 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-charcoal-mid text-charcoal dark:text-white border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#072654]/50 placeholder:text-gray-300 dark:placeholder:text-slate-text/40"
      />
    </div>
  );
}

function ProcessingView() {
  return (
    <div className="py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-[#072654] dark:border-t-gold"
      />
      <p className="text-sm font-medium text-gray-600 dark:text-slate-text">Processing payment…</p>
      <p className="text-xs text-gray-400 dark:text-slate-text/60 mt-1">Please do not close this window</p>
    </div>
  );
}

function SuccessView({ amount }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="py-10 text-center"
    >
      {/* Checkmark Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-10 h-10 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">Payment Successful!</h3>
      <p className="text-sm text-gray-500 dark:text-slate-text">{formatINR(amount)} paid successfully</p>
    </motion.div>
  );
}

