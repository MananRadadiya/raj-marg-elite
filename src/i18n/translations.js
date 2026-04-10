const translations = {
  en: {
    nav: { home: 'Home', booking: 'Book Ride', drivers: 'Drivers', dashboard: 'Dashboard', track: 'Track Ride', admin: 'Admin', login: 'Login', register: 'Register', logout: 'Logout', profile: 'Profile', tours: 'Tour Packages' },
    hero: { title: 'Travel Gujarat in', highlight: 'Royal Comfort', subtitle: 'Premium intercity taxi service with verified drivers, luxury vehicles, and transparent pricing.', cta: 'Book Now', secondary: 'Explore Rides' },
    booking: { title: 'Book Your', highlight: 'Ride', subtitle: 'Complete your booking in 3 easy steps', from: 'From', to: 'To', passengers: 'Passengers', schedule: 'Schedule for Later', date: 'Date', time: 'Time', next: 'Next', back: 'Back', confirm: 'Proceed to Payment' },
    common: { search: 'Search', apply: 'Apply', cancel: 'Cancel', save: 'Save', delete: 'Delete', edit: 'Edit', close: 'Close', loading: 'Loading...', noResults: 'No results found' },
    sos: { title: 'Emergency SOS', subtitle: 'Your safety is our priority', calling: 'Calling emergency services...', police: 'Police', ambulance: 'Ambulance', support: 'RajMarg Support', shareLocation: 'Share Live Location' },
  },
  hi: {
    nav: { home: 'होम', booking: 'राइड बुक करें', drivers: 'ड्राइवर', dashboard: 'डैशबोर्ड', track: 'राइड ट्रैक', admin: 'एडमिन', login: 'लॉगिन', register: 'रजिस्टर', logout: 'लॉगआउट', profile: 'प्रोफ़ाइल', tours: 'टूर पैकेज' },
    hero: { title: 'गुजरात में यात्रा करें', highlight: 'शाही आराम', subtitle: 'प्रीमियम इंटरसिटी टैक्सी सेवा — सत्यापित ड्राइवर, लक्जरी वाहन, पारदर्शी मूल्य।', cta: 'अभी बुक करें', secondary: 'राइड देखें' },
    booking: { title: 'अपनी', highlight: 'राइड बुक करें', subtitle: '3 आसान चरणों में बुकिंग पूरी करें', from: 'कहाँ से', to: 'कहाँ तक', passengers: 'यात्री', schedule: 'बाद के लिए शेड्यूल', date: 'तारीख', time: 'समय', next: 'आगे', back: 'पीछे', confirm: 'भुगतान करें' },
    common: { search: 'खोजें', apply: 'लागू करें', cancel: 'रद्द करें', save: 'सेव करें', delete: 'हटाएं', edit: 'संपादित करें', close: 'बंद करें', loading: 'लोड हो रहा है...', noResults: 'कोई परिणाम नहीं' },
    sos: { title: 'आपातकालीन SOS', subtitle: 'आपकी सुरक्षा हमारी प्राथमिकता', calling: 'आपातकालीन सेवाओं को कॉल किया जा रहा है...', police: 'पुलिस', ambulance: 'एम्बुलेंस', support: 'राजमार्ग सहायता', shareLocation: 'लाइव लोकेशन शेयर करें' },
  },
  gu: {
    nav: { home: 'હોમ', booking: 'રાઈડ બુક કરો', drivers: 'ડ્રાઈવર', dashboard: 'ડેશબોર્ડ', track: 'રાઈડ ટ્રેક', admin: 'એડમિન', login: 'લોગિન', register: 'રજિસ્ટર', logout: 'લોગઆઉટ', profile: 'પ્રોફાઈલ', tours: 'ટૂર પેકેજ' },
    hero: { title: 'ગુજરાતમાં મુસાફરી કરો', highlight: 'શાહી આરામ', subtitle: 'પ્રીમિયમ ઇન્ટરસિટી ટેક્સી સેવા — ચકાસાયેલ ડ્રાઈવર, લક્ઝરી વાહન, પારદર્શક ભાવ।', cta: 'હવે બુક કરો', secondary: 'રાઈડ જુઓ' },
    booking: { title: 'તમારી', highlight: 'રાઈડ બુક કરો', subtitle: '3 સરળ પગલાંમાં બુકિંગ પૂર્ણ કરો', from: 'ક્યાંથી', to: 'ક્યાં સુધી', passengers: 'મુસાફર', schedule: 'પછી માટે શેડ્યૂલ', date: 'તારીખ', time: 'સમય', next: 'આગળ', back: 'પાછળ', confirm: 'પેમેન્ટ કરો' },
    common: { search: 'શોધો', apply: 'લાગુ કરો', cancel: 'રદ કરો', save: 'સેવ', delete: 'કાઢો', edit: 'ફેરફાર કરો', close: 'બંધ', loading: 'લોડ થઈ રહ્યું છે...', noResults: 'કોઈ પરિણામ નથી' },
    sos: { title: 'ઇમરજન્સી SOS', subtitle: 'તમારી સુરક્ષા અમારી પ્રાથમિકતા', calling: 'ઇમરજન્સી સેવાઓને કૉલ કરી રહ્યા છીએ...', police: 'પોલીસ', ambulance: 'એમ્બ્યુલન્સ', support: 'રાજમાર્ગ સહાય', shareLocation: 'લાઈવ લોકેશન શેર કરો' },
  },
};

export function t(lang, path) {
  const keys = path.split('.');
  let result = translations[lang] || translations.en;
  for (const key of keys) {
    result = result?.[key];
  }
  return result || path;
}

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🏴' },
];

export default translations;
