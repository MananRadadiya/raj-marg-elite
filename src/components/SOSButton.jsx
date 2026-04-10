import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMERGENCY_CONTACTS = [
  { id: 'police', label: 'Police', number: '100', icon: '🚔', color: '#EF4444', description: 'Local police emergency' },
  { id: 'ambulance', label: 'Ambulance', number: '108', icon: '🚑', color: '#F97316', description: 'Medical emergency' },
  { id: 'women', label: 'Women Helpline', number: '1091', icon: '👩', color: '#A855F7', description: 'Women safety helpline' },
  { id: 'highway', label: 'Highway Patrol', number: '1033', icon: '🛣️', color: '#3B82F6', description: 'Road accident / breakdown' },
  { id: 'rajmarg', label: 'RajMarg Support', number: '1800-XXX-XXXX', icon: '🛡️', color: '#D4AF37', description: '24/7 customer support' },
];

export default function SOSButton({ driverName, bookingId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(null);
  const [locationShared, setLocationShared] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Countdown for auto-trigger
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setSosTriggered(true);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSOSPress = () => {
    setIsOpen(true);
    setCountdown(5); // 5 second countdown before auto-alert
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCountdown(null);
    setIsCalling(null);
    setSosTriggered(false);
    setLocationShared(false);
  };

  const handleCall = (contact) => {
    setIsCalling(contact);
    setCountdown(null);
    // Simulate call
    setTimeout(() => {
      setIsCalling(null);
    }, 3000);
  };

  const handleShareLocation = () => {
    setLocationShared(true);
    // Simulate sending location
    setTimeout(() => {
      setLocationShared('sent');
    }, 1500);
  };

  return (
    <>
      {/* SOS Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSOSPress}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white border-4 border-red-300/50 shadow-2xl shadow-red-500/40 cursor-pointer flex items-center justify-center group"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-center leading-none">
          <div className="text-xs font-black tracking-wider">SOS</div>
        </div>
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop — red pulsing */}
            <motion.div
              animate={{ opacity: [0.7, 0.8, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-b from-red-900/90 to-black/95 backdrop-blur-xl"
              onClick={handleCancel}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-charcoal-light border border-red-500/30 shadow-2xl shadow-red-500/20 overflow-hidden"
            >
              {/* Red Top Bar */}
              <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

              {/* Header */}
              <div className="p-6 text-center">
                {/* SOS Icon */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 items-center justify-center mb-4 shadow-xl shadow-red-500/30"
                >
                  <span className="text-3xl font-black text-white">SOS</span>
                </motion.div>

                <h2 className="font-display text-2xl font-bold text-white mb-1">
                  Emergency SOS
                </h2>
                <p className="text-sm text-red-200/70">
                  Your safety is our highest priority
                </p>

                {/* Countdown */}
                {countdown !== null && !sosTriggered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30"
                  >
                    <div className="text-xs text-red-300 mb-1">Auto-alerting emergency in</div>
                    <motion.div
                      key={countdown}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-black text-red-400"
                    >
                      {countdown}
                    </motion.div>
                    <button
                      onClick={handleCancel}
                      className="mt-2 text-xs text-white/50 underline bg-transparent border-none cursor-pointer hover:text-white/80"
                    >
                      Cancel — I&apos;m safe
                    </button>
                  </motion.div>
                )}

                {/* SOS Triggered */}
                {sosTriggered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30"
                  >
                    <div className="text-green-400 font-semibold text-sm">✓ Emergency Alert Sent</div>
                    <div className="text-xs text-green-300/70 mt-1">
                      RajMarg support team has been notified. Help is on the way.
                    </div>
                  </motion.div>
                )}

                {/* Calling State */}
                {isCalling && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-charcoal-mid border border-white/10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-3xl mb-2"
                    >
                      📞
                    </motion.div>
                    <div className="text-white font-semibold">Calling {isCalling.label}...</div>
                    <div className="text-sm text-slate-text">{isCalling.number}</div>
                  </motion.div>
                )}
              </div>

              {/* Emergency Contacts */}
              <div className="px-6 pb-2">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                  Emergency Contacts
                </div>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((contact) => (
                    <motion.button
                      key={contact.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(contact)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-charcoal-mid/50 border border-white/5 hover:border-red-500/20 cursor-pointer transition-all text-left"
                      style={{ borderLeftColor: contact.color, borderLeftWidth: '3px' }}
                    >
                      <span className="text-2xl">{contact.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{contact.label}</div>
                        <div className="text-[11px] text-slate-text">{contact.description}</div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: contact.color }}>
                        {contact.number}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Share Location */}
              <div className="px-6 py-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleShareLocation}
                  disabled={locationShared === 'sent'}
                  className={`w-full py-3 rounded-xl text-sm font-bold border-none cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    locationShared === 'sent'
                      ? 'bg-green-600/20 text-green-400 cursor-default'
                      : locationShared
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20 hover:shadow-xl'
                  }`}
                >
                  {locationShared === 'sent' ? (
                    <>✓ Location Shared with Emergency Contacts</>
                  ) : locationShared ? (
                    <>Sharing location...</>
                  ) : (
                    <>📍 Share Live Location</>
                  )}
                </motion.button>
              </div>

              {/* Ride Info */}
              {(driverName || bookingId) && (
                <div className="px-6 pb-4">
                  <div className="p-3 rounded-xl bg-charcoal-mid/30 border border-white/5">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
                      Current Ride Details
                    </div>
                    {bookingId && (
                      <div className="text-xs text-slate-text">
                        Booking: <span className="text-white font-mono">{bookingId}</span>
                      </div>
                    )}
                    {driverName && (
                      <div className="text-xs text-slate-text mt-0.5">
                        Driver: <span className="text-white">{driverName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleCancel}
                  className="w-full py-2.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Close — I&apos;m Safe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
