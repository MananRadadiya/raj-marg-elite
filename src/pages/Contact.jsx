import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToast } from '../redux/notificationSlice';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const SUPPORT_CARDS = [
  { icon: '🎧', title: 'Customer Support', desc: 'Get help with bookings, rides, and payments', phone: '1800-123-4567', email: 'support@rajmarg.com', hours: '24/7 Available', color: '#D4AF37' },
  { icon: '🏢', title: 'Corporate Sales', desc: 'Business accounts, bulk bookings, partnerships', phone: '+91 79 4567 8901', email: 'corporate@rajmarg.com', hours: 'Mon–Sat 9AM–6PM', color: '#3B82F6' },
  { icon: '🚗', title: 'Driver Support', desc: 'Join our fleet, onboarding, driver assistance', phone: '+91 79 4567 8902', email: 'drivers@rajmarg.com', hours: 'Mon–Sat 8AM–8PM', color: '#10B981' },
];

export default function Contact() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    dispatch(addToast({ message: 'Message sent! We\'ll respond within 24 hours.', type: 'info' }));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden hero-gradient">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Have questions? We&apos;d love to hear from you. Reach out and our team will respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-5">
            {SUPPORT_CARDS.map((card, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: card.color + '15' }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal dark:text-white">{card.title}</h3>
                    <div className="text-[11px] text-charcoal/50 dark:text-slate-text">{card.hours}</div>
                  </div>
                </div>
                <p className="text-sm text-charcoal/60 dark:text-slate-text mb-4">{card.desc}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📞</span>
                    <span className="font-medium text-charcoal dark:text-white">{card.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>✉️</span>
                    <span className="font-medium" style={{ color: card.color }}>{card.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Office Info */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div {...fadeUp} className="md:col-span-3 glass-card rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-charcoal dark:text-white">
                Send us a <span className="text-saffron dark:text-gold">Message</span>
              </h2>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-sm text-charcoal/60 dark:text-slate-text mb-4">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-saffron/10 text-saffron dark:text-gold border-none cursor-pointer hover:bg-saffron/20 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" required />
                    <InputField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="your@email.com" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 XXXXX XXXXX" />
                    <InputField label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Your message..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-bold premium-gradient text-charcoal border-none cursor-pointer hover:shadow-lg hover:shadow-saffron/20 transition-shadow"
                  >
                    Send Message →
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Office Info */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-5">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold mb-4 text-charcoal dark:text-white">
                  Head Office
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <div className="font-semibold text-charcoal dark:text-white">RajMarg Elite Pvt. Ltd.</div>
                      <div className="text-charcoal/60 dark:text-slate-text">
                        301, Shivalik Business Hub,<br />
                        SG Highway, Ahmedabad 380015,<br />
                        Gujarat, India
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📞</span>
                    <span className="text-charcoal dark:text-white font-medium">1800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✉️</span>
                    <span className="text-saffron dark:text-gold font-medium">info@rajmarg.com</span>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <iframe
                  title="RajMarg Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8!2d72.5!3d23.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAyJzI0LjAiTiA3MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-sm mb-3 text-charcoal dark:text-white">Follow Us</h3>
                <div className="flex gap-3">
                  {['📘 Facebook', '📸 Instagram', '🐦 Twitter', '💼 LinkedIn'].map((s) => (
                    <span key={s} className="text-xs text-charcoal/50 dark:text-slate-text hover:text-saffron dark:hover:text-gold cursor-pointer transition-colors">
                      {s.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50"
      />
    </div>
  );
}
