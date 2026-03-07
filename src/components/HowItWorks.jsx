import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Select Ride',
    description: 'Choose your pickup, drop-off, vehicle type, and driver tier. Get an instant fare quote.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Confirm Booking',
    description: 'Review your fare breakdown, confirm details, and complete secure payment via Razorpay.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Enjoy Royal Travel',
    description: 'Your verified driver arrives on time. Sit back in a premium vehicle and enjoy the ride.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-100 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-saffron dark:text-gold mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Three Simple{' '}
            <span className="bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">
              Steps
            </span>
          </h2>
          <p className="text-charcoal/50 dark:text-slate-text max-w-xl mx-auto text-lg font-light leading-relaxed">
            From booking to boarding — a seamless experience in minutes
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-linear-to-r from-saffron/20 via-gold/40 to-saffron/20 dark:from-gold/20 dark:via-gold/40 dark:to-gold/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* Step Number Circle */}
                <div className="relative inline-flex mb-8">
                  <div className="w-32 h-32 rounded-full bg-white/60 dark:bg-white/3 backdrop-blur-xl border border-charcoal/5 dark:border-white/5 flex items-center justify-center">
                    <div className="text-saffron dark:text-gold">
                      {s.icon}
                    </div>
                  </div>
                  {/* Step badge */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-linear-to-br from-saffron to-gold flex items-center justify-center text-charcoal text-xs font-bold">
                    {s.step}
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-charcoal/50 dark:text-slate-text leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
