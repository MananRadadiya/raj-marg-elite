import { useRef } from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';

export default function Invoice({ booking, payment, onClose }) {
  const printRef = useRef();

  if (!booking || !payment) return null;

  const fare = booking.fare || {};
  const subtotal = fare.total || 0;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '_blank', 'width=800,height=900');
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid #FF9933; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 800; color: #0F172A; }
            .brand span { color: #FF9933; }
            .subtitle { font-size: 11px; color: #94A3B8; margin-top: 4px; }
            .invoice-meta { text-align: right; font-size: 12px; color: #64748B; }
            .invoice-meta strong { color: #0F172A; display: block; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 600; margin-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .field { background: #F8FAFC; padding: 10px 14px; border-radius: 8px; }
            .field-label { font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
            .field-value { font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-weight: 600; }
            th:last-child { text-align: right; }
            td { padding: 10px 0; font-size: 13px; border-bottom: 1px solid #F1F5F9; }
            td:last-child { text-align: right; font-weight: 600; }
            .total-row td { border-bottom: none; border-top: 2px solid #FF9933; font-size: 16px; font-weight: 800; color: #FF9933; padding-top: 12px; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; }
            .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }
            .badge-success { background: #D1FAE5; color: #059669; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            Thank you for choosing Rajmarg Elite — Gujarat's Premium Taxi Service<br/>
            This is a computer-generated invoice. No signature required.
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-charcoal-light shadow-2xl"
      >
        {/* Printable Content */}
        <div ref={printRef} className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-[3px] border-saffron">
            <div>
              <h1 className="text-2xl font-extrabold text-charcoal dark:text-white">
                RAJMARG <span className="text-saffron dark:text-gold">ELITE</span>
              </h1>
              <p className="text-[11px] text-charcoal/40 dark:text-slate-text mt-1">Gujarat's Premium Taxi Service</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-charcoal/40 dark:text-slate-text">
                <strong className="text-charcoal dark:text-white block text-sm">TAX INVOICE</strong>
                {new Date(payment.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* IDs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <InvoiceField label="Booking ID" value={booking.id} />
            <InvoiceField label="Payment ID" value={payment.paymentId} />
            <InvoiceField label="Order ID" value={payment.orderId} />
            <InvoiceField label="Payment Method" value={payment.method} />
          </div>

          {/* Booking Details */}
          <div className="mb-5">
            <div className="text-[11px] uppercase tracking-[1.5px] text-charcoal/40 dark:text-slate-text font-semibold mb-2">
              Booking Details
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InvoiceField label="Route" value={`${booking.from} → ${booking.to}`} />
              <InvoiceField label="Trip Type" value={booking.tripType === 'round-trip' ? 'Round Trip' : 'One Way'} />
              <InvoiceField label="Vehicle" value={booking.carType} />
              <InvoiceField label="Driver Tier" value={booking.driverTier} />
              <InvoiceField label="Distance" value={`${booking.distance} km`} />
              {booking.passengerName && <InvoiceField label="Passenger" value={booking.passengerName} />}
            </div>
          </div>

          {/* Fare Breakdown Table */}
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-[1.5px] text-charcoal/40 dark:text-slate-text font-semibold mb-2">
              Fare Breakdown
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-charcoal/40 dark:text-slate-text border-b border-charcoal/10 dark:border-white/10">
                  <th className="text-left py-2 font-semibold">Description</th>
                  <th className="text-right py-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="text-charcoal dark:text-white">
                <tr className="border-b border-charcoal/5 dark:border-white/5">
                  <td className="py-2.5">Base Fare ({booking.distance} km × ₹{booking.perKm})</td>
                  <td className="py-2.5 text-right font-medium">{formatINR(fare.baseFare || fare.distanceFare || 0)}</td>
                </tr>
                {fare.driverSurcharge > 0 && (
                  <tr className="border-b border-charcoal/5 dark:border-white/5">
                    <td className="py-2.5">Driver Tier Surcharge ({fare.driverMultiplierPercent || 0}%)</td>
                    <td className="py-2.5 text-right font-medium">{formatINR(fare.driverSurcharge)}</td>
                  </tr>
                )}
                {fare.tollEstimate > 0 && (
                  <tr className="border-b border-charcoal/5 dark:border-white/5">
                    <td className="py-2.5">Toll Estimate</td>
                    <td className="py-2.5 text-right font-medium">{formatINR(fare.tollEstimate)}</td>
                  </tr>
                )}
                {fare.driverStayCharge > 0 && (
                  <tr className="border-b border-charcoal/5 dark:border-white/5">
                    <td className="py-2.5">Driver Stay Charge</td>
                    <td className="py-2.5 text-right font-medium">{formatINR(fare.driverStayCharge)}</td>
                  </tr>
                )}
                <tr className="border-b border-charcoal/5 dark:border-white/5">
                  <td className="py-2.5 font-medium">Subtotal</td>
                  <td className="py-2.5 text-right font-semibold">{formatINR(subtotal)}</td>
                </tr>
                <tr className="border-b border-charcoal/5 dark:border-white/5">
                  <td className="py-2.5">GST (5%)</td>
                  <td className="py-2.5 text-right font-medium">{formatINR(gst)}</td>
                </tr>
                <tr>
                  <td className="py-3 font-extrabold text-base border-t-2 border-saffron dark:border-gold text-saffron dark:text-gold">
                    Total Paid
                  </td>
                  <td className="py-3 text-right font-extrabold text-lg border-t-2 border-saffron dark:border-gold text-saffron dark:text-gold">
                    {formatINR(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✅ Payment Successful
            </span>
          </div>
        </div>

        {/* Action Buttons (not printed) */}
        <div className="px-6 pb-6 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl premium-gradient text-white font-semibold text-sm border-none cursor-pointer"
          >
            🖨️ Download Invoice
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-charcoal/5 dark:bg-charcoal-mid text-charcoal dark:text-white font-medium text-sm border-none cursor-pointer"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InvoiceField({ label, value }) {
  return (
    <div className="p-2.5 rounded-lg bg-cream-dark/50 dark:bg-charcoal-mid/50">
      <div className="text-[10px] uppercase tracking-[1px] text-charcoal/40 dark:text-slate-text/60">{label}</div>
      <div className="text-sm font-semibold text-charcoal dark:text-white mt-0.5 break-all">{value}</div>
    </div>
  );
}
