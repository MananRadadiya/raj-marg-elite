const faqData = [
  {
    category: 'Booking',
    icon: '🚕',
    questions: [
      {
        q: 'How do I book a ride?',
        a: 'Simply select your pickup and drop-off cities, choose your preferred car category and driver tier, review the fare, and confirm your booking. You can also use our AI Mode for smart recommendations.',
      },
      {
        q: 'Can I book a ride for someone else?',
        a: 'Yes! During the booking process, you can enter the passenger\'s name and phone number. They will receive ride updates directly.',
      },
      {
        q: 'Can I schedule a ride in advance?',
        a: 'Absolutely. Use the "Schedule Ride" toggle in the booking wizard to pick a future date and time. Your ride will be automatically assigned to a driver at the scheduled time.',
      },
      {
        q: 'What cities do you cover?',
        a: 'We cover 22+ cities across Gujarat including Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Dwarka, Somnath, Kutch, and more. We also offer Mumbai transfers.',
      },
      {
        q: 'Can I add multiple stops to my trip?',
        a: 'Yes, you can add up to 3 intermediate stops during booking. The fare is calculated based on the total distance including all stops.',
      },
      {
        q: 'What is a round trip?',
        a: 'A round trip books the same driver for your outward and return journey. For long distances (>250 km one-way), a ₹800 driver stay charge applies.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: '💳',
    questions: [
      {
        q: 'What payment methods are supported?',
        a: 'We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash. Online payments are processed securely through Razorpay.',
      },
      {
        q: 'How are fares calculated?',
        a: 'Fare = (Distance × Per-KM Rate × Driver Tier Multiplier) + Toll Charges + Driver Stay Charge (if applicable). You can see a detailed breakdown before confirming.',
      },
      {
        q: 'Do you have any promo codes?',
        a: 'Yes! We regularly offer promotional discounts. Enter your promo code on the payment page to apply the discount. Follow us on social media for the latest offers.',
      },
      {
        q: 'Can I get a receipt?',
        a: 'Yes, a detailed invoice is generated after every payment. You can download it as a PDF from your dashboard or the payment confirmation page.',
      },
      {
        q: 'Is there a cancellation fee?',
        a: 'Cancellations made more than 1 hour before the scheduled pickup are free. Cancellations within 1 hour may incur a 10% fee.',
      },
    ],
  },
  {
    category: 'Cancellation',
    icon: '❌',
    questions: [
      {
        q: 'How do I cancel a ride?',
        a: 'Go to your Dashboard, find the booking you wish to cancel, and click "Cancel Booking". You\'ll receive a confirmation immediately.',
      },
      {
        q: 'Will I get a refund if I cancel?',
        a: 'For cancellations made more than 1 hour before pickup, you receive a full refund. Late cancellations may have a 10% fee deducted.',
      },
      {
        q: 'Can the driver cancel my ride?',
        a: 'In rare cases, a driver may be unable to fulfill a ride due to emergencies. In such cases, we immediately assign another driver at no extra cost.',
      },
    ],
  },
  {
    category: 'Drivers',
    icon: '👨‍✈️',
    questions: [
      {
        q: 'How are drivers verified?',
        a: 'Every driver undergoes a 7-point verification: government ID, driving license, vehicle registration, insurance, criminal background check, medical fitness, and a driving skill test.',
      },
      {
        q: 'What are driver tiers?',
        a: 'Drivers are ranked into 4 tiers — Bronze, Silver, Gold, and Platinum — based on their experience, ratings, and number of completed rides. Higher tiers provide premium service with a small fare multiplier.',
      },
      {
        q: 'Can I choose my driver?',
        a: 'You can choose the driver tier (Bronze, Silver, Gold, Platinum) during booking. The specific driver is auto-assigned based on availability.',
      },
      {
        q: 'How do I rate my driver?',
        a: 'After your ride is completed, you\'ll be prompted to rate your driver on a 1–5 star scale. You can also leave a written review.',
      },
    ],
  },
  {
    category: 'Safety',
    icon: '🛡️',
    questions: [
      {
        q: 'Is it safe to travel with RajMarg Elite?',
        a: 'Absolutely. All rides are GPS-tracked, drivers are fully verified, vehicles are inspected regularly, and we provide 24/7 customer support with an SOS emergency button.',
      },
      {
        q: 'What is the SOS button?',
        a: 'During an active ride, the SOS button on the Live Tracking page instantly alerts our emergency response team, shares your live location, and provides quick access to emergency services (police, ambulance).',
      },
      {
        q: 'Are vehicles cleaned and sanitized?',
        a: 'Yes, all vehicles are sanitized after every ride. Premium and Luxury vehicles undergo additional deep cleaning daily.',
      },
      {
        q: 'What if I leave something in the car?',
        a: 'Contact our support team immediately with your booking ID. We\'ll coordinate with the driver to return your belongings.',
      },
    ],
  },
];

export default faqData;
