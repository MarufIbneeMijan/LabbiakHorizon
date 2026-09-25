export const LABBAIK_JOURNEY_TIERS = [
  {
    id: "kiswah_sanctum",
    title: "The Kiswah Presidential Sanctum",
    subtitle: "Peak Exclusivity & Presidential Ka'aba View Penthouse",
    badge: "Peak Exclusivity",
    priceBDT: 1250000,
    priceUSD: 10500,
    makkahHotel: "Raffles Makkah Palace / Fairmont Royal Penthouse",
    madinahHotel: "The Oberoi Madinah (Royal Suite)",
    transfers: "Dedicated Private GMC Yukon Denali / Maybach 24/7",
    scholar: "Private 1-on-1 Eminent Islamic Scholar (Moallim)",
    features: [
      "Panoramic Direct Ka'aba View Clock Tower Presidential Penthouse",
      "Dedicated Private GMC Yukon Denali / Maybach Fleet Available 24/7",
      "Private 1-on-1 Eminent Islamic Scholar Companion (Moallim)",
      "Diplomatic CIP Express Fast-Track at Dhaka (DAC) & Jeddah (JED)",
      "Haramain High-Speed Bullet Train VIP First Class Private Cabin",
      "In-Suite Live Haram Audio Feed & Private Butler Service"
    ],
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "rawdah_grandeur",
    title: "The Rawdah Executive Grandeur",
    tagline: "5-Star Courtyard Luxury & Scholar Escort",
    badge: "5-Star Luxury",
    priceBDT: 680000,
    priceUSD: 5800,
    makkahHotel: "Swissôtel Al Maqam / Pullman Zamzam Tower",
    madinahHotel: "Dar Al Taqwa / Anwar Al Madinah Mövenpick",
    transfers: "Private AC Luxury GMC Transfer",
    scholar: "Small Group Scholar Chaperone",
    features: [
      "Direct Haram Courtyard Access Elevator from Hotel Lobby",
      "Haramain High-Speed Bullet Train VIP First Class Pass",
      "Dedicated Small Group Scholar Chaperone for Tawaf & Rawdah",
      "Airport CIP Fast-Track Assistance & Lounge Access",
      "Buffet Suhoor & Iftar Fine Dining in Makkah & Madinah",
      "Guaranteed 5L Zamzam Delivered to Residence"
    ],
    image: "https://images.unsplash.com/photo-1565552070098-0073a1c207bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bespoke_delegation",
    title: "Bespoke Royal Delegation",
    tagline: "Custom Family Delegation & Private Charter",
    badge: "Custom Pilgrimage",
    priceBDT: 2450000,
    priceUSD: 20000,
    isCustomPrice: true,
    makkahHotel: "Tailored Royal Penthouse or Private Palace",
    madinahHotel: "The Oberoi / Madinah Royal Villa",
    transfers: "Private Charter Jet & Armored Maybach Fleet",
    scholar: "Senior Islamic Jurisprudence Scholar & Physician",
    features: [
      "Completely Tailored Multi-Family Delegation Flight Charter",
      "Dedicated Private Butler & Private Medical Escort",
      "Custom Historical Excursions to Taif & Ancient Sites",
      "Confidential Itinerary Scheduling & Private Lounge Access",
      "24/7 Concierge Hotline & VIP Protocol Escort",
      "Curated Relics & Premium Ajwa Dates Home Delivery"
    ],
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
  }
];

export const SEASON_HORIZONS = [
  { id: "ramadan", label: "Ramadan (Last 10 Days of Lailatul Qadr)" },
  { id: "winter", label: "Winter Sacred Months (Dec - Feb)" },
  { id: "hajj", label: "Royal VIP Hajj (Shifting-Free / Clock Tower)" }
];

export const PARTY_SIZES = [
  { id: "solo", label: "Solo Pilgrim (1 Person)", multiplier: 1 },
  { id: "couple", label: "Couple (2 Persons)", multiplier: 2 },
  { id: "family", label: "Family Delegation (4-6 Persons)", multiplier: 5 },
  { id: "royal", label: "Royal Private Party (8+ Persons)", multiplier: 8 }
];

export const FLIGHT_TIERS = [
  { id: "first_suite", label: "First Class Suite (Emirates / Saudia)", extraBDT: 250000 },
  { id: "business_direct", label: "Business Class Direct (Biman / Saudia)", extraBDT: 120000 }
];

export const ROYAL_SUITES = [
  {
    name: "Raffles Makkah Palace",
    subtitle: "Panoramic Ka'aba View Penthouse",
    location: "Makkah Clock Tower • 0m Direct Courtyard Entry",
    stars: 5,
    highlights: ["Panoramic Direct View of Holy Ka'aba", "Private 24-hr Dedicated Butler", "In-Suite Live Haram Audio Feed", "Exclusive Dining Suhoor & Iftar"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "The Oberoi Madinah",
    subtitle: "Royal Suite • Steps to the Prophet's Mosque",
    location: "Madinah Central • 0m Steps to Al-Masjid an-Nabawi",
    stars: 5,
    highlights: ["Direct Courtyard Access Steps", "Fast-Track Rawdah Permit Access", "Private Concierge Assistance", "Signature Oberoi 5-Star Dining"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Swissôtel Al Maqam",
    subtitle: "Direct Haram Courtyard Elevator Suite",
    location: "Makkah Clock Tower Complex",
    stars: 5,
    highlights: ["Direct Elevator to Haram Courtyard", "In-Suite Live Ka'aba Audio Receiver", "Gourmet International Buffet", "24/7 VIP Chauffeur Transfer"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
  }
];

export const CONCIERGE_PILLARS = [
  {
    id: 1,
    title: "Diplomatic CIP Fast-Track",
    desc: "Airport express immigration, VIP lounge access, and private luxury fleet transfers at Dhaka (DAC) and Jeddah (JED).",
    icon: "Plane"
  },
  {
    id: 2,
    title: "Eminent Scholar Accompaniment",
    desc: "Knowledgeable, respectful scholars offering private fiqh and step-by-step guidance for Tawaf, Sa'i, and Rawdah.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "Zero-Effort Documentation",
    desc: "Complete handling of visas, Nusuk appointments, biometric registrations, and health documentation.",
    icon: "Sparkles"
  },
  {
    id: 4,
    title: "Sacred Zamzam & Dates Delivery",
    desc: "Certified 5-liter Zamzam water and premium Ajwa dates packed and delivered straight to the pilgrim's residence.",
    icon: "Gem"
  }
];

export const DIGNITARY_TESTIMONIALS = [
  {
    quote: "LabbaikHorizon delivered a sacred journey of unprecedented serenity. Staying at the Raffles Ka'aba Penthouse with an in-suite audio feed allowed my elderly father to participate seamlessly in every prayer.",
    author: "Al-Haj Syful Islam Chowdhury",
    designation: "Chairman, National Industrial Group",
    packageTaken: "Kiswah Presidential Sanctum",
    rating: 5
  },
  {
    quote: "The diplomatic CIP fast-track at Shahjalal Airport and private GMC Yukon transfer in Jeddah eliminated every point of friction. Their scholar guided our family with extraordinary grace.",
    author: "Dr. Farhana Rahman",
    designation: "Managing Director, Global Health Enterprise",
    packageTaken: "Rawdah Executive Grandeur",
    rating: 5
  },
  {
    quote: "Absolute discretion, punctual luxury, and flawless Nusuk scheduling. The team at LabbaikHorizon sets the benchmark for high-net-worth spiritual travel.",
    author: "Engr. Mahmudul Hassan",
    designation: "Director, Infrastructure & Real Estate Group",
    packageTaken: "Bespoke Royal Delegation",
    rating: 5
  }
];

export const AGENCY_CREDENTIALS = {
  name: "LabbaikHorizon",
  tagline: "Ultra-Luxury Kiswah Pilgrimage Concierge",
  hotline: "+880 1800-LABBAIK",
  phoneAlt: "+880 1700-000000",
  email: "vip@labbaikhorizon.com",
  moraReg: "HAAB-1420",
  atabReg: "09823",
  address: "Level 6, Horizon Tower, Gulshan-2, Dhaka-1212, Bangladesh"
};
