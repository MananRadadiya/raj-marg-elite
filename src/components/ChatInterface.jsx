import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, receiveDriverReply, setTyping } from '../redux/chatSlice';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_MESSAGES = [
  'I\'m at the pickup point',
  'How far are you?',
  'Please call me',
  'I have extra luggage',
  'Change pickup location',
];

export default function ChatInterface({ driverName, driverPhoto, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { messages, isTyping } = useSelector((s) => s.chat);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    dispatch(sendMessage(msg));
    setInput('');

    // Simulate driver typing + reply
    setTimeout(() => {
      dispatch(setTyping(true));
    }, 500);
    setTimeout(() => {
      dispatch(receiveDriverReply());
    }, 1500 + Math.random() * 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-charcoal-light border border-charcoal/10 dark:border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-charcoal to-royal-navy text-white">
            <img src={driverPhoto || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Driver"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold/30" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{driverName || 'Your Driver'}</div>
              <div className="text-[10px] text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
              </div>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white bg-transparent border-none cursor-pointer text-lg">×</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-64 overflow-y-auto p-4 space-y-3 bg-cream-dark/50 dark:bg-charcoal/50">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-saffron to-gold text-charcoal rounded-br-md'
                    : 'bg-white dark:bg-charcoal-mid text-charcoal dark:text-white rounded-bl-md shadow-sm'
                }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-charcoal/40' : 'text-charcoal/30 dark:text-slate-text/50'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white dark:bg-charcoal-mid rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-charcoal/30 dark:bg-slate-text"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Messages */}
          <div className="px-3 py-2 border-t border-charcoal/5 dark:border-white/5 flex gap-1.5 overflow-x-auto">
            {QUICK_MESSAGES.map((qm) => (
              <button key={qm} onClick={() => handleSend(qm)}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text border-none cursor-pointer hover:bg-saffron/10 hover:text-saffron dark:hover:text-gold transition-colors whitespace-nowrap">
                {qm}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-charcoal/5 dark:border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl premium-gradient flex items-center justify-center border-none cursor-pointer"
            >
              <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
