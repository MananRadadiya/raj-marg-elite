import { motion } from 'framer-motion';

const reasons = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Verified Drivers',
    desc: 'Every driver undergoes rigorous background verification and continuous rating by real passengers.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderGlow: 'hover:border-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    desc: 'No surge pricing, ever. Fixed per-km rates with complete fare breakdown before you book.',
    gradient: 'from-saffron/20 to-saffron/5',
    borderGlow: 'hover:border-saffron/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: '24/7 Support',
    desc: 'Round-the-clock customer support across Gujarat — early morning flights or late night returns.',
    gradient: 'from-blue-500/20 to-blue-500/5',
    borderGlow: 'hover:border-blue-500/20',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Premium Fleet',
    desc: 'Meticulously maintained vehicles from budget-friendly to ultra-luxury, all sanitised and inspected.',
    gradient: 'from-gold/20 to-gold/5',
    borderGlow: 'hover:border-gold/20',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-saffron dark:text-gold mb-4"
          >
            Why Choose Us
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">Raj Marg</span> Difference
          </h2>
          <p className="text-charcoal/50 dark:text-slate-text max-w-xl mx-auto text-lg font-light leading-relaxed">
            Redefining premium travel across Gujarat with unmatched service standards
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative rounded-2xl p-6 backdrop-blur-xl border border-charcoal/5 dark:border-white/5 bg-white/50 dark:bg-white/3 transition-all duration-500 ${r.borderGlow} hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${r.gradient} dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-5 text-saffron dark:text-gold`}>
                {r.icon}
              </div>

              <h3 className="font-display text-lg font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-charcoal/50 dark:text-slate-text leading-relaxed">
                {r.desc}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-saffron/5 to-transparent dark:from-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
