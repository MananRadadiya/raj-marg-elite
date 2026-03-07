import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/booking', label: 'Book a Ride' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/driver-portal', label: 'Driver Portal' },
];

const routes = [
  'Ahmedabad → Surat',
  'Ahmedabad → Vadodara',
  'Ahmedabad → Rajkot',
  'Surat → Mumbai',
  'Vadodara → Statue of Unity',
];

const socials = [
  {
    name: 'Twitter',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-white/30 dark:bg-charcoal-light/30 pt-16 pb-8 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 footer-border-pattern" />

      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/2 dark:bg-saffron/2 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-saffron to-gold flex items-center justify-center">
                <span className="text-charcoal font-display font-bold text-sm">RM</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-bold tracking-wider text-saffron dark:text-gold">
                  RAJ
                </span>
                <span className="font-display text-xl font-light tracking-wider">
                  MARG
                </span>
              </div>
            </div>
            <p className="text-sm text-charcoal/50 dark:text-slate-text leading-relaxed mb-6 max-w-xs">
              Gujarat's premium taxi service with transparent per-km pricing, verified drivers, and a fleet you can trust.
            </p>
            {/* Social Icons */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/5 dark:border-white/5 flex items-center justify-center text-charcoal/40 dark:text-slate-text hover:text-saffron dark:hover:text-gold hover:border-saffron/20 dark:hover:border-gold/20 transition-colors duration-300"
                  aria-label={s.name}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-charcoal/70 dark:text-white/70">
              Quick Links
            </h4>
            <ul className="space-y-3 list-none p-0">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-charcoal/50 dark:text-slate-text hover:text-saffron dark:hover:text-gold transition-colors duration-300 no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-charcoal/70 dark:text-white/70">
              Popular Routes
            </h4>
            <ul className="space-y-3 list-none p-0">
              {routes.map((route) => (
                <li key={route} className="text-sm text-charcoal/50 dark:text-slate-text">
                  {route}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-charcoal/70 dark:text-white/70">
              Contact
            </h4>
            <ul className="space-y-3 list-none p-0 text-sm text-charcoal/50 dark:text-slate-text">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-saffron/60 dark:text-gold/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-saffron/60 dark:text-gold/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                hello@rajmarg.in
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-saffron/60 dark:text-gold/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ahmedabad, Gujarat, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal/5 dark:border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-charcoal/30 dark:text-slate-text/50">
            © 2026 Raj Marg. All rights reserved.
          </span>
          <span className="text-xs text-charcoal/30 dark:text-slate-text/50">
            Crafted with precision in Gujarat — The Land of Legends
          </span>
        </div>
      </div>
    </footer>
  );
}
