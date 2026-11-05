export function applyTieredMarkup(basePrice) {
  if (!basePrice || typeof basePrice !== 'number') return 0;
  if (basePrice > 1500) return basePrice + 150;
  if (basePrice >= 900 && basePrice <= 1500) return basePrice + 100;
  return basePrice + 50;
}

export const DICTIONARY = {
  en: {
    topBar: {
      mora: "MoRA Approved Agency: HAAB-1420",
      shariah: "100% Shariah-Compliant Services",
      diplomatic: "Hassle-Free Airport VIP Fast-Track",
      hotline: "Hotline: +880 1800-LABBAIK",
      briefingBtn: "Book Consultation",
      langSwitch: "বাংলা"
    },
    nav: {
      packages: "Packages",
      fleet: "Transport Fleet",
      store: "Pilgrim Essentials",
      faq: "FAQ",
      vipDossier: "Book Package",
      cart: "Cart",
      suites: "Hotel Suites",
      curator: "Custom Tour Builder",
      customBooking: "Custom Booking",
      pillars: "Our Commitments",
      testimonials: "Pilgrim Reviews",
      lounge: "Gulshan Lounge",
      admin: "Admin CMS",
      requestDossier: "Inquire Now"
    },
    hero: {
      badge: "Trusted Hajj & Umrah Agency • MoRA License HAAB-1420",
      headlineMain: "Your Sacred Pilgrimage,",
      headlineGold: "Arranged with Care & Dignity",
      subheading: "Serving pilgrims with direct flights, 5-star courtyard hotels, Bengali meals, and seasoned scholar guidance every step of the journey.",
      primaryCta: "Explore Packages",
      secondaryCta: "Build Custom Package",
      perk1: "5-Star Hotels Near Haram Courtyard",
      perk2: "Bullet Train & AC VIP Chauffeur",
      perk3: "Experienced Scholar Escort",
      trust1: "MoRA Certified HAAB-1420",
      trust2: "Fast-Track DAC & JED Airport Support",
      trust3: "Horizon Office, Gulshan-2, Dhaka",
      trust4: "100% Shariah Compliant"
    },
    curator: {
      badge: "Easy Custom Tour Builder",
      titleMain: "Plan Your Custom",
      titleGold: "Hajj & Umrah Tour",
      subheading: "Select your preferred hotel category, travel season, and family delegation size in three simple steps with instant budget calculations.",
      step1Title: "Step 1: Select Hotel & Comfort Tier",
      step1Desc: "Choose your 5-star suite or premium comfort preference",
      step2Title: "Step 2: Dates & Traveling Group",
      step2Desc: "Select travel season, group size, and flight cabin class",
      step3Title: "Step 3: Instant Estimation & Booking",
      seasonLabel: "1. Preferred Travel Season",
      partyLabel: "2. Traveling Family / Group Size",
      flightLabel: "3. Flight Cabin Class",
      estLabel: "Estimated Package Budget",
      requestBtn: "Request Free Package Consultation",
      whatsappBtn: "Chat Directly on WhatsApp",
      disclaimer: "No Obligation • Visit Our Gulshan-2 Lounge or Consult via Phone",
      indicativeLabel: "Estimated Package Investment",
      perGuest: "/ person"
    },
    packages: {
      badge: "MoRA Licensed & Verified Pilgrimage Packages",
      titleMain: "All-Inclusive Hajj & Umrah",
      titleGold: "Featured Packages",
      subheading: "Complete all-inclusive packages with direct flights, 0m-50m Haram courtyard hotels, Bengali meals, and seasoned scholar guides.",
      tabUmrah: "Umrah Packages",
      tabHajj: "Hajj Packages",
      popularBadge: "Most Popular",
      selectPackageBtn: "Book This Package",
      customWizardBtn: "Or Build a Custom Journey"
    },
    fleet: {
      badge: "Verified Private Chauffeur & Logistics",
      titleMain: "Private AC Fleet &",
      titleGold: "VIP Transport Services",
      subheading: "Reliable airport pickups, intercity transfers between Makkah and Madinah, and historical Ziyarah tours with professional courteous drivers.",
      selectRouteTitle: "1. Select Transport Route",
      selectRouteDesc: "Choose airport arrival, intercity journey, Ziyarah, or full tour transport",
      selectVehicleTitle: "2. Select Vehicle & Passenger Capacity",
      selectVehicleDesc: "Transparent pricing in Saudi Riyal (SAR), BDT (৳), and USD ($)",
      basePriceLabel: "Standard Saudi Rate",
      markupApplied: "Service Margin Included",
      finalSarPrice: "Total Transparent Price",
      passengers: "Passengers",
      luggage: "Luggage Bags",
      reserveBtn: "Reserve This Vehicle",
      selectedCount: "Selected Route",
      confirmBtn: "Confirm Transport Booking"
    },
    suites: {
      badge: "Selected Sanctuary Suites",
      titleMain: "5-Star Courtyard Hotels &",
      titleGold: "Panoramic Haram Suites",
      subheading: "Prime allotments in Makkah and Madinah featuring direct courtyard elevators, clock tower view suites, and round-the-clock room service.",
      reserveBtn: "Reserve Suite with LabbaikHorizon"
    },
    pillars: {
      badge: "Our Four Guiding Principles",
      titleMain: "The Standards of",
      titleGold: "LabbaikHorizon",
      subheading: "Every aspect of your pilgrimage is executed with punctuality, absolute respect, and uncompromising spiritual reverence."
    },
    faq: {
      badge: "Helpful Answers For Pilgrims",
      titleMain: "Frequently Asked",
      titleGold: "Questions & Guidance",
      subheading: "Clear answers on Nusuk Rawdah permits, scholar escorts, private GMC transport, and Zamzam delivery in Dhaka."
    },
    testimonials: {
      badge: "Pilgrim Experiences",
      titleMain: "Trusted by Respected",
      titleGold: "Pilgrims & Families",
      subheading: "Hear heartfelt feedback from business leaders, professionals, and families who completed their pilgrimage with us."
    },
    footer: {
      loungeBadge: "Gulshan Client Desk",
      loungeTitle: "Gulshan-2 Private Consultation Office",
      loungeSub: "We warmly welcome you and your family for tea or coffee to plan your Hajj or Umrah journey in a relaxed, private setting.",
      loungeHours: "10:00 AM - 8:00 PM • Prior Appointment Always Welcome",
      bookMeetingBtn: "Book Office Appointment",
      whatsappBtn: "Chat Directly on WhatsApp",
      addressTitle: "Office Address & Hotline",
      privilegesTitle: "Pilgrim Services",
      rights: "LabbaikHorizon. All rights reserved."
    },
    modal: {
      dossierTitle: "Package Booking & Consultation",
      dossierSub: "LabbaikHorizon • Gulshan-2, Dhaka",
      nameLabel: "Your Full Name *",
      phoneLabel: "Phone / WhatsApp Number (+880) *",
      seasonLabel: "Preferred Travel Month / Season",
      briefingLabel: "Preferred Consultation Mode",
      notesLabel: "Special Requests or Family Notes (Optional)",
      submitBtn: "Submit Booking Request",
      successTitle: "Booking Request Received",
      successMsg: "JazakAllah Khair. Our client relations director will contact you promptly to finalize your booking details.",
      closeBtn: "Close Window"
    }
  },

  bn: {
    topBar: {
      mora: "ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত: HAAB-1420",
      shariah: "১০০% শরীয়াহ-সম্মত সেবা",
      diplomatic: "সহজ ও দ্রুত এয়ারপোর্ট সার্ভিস",
      hotline: "হটলাইন: +880 1800-LABBAIK",
      briefingBtn: "পরামর্শের জন্য যোগাযোগ করুন",
      langSwitch: "English"
    },
    nav: {
      packages: "প্যাকেজ সমূহ",
      fleet: "প্রাইভেট ট্রান্সপোর্ট",
      store: "অনলাইন শপ",
      faq: "সাধারণ জিজ্ঞাসা",
      vipDossier: "প্যাকেজ বুকিং",
      cart: "কার্ট",
      suites: "হোটেল ও স্যুইট",
      curator: "কাস্টম প্যাকেজ তৈরি",
      customBooking: "কাস্টম বুকিং",
      pillars: "আমাদের অঙ্গীকার",
      testimonials: "হাজী সাহেবানদের মতামত",
      lounge: "গুলশান অফিস",
      admin: "অ্যাডমিন পোর্টাল",
      requestDossier: "বুকিং আলোচনা"
    },
    hero: {
      badge: "মোরা লাইসেন্সপ্রাপ্ত অনুমোদিত এজেন্সি • HAAB-1420",
      headlineMain: "পবিত্র উমরাহ ও হজ কাফেলা,",
      headlineGold: "মর্যাদাপূর্ণ ও আরামদায়ক সফর",
      subheading: "বিনা ঝামেলায় ভিসা ও বিমান টিকিট, মক্কা ও মদিনায় ৫-স্টার হোটেল বুকিং, সুস্বাদু বাঙালি খাবার এবং সার্বক্ষণিক অভিজ্ঞ মোয়াল্লিম গাইড।",
      primaryCta: "প্যাকেজ সমূহ দেখুন",
      secondaryCta: "কাস্টম প্যাকেজ তৈরি করুন",
      perk1: "কাবা চত্বরের নিকটবর্তী ৫-স্টার হোটেল",
      perk2: "আরামদায়ক এসি পরিবহন ও বুলেট ট্রেন",
      perk3: "অভিজ্ঞ বাঙালি আলেম মোয়াল্লিম গাইড",
      trust1: "মোরা অনুমোদিত HAAB-1420",
      trust2: "ঢাকা ও জেদ্দা এয়ারপোর্ট সাপোর্ট",
      trust3: "হরাইজন অফিস, গুলশান-২, ঢাকা",
      trust4: "১০০% শরীয়াহ সম্মত পরিচালনা"
    },
    curator: {
      badge: "সহজে কাস্টম প্যাকেজ তৈরির কিউরেটর",
      titleMain: "আপনার সুবিধা মত সাজান",
      titleGold: "উমরাহ ও হজ প্যাকেজ",
      subheading: "পছন্দের হোটেল ক্যাটাগরি, ভ্রমণের সময়সূচী ও পরিবারের যাত্রী সংখ্যা নির্ধারণ করে তাৎক্ষণিক আনুমানিক খরচ হিসাব করুন।",
      step1Title: "ধাপ ১: হোটেল ও রুমের মান নির্বাচন করুন",
      step1Desc: "হারাম চত্বরের ৫-স্টার স্যুইট বা পছন্দসই হোটেল নির্ধারণ করুন",
      step2Title: "ধাপ ২: সফরের সময় ও পরিবারের সদস্য সংখ্যা",
      step2Desc: "ভ্রমণের মাস, যাত্রী সংখ্যা ও বিমানের সিট ক্যাটাগরি বেছে নিন",
      step3Title: "ধাপ ৩: আনুমানিক বাজেট ও বুকিং",
      seasonLabel: "১. সফরের আনুমানিক সময়",
      partyLabel: "২. ভ্রমণকারী যাত্রীদের সংখ্যা",
      flightLabel: "৩. ফ্লাইটের ক্যাবিন ক্লাস",
      estLabel: "আনুমানিক সর্বমোট খরচ",
      requestBtn: "বুকিং ও পরামর্শের অনুরোধ পাঠান",
      whatsappBtn: "সরাসরি কথা বলুন হোয়াটসঅ্যাপে",
      disclaimer: "কোন বাধ্যবাধকতা নেই • গুলশান-২ অফিসে এসে সরাসরি আলোচনা করার সুযোগ রয়েছে",
      indicativeLabel: "আনুমানিক প্যাকেজ মূল্য",
      perGuest: "/ জন"
    },
    packages: {
      badge: "মোরা অনুমোদিত ও সম্পূর্ণ নিশ্চিত প্যাকেজ সমূহ",
      titleMain: "পবিত্র উমরাহ ও হজ",
      titleGold: "বিশেষ প্যাকেজ সমূহ",
      subheading: "সরাসরি এয়ারলাইন্স টিকিট, হারাম চত্বরের ৫-স্টার হোটেল, বাঙালি খাবার ও অভিজ্ঞ মোয়াল্লিম গাইড সহ সম্পূর্ণ হজ ও উমরাহ সেবা।",
      tabUmrah: "উমরাহ প্যাকেজ",
      tabHajj: "হজ প্যাকেজ",
      popularBadge: "জনপ্রিয় প্যাকেজ",
      selectPackageBtn: "প্যাকেজ বুকিং করুন",
      customWizardBtn: "অথবা নিজের মত প্যাকেজ সাজান"
    },
    fleet: {
      badge: "প্রাইভেট এসি কার ও নিরাপদ যাতায়াত",
      titleMain: "প্রাইভেট কার বহর ও",
      titleGold: "নিরাপদ শোফার সার্ভিস",
      subheading: "জেদ্দা ও মদিনা বিমানবন্দর পিকআপ, মক্কা-মদিনা যাতায়াত এবং ঐতিহাসিক জিয়ারতের জন্য সার্বক্ষণিক দক্ষ চালক সহ প্রাইভেট এসি গাড়ি।",
      selectRouteTitle: "১. যাতায়াতের রুট নির্বাচন করুন",
      selectRouteDesc: "এয়ারপোর্ট আগমন, শহর পরিবর্তন, জিয়ারত বা সম্পূর্ণ সফরের রুট বেছে নিন",
      selectVehicleTitle: "২. গাড়ি ও সিট সংখ্যা নির্বাচন করুন",
      selectVehicleDesc: "রিয়াল (SAR), টাকা (৳) এবং ডলারে ($) স্পষ্ট ও বাস্তবসম্মত মূল্য তালিকা",
      basePriceLabel: "প্রচলিত সৌদি রেইট",
      markupApplied: "সার্ভিস চার্জ অন্তর্ভুক্ত",
      finalSarPrice: "চূড়ান্ত সর্বমোট মূল্য",
      passengers: "সর্বোচ্চ যাত্রী",
      luggage: "লগেজ সুবিধা",
      reserveBtn: "এই গাড়িটি বুক করুন",
      selectedCount: "নির্বাচিত রুট",
      confirmBtn: "গাড়ি বুকিং নিশ্চিত করুন"
    },
    suites: {
      badge: "হারামাইন শরীফের নিকটবর্তী হোটেল",
      titleMain: "৫-স্টার হোটেল ও",
      titleGold: "কাবা ভিউ পেন্টহাউস",
      subheading: "মক্কা ও মদিনার সবচেয়ে নিকটবর্তী ৫-স্টার হোটেল, সরাসরি হারাম চত্বরে প্রবেশের লিফট এবং সার্বক্ষণিক রুম সার্ভিস সুবিধা।",
      reserveBtn: "হোটেল বুকিং করতে যোগাযোগ করুন"
    },
    pillars: {
      badge: "আমাদের ৪টি মূল সেবার স্তম্ভ",
      titleMain: "লাব্বাইকহরাইজনের",
      titleGold: "সেবা ও অঙ্গীকার",
      subheading: "আপনার পবিত্র সফরের প্রতিটি মুহূর্ত যেন নিশ্চিন্ত, নিরাপদ এবং ইবাদতময় হয়—আমরা সেই দায়িত্ব নিষ্ঠার সাথে পালন করি।"
    },
    faq: {
      badge: "হাজী সাহেবানদের প্রয়োজনীয় তথ্য",
      titleMain: "সচরাচর জিজ্ঞাসিত",
      titleGold: "প্রশ্ন ও উত্তর",
      subheading: "নুসুক অ্যাপ পারমিট, অভিজ্ঞ মোয়াল্লিম গাইড, প্রাইভেট গাড়ি ও ঢাকায় জমজম পানি গ্রহণ সম্পর্কিত তথ্য।"
    },
    testimonials: {
      badge: "হাজী সাহেবানদের অভিজ্ঞতা",
      titleMain: "সম্মানিত হাজী সাহেবদের",
      titleGold: "বিশ্বাস ও আন্তরিক মন্তব্য",
      subheading: "আমাদের ব্যবস্থাপনায় সফলভাবে হজ ও উমরাহ পালনকারী সম্মানিত পরিবারবর্গের মূল্যবান অভিজ্ঞতা।"
    },
    footer: {
      loungeBadge: "গুলশান ক্লায়েন্ট অফিস",
      loungeTitle: "গুলশান-২ পরামর্শ কেন্দ্র",
      loungeSub: "গুলশান-২ এ আমাদের অফিসে এসে চা/কফির সাথে আপনার পরিবার বা দলের হজ ও উমরাহ পরিকল্পনা নিয়ে সরাসরি আলোচনা করতে পারেন।",
      loungeHours: "সকাল ১০:০০ - রাত ৮:০০ • শুক্রবার বাদে প্রতিদিন খোলা",
      bookMeetingBtn: "অফিসে অ্যাপয়েন্টমেন্ট নিন",
      whatsappBtn: "সরাসরি কথা বলুন হোয়াটসঅ্যাপে",
      addressTitle: "অফিস ঠিকানা ও হটলাইন",
      privilegesTitle: "আমাদের সেবাসমূহ",
      rights: "লাব্বাইকহরাইজন। সর্বস্বত্ব সংরক্ষিত।"
    },
    modal: {
      dossierTitle: "প্যাকেজ বুকিং ও আলোচনা",
      dossierSub: "লাব্বাইকহরাইজন • গুলশান-২, ঢাকা",
      nameLabel: "আপনার পূর্ণ নাম *",
      phoneLabel: "ফোন / হোয়াটসঅ্যাপ নম্বর (+880) *",
      seasonLabel: "সফরের সম্ভাব্য মাস",
      briefingLabel: "যোগাযোগের মাধ্যম",
      notesLabel: "বিশেষ অতিরিক্ত তথ্য বা অনুরোধ (ঐচ্ছিক)",
      submitBtn: "বুকিং অনুরোধ পাঠান",
      successTitle: "বুকিং অনুরোধ গ্রহণ করা হয়েছে",
      successMsg: "জাজাকআল্লাহ খাইর। আমাদের প্রতিনিধি দ্রুত আপনার ফোনে যোগাযোগ করে বিস্তারিত জানিয়ে দেবেন।",
      closeBtn: "উইন্ডো বন্ধ করুন"
    }
  }
};

export const FLEET_ROUTES = [
  {
    id: "jed_makkah",
    nameEn: "Jeddah Airport (JED) → Makkah Hotel",
    nameBn: "জেদ্দা বিমানবন্দর (JED) → মক্কা হোটেল",
    descEn: "Direct VIP Airport meet & greet with luggage assistance to your Clock Tower or Haram courtyard hotel.",
    descBn: "লগেজ সুবিধা সহ জেদ্দা এয়ারপোর্ট থেকে সরাসরি মক্কা ক্লক টাওয়ার বা হারাম চত্বরের হোটেলে ট্রান্সফার।",
    typeEn: "Airport Arrival",
    typeBn: "এয়ারপোর্ট অ্যারাইভাল",
    distanceEn: "95 km (approx. 60 mins)",
    distanceBn: "৯৫ কিমি (আনুমানিক ৬০ মিনিট)"
  },
  {
    id: "makkah_madinah",
    nameEn: "Makkah Hotel → Madinah Hotel (Intercity)",
    nameBn: "মক্কা হোটেল → মদিনা হোটেল (ইন্টারসিটি)",
    descEn: "Scenic luxury intercity journey through highway oases with private chauffeur refreshment stops.",
    descBn: "প্রাইভেট ড্রাইভার সহ হাইওয়ে ভিউ ও রিফ্রেশমেন্ট সুবিধা সহ আরামদায়ক মক্কা-মদিনা সফর।",
    typeEn: "Intercity Journey",
    typeBn: "ইন্টারসিটি সফর",
    distanceEn: "430 km (approx. 4 hours)",
    distanceBn: "৪৩০ কিমি (আনুমানিক ৪ ঘণ্টা)"
  },
  {
    id: "madinah_med",
    nameEn: "Madinah Hotel → Madinah Airport (MED)",
    nameBn: "মদিনা হোটেল → মদিনা বিমানবন্দর (MED)",
    descEn: "Punctual departure transfer from Al-Masjid an-Nabawi hotels to Prince Mohammad bin Abdulaziz Airport.",
    descBn: "মসজিদে নববীর হোটেল থেকে সময়নিষ্ঠ মদিনা প্রিন্স মোহাম্মদ বিন আব্দুলআজিজ বিমানবন্দরে ড্রপ।",
    typeEn: "Airport Departure",
    typeBn: "এয়ারপোর্ট ডিপারচার",
    distanceEn: "25 km (approx. 25 mins)",
    distanceBn: "২৫ কিমি (আনুমানিক ২৫ মিনিট)"
  },
  {
    id: "full_ziyarah",
    nameEn: "Full-Day Historical Ziyarah Excursion",
    nameBn: "ঐতিহাসিক জিয়ারত এক্সকুরশন (৬ ঘণ্টা)",
    descEn: "Comprehensive scholar-guided tour of Cave of Hira, Arafat, Mina, Mount Uhud, and Masjid Quba.",
    descBn: "হেরা গুহা, আরাফাত, মিনা, ওহুদ পাহাড় ও মসজিদে কুবা সহ পূর্ণাঙ্গ জিয়ারত সফর।",
    typeEn: "Private Excursion",
    typeBn: "প্রাইভেট জিয়ারত",
    distanceEn: "Full Day Dedicated Service",
    distanceBn: "হাফ/ফুল ডে সার্বক্ষণিক সেবা"
  },
  {
    id: "royal_circuit",
    nameEn: "Full Royal Circuit (JED → Makkah → Madinah → MED)",
    nameBn: "ফুল রয়্যাল সার্কিট (জেদ্দা → মক্কা → মদিনা → মদিনা এয়ারপোর্ট)",
    descEn: "Complete end-to-end private chauffeur delegation package covering all arrivals, hotel transfers, ziyarahs, and departure.",
    descBn: "সকল এয়ারপোর্ট রিসিভ, হোটেল ট্রান্সফার, জিয়ারত এবং ডিপারচার ড্রপ সহ ১০০% অল-ইনক্লুসিভ প্রাইভেট কার প্যাকেজ।",
    typeEn: "Full Pilgrimage Circuit",
    typeBn: "সম্পূর্ণ সফর সার্কিট",
    distanceEn: "Complete Pilgrimage Transport",
    distanceBn: "সম্পূর্ণ হজ-ওমরাহ পরিবহন"
  }
];

export const FLEET_VEHICLES = [
  {
    id: "yukon_denali",
    nameEn: "GMC Yukon Denali / Suburban (VIP SUV)",
    nameBn: "জিএমসি ইউকন ডেনালি / সাবারবান (ভিআইপি এসইউভি)",
    badgeEn: "VIP Benchmark",
    badgeBn: "ভিআইপি মানদণ্ড",
    passengers: 7,
    luggage: 5,
    categoryEn: "Luxury SUV",
    categoryBn: "লাক্সারি এসইউভি",
    basePrices: {
      jed_makkah: 550,
      makkah_madinah: 1400,
      madinah_med: 350,
      full_ziyarah: 700,
      royal_circuit: 2800
    },
    featuresEn: ["24/7 Dedicated Chauffeur", "Flight Tracking & Cold Zamzam", "Free High-Speed WiFi", "Child Safety Seats Available"],
    featuresBn: ["২৪/৭ নিয়োজিত ড্রাইভার", "ফ্লাইট ট্র্যাকিং ও ঠান্ডা জমজম", "ফ্রি হাই-স্পিড ওয়াইফাই", "চাইল্ড সেফটি সিট সুবিধা"],
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "maybach_sclass",
    nameEn: "Mercedes-Benz Maybach / S-Class",
    nameBn: "মার্সিডিজ-বেঞ্জ মাইবাখ / এস-ক্লাস",
    badgeEn: "Presidential Tier",
    badgeBn: "প্রেসিডেন্সিয়াল ক্যাটাগরি",
    passengers: 3,
    luggage: 3,
    categoryEn: "Ultra-Luxury Sedan",
    categoryBn: "আল্ট্রা-লাক্সারি সেডান",
    basePrices: {
      jed_makkah: 1200,
      makkah_madinah: 2400,
      madinah_med: 750,
      full_ziyarah: 1300,
      royal_circuit: 5200
    },
    featuresEn: ["Executive Reclining Seats", "Premium Refreshment Bar", "Privacy Partition Screen", "Fast-Track Gate Permit"],
    featuresBn: ["এক্সিকিউটিভ রিক্লাইনিং সিট", "প্রিমিয়াম রিফ্রেশমেন্ট বার", "প্রাইভেসি পার্টিশন স্ক্রিন", "ভিআইপি গেইট পারমিট"],
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "hyundai_staria",
    nameEn: "Hyundai Staria / Toyota HiAce VIP",
    nameBn: "হুন্ডাই স্টারিয়া / টয়োটা হাইএস ভিআইপি",
    badgeEn: "Family Delegation",
    badgeBn: "পারিবারিক সফর",
    passengers: 9,
    luggage: 8,
    categoryEn: "Executive Van",
    categoryBn: "এক্সিকিউটিভ ভ্যান",
    basePrices: {
      jed_makkah: 450,
      makkah_madinah: 1000,
      madinah_med: 300,
      full_ziyarah: 550,
      royal_circuit: 2100
    },
    featuresEn: ["Panoramic Glass Roof", "Spacious Captain Seats", "Ample Luggage Storage", "Multi-Zone Climate AC"],
    featuresBn: ["প্যানোরামিক গ্লাস রুফ", "প্রশস্ত ক্যাপ্টেন সিটসমূহ", "বিশাল লগেজ রাখার জায়গা", "মাল্টি-জোন এসি কুলিং"],
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "mercedes_sprinter",
    nameEn: "Mercedes-Benz Sprinter VIP Coach",
    nameBn: "মার্সিডিজ-বেঞ্জ স্প্রিন্টার ভিআইপি কোচ",
    badgeEn: "Royal Delegation",
    badgeBn: "রয়্যাল প্রতিনিধিদল",
    passengers: 16,
    luggage: 15,
    categoryEn: "VIP Luxury Coach",
    categoryBn: "ভিআইপি লাক্সারি কোচ",
    basePrices: {
      jed_makkah: 950,
      makkah_madinah: 1800,
      madinah_med: 600,
      full_ziyarah: 1100,
      royal_circuit: 4100
    },
    featuresEn: ["Leather Recliner Seats", "Built-In Entertainment Screen", "Full Delegation Hospitality", "Dedicated Luggage Trailer"],
    featuresBn: ["লেদার রিক্লাইনার সিটসমূহ", "ইন-বিল্ট এন্টারটেইনমেন্ট স্ক্রিন", "পূর্ণ প্রতিনিধি দল হসপিটালিটি", "বিশেষ লগেজ ট্রেইলার"],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800"
  }
];

export const LUXURY_FAQS = [
  {
    id: "faq-1",
    qEn: "How does LabbaikHorizon handle biometric registration and Rawdah appointments?",
    qBn: "লাব্বাইকহরাইজন কিভাবে বায়োমেট্রিক রেজিস্ট্রেশন এবং রওজা শরীফ পারমিট ব্যবস্থাপনা করে?",
    aEn: "Our Gulshan-2 private team handles 100% of biometric captures via the Saudi Visa Bio app and guarantees Nusuk Rawdah Sharif permits at your preferred quiet hours prior to your flight departure.",
    aBn: "আমাদের গুলশান-২ লাউঞ্জ টিম 'সৌদি ভিসা বায়ো' অ্যাপের মাধ্যমে ১০০% বায়োমেট্রিক সম্পন্ন করে এবং ফ্লাইটের পূর্বেই নুসুক অ্যাপ থেকে আপনার পছন্দের নিরিবিলি সময়ে রওজা শরীফ পারমিট সুনিশ্চিত করে।"
  },
  {
    id: "faq-2",
    qEn: "Is the scholar / moallim dedicated solely to our family or a large group?",
    qBn: "ইসলামিক স্কলার/মোয়াল্লেম কি শুধুমাত্র আমাদের পরিবারের জন্য নিবেদিত থাকেন নাকি বড় গ্রুপের সাথে থাকেন?",
    aEn: "For the Kiswah Presidential Sanctum, a senior 1-on-1 Islamic scholar accompanies your family exclusively throughout Tawaf, Sa'i, and Ziyarah. For Executive Grandeur, small groups (max 6 guests) receive personalized guidance.",
    aBn: "কিসওয়াহ প্রেসিডেন্সিয়াল স্যুইটের ক্ষেত্রে একজন প্রবীণ ১-অন-১ আলেম স্কলার শুধুমাত্র আপনার পরিবারের সাথে পুরো সফরে অবস্থান করেন। এক্সিকিউটিভ ক্লাসের ক্ষেত্রেও সর্বাধিক ৬ জনের ক্ষুদ্র গ্রুপে সেবা প্রদান করা হয়।"
  },
  {
    id: "faq-3",
    qEn: "What private transport is provided between Jeddah, Makkah, and Madinah?",
    qBn: "জেদ্দা, মক্কা ও মদিনার মধ্যে কি ধরনের প্রাইভেট পরিবহন সেবা প্রদান করা হয়?",
    aEn: "VIP private transfers feature dedicated GMC Yukon Denali or Mercedes Maybach chauffeur vehicles available 24/7, combined with First Class VIP cabins on the Haramain High-Speed Bullet Train.",
    aBn: "আমাদের ভিআইপি সেবায় ২৪/৭ নিয়োজিত থাকে প্রাইভেট জিএমসি ইউকন ডেনালি অথবা মার্সিডিজ মাইবাখ কার সার্ভিস, সাথে মক্কা-মদিনা রুটে হারামাইন বুলেট ট্রেনের ফার্স্ট ক্লাস ভিআইপি ক্যাবিন।"
  },
  {
    id: "faq-4",
    qEn: "How is verified 5-liter Zamzam water and premium Ajwa dates delivered to our Dhaka residence?",
    qBn: "সার্টিফাইড ৫-লিটার জমজম পানি ও প্রিমিয়াম আজওয়া খেজুর কিভাবে আমাদের ঢাকার বাসায় পৌঁছে দেয়া হয়?",
    aEn: "Certified 5-liter sealed Zamzam water bottles and premium Madinah Ajwa dates are pre-cleared through Saudi airport customs and delivered straight to your residence in Gulshan, Banani, Baridhara, or Dhanmondi upon arrival.",
    aBn: "সৌদি বিমানবন্দর কাস্টমস ক্লিয়ারেন্স সম্পন্ন করে ৫-লিটার সিলগালা জমজম পানির বোতল এবং প্রিমিয়াম মদিনার আজওয়া খেজুর আপনার ঢাকার (গুলশান, বনানী, বারিধারা, ধানমন্ডি) বাসভবনে পৌছে দেয়া হয়।"
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

export const LABBAIK_JOURNEY_TIERS = [
  {
    id: "kiswah_sanctum",
    titleEn: "The Kiswah Presidential Sanctum",
    titleBn: "দ্য কিসওয়াহ প্রেসিডেন্সিয়াল স্যাঙ্কটাম",
    subtitleEn: "Peak Exclusivity & Presidential Ka'aba View Penthouse",
    subtitleBn: "সর্বোচ্চ আভিজাত্য ও কাবা শরিফ প্যানোরামিক ভিউ পেন্টহাউস",
    badgeEn: "Peak Exclusivity",
    badgeBn: "সর্বোচ্চ আভিজাত্য",
    priceBDT: 1250000,
    priceUSD: 10500,
    makkahHotel: "Raffles Makkah Palace / Fairmont Royal Penthouse",
    madinahHotel: "The Oberoi Madinah (Royal Suite)",
    transfers: "Dedicated Private GMC Yukon Denali / Maybach 24/7",
    scholar: "Private 1-on-1 Eminent Islamic Scholar (Moallim)",
    featuresEn: [
      "Panoramic Direct Ka'aba View Clock Tower Presidential Penthouse",
      "Dedicated Private GMC Yukon Denali / Maybach Fleet Available 24/7",
      "Private 1-on-1 Eminent Islamic Scholar Companion (Moallim)",
      "Diplomatic CIP Express Fast-Track at Dhaka (DAC) & Jeddah (JED)",
      "Haramain High-Speed Bullet Train VIP First Class Private Cabin",
      "In-Suite Live Haram Audio Feed & Private Butler Service"
    ],
    featuresBn: [
      "ক্লক টাওয়ারের শীর্ষে কাবা শরিফ প্যানোরামিক ভিউ প্রেসিডেন্সিয়াল পেন্টহাউস",
      "২৪/৭ নিয়োজিত প্রাইভেট জিএমসি ইউকন ডেনালি / মার্সিডিজ মাইবাখ গাড়ি",
      "ব্যক্তিগত ১-অন-১ প্রবীণ আলেম স্কলার মোয়াল্লেম সান্নিধ্য",
      "ঢাকা (DAC) ও জেদ্দা (JED) বিমানবন্দরে ডিপ্লোমেটিক সিআইপি ফাস্ট-ট্র্যাক",
      "হারামাইন হাই-স্পিড বুলেট ট্রেনে ভিআইপি ফার্স্ট ক্লাস প্রাইভেট ক্যাবিন",
      "স্যুইটের ভেতরে লাইভ হারামাইন অডিও ফিড ও ২৪ ঘণ্টা বাটলার সার্ভিস"
    ],
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "rawdah_grandeur",
    titleEn: "The Rawdah Executive Grandeur",
    titleBn: "দ্য রওজা এক্সিকিউটিভ গ্র্যান্ডিউর",
    subtitleEn: "5-Star Courtyard Luxury & Scholar Escort",
    subtitleBn: "৫-স্টার উঠান লাক্সারি ও আলেম স্কলার সান্নিধ্য",
    badgeEn: "5-Star Luxury",
    badgeBn: "৫-স্টার লাক্সারি",
    priceBDT: 680000,
    priceUSD: 5800,
    makkahHotel: "Swissôtel Al Maqam / Pullman Zamzam Tower",
    madinahHotel: "Dar Al Taqwa / Anwar Al Madinah Mövenpick",
    transfers: "Private AC Luxury GMC Transfer",
    scholar: "Small Group Scholar Chaperone",
    featuresEn: [
      "Direct Haram Courtyard Access Elevator from Hotel Lobby",
      "Haramain High-Speed Bullet Train VIP First Class Pass",
      "Dedicated Small Group Scholar Chaperone for Tawaf & Rawdah",
      "Airport CIP Fast-Track Assistance & Lounge Access",
      "Buffet Suhoor & Iftar Fine Dining in Makkah & Madinah",
      "Guaranteed 5L Zamzam Delivered to Residence"
    ],
    featuresBn: [
      "হোটেল লবি থেকে সরাসরি হারাম শরিফের উঠানে এলিভেটর সুবিধা",
      "হারামাইন হাই-স্পিড বুলেট ট্রেনে ভিআইপি ফার্স্ট ক্লাস পাস",
      "তাওয়াফ ও রওজা জিয়ারতে ক্ষুদ্র গ্রুপে স্কলারের বিশেষ দিকনির্দেশনা",
      "বিমানবন্দরে সিআইপি ফাস্ট-ট্র্যাক সাপোর্ট ও ভিআইপি লাউঞ্জ সুবিধা",
      "মক্কা ও মদিনার হোটেলের ৫-স্টার বাফেট সেহরি ও ইফতার",
      "ঢাকায় নিজ বাসায় শতভাগ খাঁটি ৫-লিটার জমজম পানি সরবরাহ"
    ],
    image: "https://images.unsplash.com/photo-1565552070098-0073a1c207bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bespoke_delegation",
    titleEn: "Bespoke Royal Delegation",
    titleBn: "বেসপোক রয়্যাল ডেলিগেশন",
    subtitleEn: "Custom Family Delegation & Private Charter",
    subtitleBn: "কাস্টম পারিবারিক গ্রুপ ও প্রাইভেট চার্টার ফ্লাইট",
    badgeEn: "Custom Pilgrimage",
    badgeBn: "কাস্টম হজ-ওমরাহ",
    priceBDT: 2450000,
    priceUSD: 20000,
    isCustomPrice: true,
    makkahHotel: "Tailored Royal Penthouse or Private Palace",
    madinahHotel: "The Oberoi / Madinah Royal Villa",
    transfers: "Private Charter Jet & Armored Maybach Fleet",
    scholar: "Senior Islamic Jurisprudence Scholar & Physician",
    featuresEn: [
      "Completely Tailored Multi-Family Delegation Flight Charter",
      "Dedicated Private Butler & Private Medical Escort",
      "Custom Historical Excursions to Taif & Ancient Sites",
      "Confidential Itinerary Scheduling & Private Lounge Access",
      "24/7 Concierge Hotline & VIP Protocol Escort",
      "Curated Relics & Premium Ajwa Dates Home Delivery"
    ],
    featuresBn: [
      "সম্পূর্ণ কাস্টমাইজড পারিবারিক প্রাইভেট চার্টার ফ্লাইট সুবিধা",
      "ব্যক্তিগত ২৪ ঘণ্টা বাটলার ও ডেডিকেটেড ফিজিশিয়ান ডাক্তার",
      "তায়েফ পর্বত ও প্রাচীন নিদর্শনের প্রাইভেট গাইড সফর",
      "সম্পূর্ণ গোপনীয় সফর সূচী ও গুলশান ভিআইপি লাউঞ্জ প্রবেশাধিকার",
      "২৪/৭ হটলাইন কনসিয়ার্জ ও সিআইপি প্রোটোকল সার্ভিস",
      "প্রিমিয়াম মদিনার আজওয়া খেজুর ও জমজম উপহার বাসায় পৌছে দেয়া"
    ],
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
  }
];

export const ROYAL_SUITES = [
  {
    name: "Raffles Makkah Palace",
    subtitleEn: "Panoramic Ka'aba View Penthouse",
    subtitleBn: "প্যানোরামিক কাবা শরিফ ভিউ পেন্টহাউস",
    locationEn: "Makkah Clock Tower • 0m Direct Courtyard Entry",
    locationBn: "মক্কা ক্লক টাওয়ার • ০ মিটার সরাসরি উঠান প্রবেশ",
    stars: 5,
    highlightsEn: ["Panoramic Direct View of Holy Ka'aba", "Private 24-hr Dedicated Butler", "In-Suite Live Haram Audio Feed", "Exclusive Dining Suhoor & Iftar"],
    highlightsBn: ["প্যানোরামিক কাবা শরিফ এর সরাসরি দৃশ্য", "প্রাইভেট ২৪ ঘণ্টা ডেডিকেটেড বাটলার", "স্যুইটে লাইভ হারাম শরিফ অডিও রিসিভার", "এক্সক্লুসিভ ৫-স্টার সেহরি ও ইফতার"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "The Oberoi Madinah",
    subtitleEn: "Royal Suite • Steps to the Prophet's Mosque",
    subtitleBn: "রয়্যাল স্যুইট • মসজিদে নববীর চত্বরে",
    locationEn: "Madinah Central • 0m Steps to Al-Masjid an-Nabawi",
    locationBn: "মদিনা সেন্ট্রাল • ০ মিটার রাসুল (সাঃ) এর মসজিদ",
    stars: 5,
    highlightsEn: ["Direct Courtyard Access Steps", "Fast-Track Rawdah Permit Access", "Private Concierge Assistance", "Signature Oberoi 5-Star Dining"],
    highlightsBn: ["মসজিদে নববীর উত্তর চত্বরে সরাসরি প্রবেশ", "রওজা শরীফ পারমিট ফাস্ট-ট্র্যাক সুবিধা", "প্রাইভেট কনসিয়ার্জ টিম সাপোর্ট", "ওবেরয় সিগনেচার ৫-স্টার ডাইনিং"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Swissôtel Al Maqam",
    subtitleEn: "Direct Haram Courtyard Elevator Suite",
    subtitleBn: "ডাইরেক্ট হারাম উঠান এলিভেটর স্যুইট",
    locationEn: "Makkah Clock Tower Complex",
    locationBn: "মক্কা ক্লক টাওয়ার কমপ্লেক্স",
    stars: 5,
    highlightsEn: ["Direct Elevator to Haram Courtyard", "In-Suite Live Ka'aba Audio Receiver", "Gourmet International Buffet", "24/7 VIP Chauffeur Transfer"],
    highlightsBn: ["সরাসরি হারাম চত্বরে এলিভেটর সুবিধা", "রুমের ভেতর কাবা শরিফের লাইভ অডিও", "গুরমেট ইন্টারন্যাশনাল বাফেট ডাইনিং", "২৪/৭ ভিআইপি গাড়ি ট্রান্সফার"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
  }
];

export const CONCIERGE_PILLARS = [
  {
    id: 1,
    titleEn: "Diplomatic CIP Fast-Track",
    titleBn: "ডিপ্লোমেটিক সিআইপি ফাস্ট-ট্র্যাক",
    descEn: "Airport express immigration, VIP lounge access, and private luxury fleet transfers at Dhaka (DAC) and Jeddah (JED).",
    descBn: "ঢাকা ও জেদ্দা বিমানবন্দরে এক্সপ্রেস ইমিগ্রেশন, ভিআইপি সিআইপি লাউঞ্জ প্রবেশাধিকার ও প্রাইভেট লাক্সারি কার বহর।",
    icon: "Plane"
  },
  {
    id: 2,
    titleEn: "Eminent Scholar Accompaniment",
    titleBn: "প্রবীণ আলেম স্কলারের সান্নিধ্য",
    descEn: "Knowledgeable, respectful scholars offering private fiqh and step-by-step guidance for Tawaf, Sa'i, and Rawdah.",
    descBn: "সুবিজ্ঞ প্রবীণ আলেম স্কলারের সান্নিধ্য যিনি ব্যক্তিগত তাওয়াফ, সাঈ ও রওজা জিয়ারতে সঠিক মাসআলা নির্দেশনা প্রদান করেন।",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    titleEn: "Zero-Effort Documentation",
    titleBn: "জিরো-এফোর্ট ডকুমেন্টেশন",
    descEn: "Complete handling of visas, Nusuk appointments, biometric registrations, and health documentation.",
    descBn: "সৌদি ই-ভিসা, নুসুক রওজা পারমিট, বায়োমেট্রিক ফিঙ্গারপ্রিন্ট এবং হেলথ কার্ডের শতভাগ স্বয়ংক্রিয় ব্যবস্থাপনা।",
    icon: "Sparkles"
  },
  {
    id: 4,
    titleEn: "Sacred Zamzam & Dates Delivery",
    titleBn: "জমজম ও আজওয়া খেজুর ডেলিভারি",
    descEn: "Certified 5-liter Zamzam water and premium Ajwa dates packed and delivered straight to the pilgrim's residence.",
    descBn: "সার্টিফাইড ৫-লিটার সিলগালা জমজম পানি ও প্রিমিয়াম আজওয়া খেজুর সরাসরি আপনার ঢাকার বাসায় পৌঁছে দেয়া হয়।",
    icon: "Gem"
  }
];

export const DIGNITARY_TESTIMONIALS = [
  {
    quoteEn: "LabbaikHorizon delivered a sacred journey of unprecedented serenity. Staying at the Raffles Ka'aba Penthouse with an in-suite audio feed allowed my elderly father to participate seamlessly in every prayer.",
    quoteBn: "লাব্বাইকহরাইজন আমাদের পুরো পরিবারকে অভূতপূর্ব প্রশান্তির একটি সফর উপহার দিয়েছে। রাফেলস কাবার পেন্টহাউসে লাইভ অডিও লাইনের কারণে আমার বৃদ্ধ পিতা প্রতিটি নামাজে অংশগ্রহণ করতে পেরেছেন।",
    authorEn: "Al-Haj Syful Islam Chowdhury",
    authorBn: "আলহাজ্ব সাইফুল ইসলাম চৌধুরী",
    designationEn: "Chairman, National Industrial Group",
    designationBn: "চেয়ারম্যান, ন্যাশনাল ইন্ডাস্ট্রিয়াল গ্রুপ",
    packageTakenEn: "Kiswah Presidential Sanctum",
    packageTakenBn: "কিসওয়াহ প্রেসিডেন্সিয়াল স্যাঙ্কটাম",
    rating: 5
  },
  {
    quoteEn: "The diplomatic CIP fast-track at Shahjalal Airport and private GMC Yukon transfer in Jeddah eliminated every point of friction.",
    quoteBn: "শাহজালাল বিমানবন্দরে সিআইপি প্রোটোকল সার্ভিস এবং জেদ্দায় প্রাইভেট জিএমসি ডেনালি কার রাইড আমাদের সফরকে করে তুলেছিল একদম ঝামেলাহীন।",
    authorEn: "Dr. Farhana Rahman",
    authorBn: "ড. ফারহানা রহমান",
    designationEn: "Managing Director, Global Health Enterprise",
    designationBn: "ব্যবস্থাপনা পরিচালক, গ্লোবাল হেলথ এন্টারপ্রাইজ",
    packageTakenEn: "Rawdah Executive Grandeur",
    packageTakenBn: "রওজা এক্সিকিউティブ গ্র্যান্ডিউর",
    rating: 5
  },
  {
    quoteEn: "Absolute discretion, punctual luxury, and flawless Nusuk scheduling. The team at LabbaikHorizon sets the benchmark for high-net-worth spiritual travel.",
    quoteBn: "সম্পূর্ণ গোপনীয়তা, সময়নিষ্ঠ আভিজাত্য এবং নিখুঁত নুসুক অ্যাপ রওজা পারমিট সূচী। লাব্বাইকহরাইজন সত্যিই ভিআইপি হজ-ওমরাহের মানদণ্ড স্থাপন করেছে।",
    authorEn: "Engr. Mahmudul Hassan",
    authorBn: "প্রকৌশলী মাহমুদুল হাসান",
    designationEn: "Director, Infrastructure & Real Estate Group",
    designationBn: "পরিচালক, ইনফ্রাস্ট্রাকচার ও রিয়েল এস্টেট গ্রুপ",
    packageTakenEn: "Bespoke Royal Delegation",
    packageTakenBn: "বেসপোক রয়্যাল ডেলিগেশন",
    rating: 5
  }
];

export const AGENCY_CREDENTIALS = {
  name: "LabbaikHorizon",
  taglineEn: "Ultra-Luxury Kiswah Pilgrimage Concierge",
  taglineBn: "কিসওয়াহ অনুপ্রেরণায় অতি-অভিজাত হজ ও ওমরাহ কনসিয়ার্জ",
  hotline: "+880 1800-LABBAIK",
  phoneAlt: "+880 1700-000000",
  email: "vip@labbaikhorizon.com",
  moraReg: "HAAB-1420",
  atabReg: "09823",
  addressEn: "Level 6, Horizon Tower, Gulshan-2, Dhaka-1212, Bangladesh",
  addressBn: "লেভেল ৬, হরাইজন টাওয়ার, গুলশান-২, ঢাকা-১২১২, বাংলাদেশ"
};

export const CONCIERGE_DATA = {
  hotels: {
    makkah: [
      {
        id: 'raffles',
        name: "Raffles Makkah Palace",
        dist: "0m Courtyard",
        nightlyBdt: 145000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 'swissotel',
        name: "Swissôtel Al Maqam",
        dist: "Direct Elevator",
        nightlyBdt: 95000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 'clocktower',
        name: "Fairmont Makkah Clock Royal Tower",
        dist: "0m Courtyard",
        nightlyBdt: 120000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
      }
    ],
    madinah: [
      {
        id: 'oberoi',
        name: "The Oberoi Madinah",
        dist: "Steps to Haram",
        nightlyBdt: 135000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 'dar_taqwa',
        name: "Dar Al Taqwa Hotel Madinah",
        dist: "0m Courtyard",
        nightlyBdt: 110000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: 'madinah_hilton',
        name: "Madinah Hilton Hotel",
        dist: "2-Min Courtyard Walk",
        nightlyBdt: 85000,
        stars: 5,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  vehicles: [
    {
      id: 'gmc',
      name: "GMC Yukon XL / Denali (VIP Executive)",
      badge: "VIP Chauffeur SUV",
      ratePerKm: 1.0,
      passengers: 6,
      luggage: 6,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'maybach',
      name: "Mercedes-Maybach S-Class / V-Class Royal",
      badge: "Presidential Fleet",
      ratePerKm: 1.8,
      passengers: 4,
      luggage: 4,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'bus_vip',
      name: "Mercedes VIP Jet Coach (Luxury Delegation)",
      badge: "Royal Bus Fleet",
      ratePerKm: 2.2,
      passengers: 24,
      luggage: 24,
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800"
    }
  ],
  routes: [
    {
      id: 'jed_mak',
      name_en: "Jeddah Airport (JED) → Makkah Hotel (Private GMC/Maybach Chauffeur)",
      name_bn: "জেদ্দা এয়ারপোর্ট (JED) → মক্কা হোটেল (প্রাইভেট শফার কার)",
      baseBdt: 25000,
      distanceKm: 100,
      durationEn: "1 hr 15 mins",
      durationBn: "১ ঘণ্টা ১৫ মিনিট"
    },
    {
      id: 'mak_med_train',
      name_en: "Makkah → Madinah Haramain High-Speed Rail (VIP First Class Pass)",
      name_bn: "মক্কা → মদিনা হারামাইন হাই-স্পিড ট্রেন (ভিআইপি ফার্স্ট ক্লাস)",
      baseBdt: 35000,
      distanceKm: 450,
      durationEn: "2 hrs 20 mins",
      durationBn: "২ ঘণ্টা ২০ মিনিট"
    },
    {
      id: 'med_jed',
      name_en: "Madinah Hotel → Jeddah Airport / Madinah Airport Transfer",
      name_bn: "মদিনা হোটেল → জেদ্দা এয়ারপোর্ট / মদিনা এয়ারপোর্ট ট্রান্সফার",
      baseBdt: 30000,
      distanceKm: 400,
      durationEn: "3 hrs 30 mins",
      durationBn: "৩ ঘণ্টা ৩০ মিনিট"
    },
    {
      id: 'ziyarah_full',
      name_en: "Makkah & Madinah Private Guided Ziyarah Excursions",
      name_bn: "মক্কা ও মদিনা ঐতিহাসিক স্থানসমূহে প্রাইভেট জিয়ারত সফর",
      baseBdt: 20000,
      distanceKm: 150,
      durationEn: "Full Day Guided Tour",
      durationBn: "ফুল ডে গাইডেড সফর"
    }
  ],
  addOns: [
    {
      id: 'scholar',
      name_en: "1-on-1 Eminent Scholar Accompaniment (Tawaf & Sa'i Fiqh Guide)",
      name_bn: "১-অন-১ প্রবীণ আলেম স্কলার গাইড (তাওয়াফ ও মাসআলা গাইড)",
      bdt: 45000,
      icon: "ShieldCheck"
    },
    {
      id: 'cip_fasttrack',
      name_en: "Diplomatic CIP Fast-Track Protocol (DAC & JED Airports)",
      name_bn: "ডিপ্লোমেটিক সিআইপি ফাস্ট-ট্র্যাক প্রোটোকল (ঢাকা ও জেদ্দা)",
      bdt: 38000,
      icon: "Plane"
    },
    {
      id: 'zamzam_home',
      name_en: "Certified 5L Zamzam & Premium Ajwa Dates Home Delivery in Dhaka",
      name_bn: "সার্টিফাইড ৫-লিটার জমজম পানি ও আজওয়া খেজুর ঢাকায় বাসায় ডেলিভারি",
      bdt: 12000,
      icon: "Gem"
    },
    {
      id: 'nusuk_concierge',
      name_en: "Nusuk Rawdah VIP Permit Fast-Track Guarantee",
      name_bn: "নুসুক অ্যাপ রওজা শরিফ পারমিট ফাস্ট-ট্র্যাক গ্যারান্টি",
      bdt: 18000,
      icon: "Sparkles"
    }
  ]
};

export const PACKAGES_DATA = {
  umrah: [
    {
      id: 'umrah-eco',
      badge_bn: 'ইকোনমি',
      badge_en: 'Economy',
      title_bn: 'ইকোনমি প্যাকেজ',
      title_en: 'Economy Package',
      accentColor: 'from-emerald-600/30 to-emerald-950/50',
      borderColor: 'border-emerald-500/30',
      tagColor: 'text-emerald-400',
      features_bn: [
        'উমরাহ ভিসা',
        'ট্রানজিট ফ্লাইট',
        'মক্কা ও মদিনা স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Umrah Visa Processing',
        'Transit Flight Ticket',
        'Standard Hotel in Makkah & Madinah',
        'AC Bus Group Transport',
        'Basic Makkah & Madinah Ziyarah',
        'Bengali Catering Included',
        'Dedicated Moallim Guidance'
      ],
      price_bn: '৳ ১৪৫,০০০/-',
      price_en: '৳ 145,000 / $1,220',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'umrah-std',
      badge_bn: 'স্ট্যান্ডার্ড',
      badge_en: 'Standard',
      title_bn: 'স্ট্যান্ডার্ড প্যাকেজ',
      title_en: 'Standard Package',
      accentColor: 'from-rose-600/30 to-rose-950/50',
      borderColor: 'border-rose-500/30',
      tagColor: 'text-rose-400',
      features_bn: [
        'উমরাহ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কা ও মদিনা স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Umrah Visa Processing',
        'Direct Flight Ticket (Biman/Saudia)',
        'Standard Hotel in Makkah & Madinah',
        'AC Bus Group Transport',
        'Basic Makkah & Madinah Ziyarah',
        'Bengali Catering Included',
        'Dedicated Moallim Guidance'
      ],
      price_bn: '৳ ১৫৫,০০০/-',
      price_en: '৳ 155,000 / $1,300',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'umrah-vip',
      badge_bn: 'ভিআইপি',
      badge_en: 'VIP Luxury',
      title_bn: 'ভিআইপি প্যাকেজ',
      title_en: 'VIP Luxury Package',
      accentColor: 'from-amber-500/30 to-amber-950/50',
      borderColor: 'border-[#d4af37]',
      tagColor: 'text-[#d4af37]',
      isPopular: true,
      features_bn: [
        'উমরাহ ভিসা',
        'ফার্স্ট ক্লাস ফ্লাইট',
        'পাঁচ তারকা হোটেল মক্কা,মদিনা',
        'লাক্সারি প্রাইভেট পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'স্পেশাল বুফে খাবার',
        'প্রাইভেট মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'VIP Umrah Visa & Nusuk Priority',
        'First / Business Class Flight',
        '5-Star Luxury Hotels (Makkah & Madinah)',
        'Private Luxury Fleet Transfers (GMC/Maybach)',
        'Comprehensive Guided Ziyarah Excursion',
        'Executive Buffet Dining Included',
        'Private 1-on-1 Scholar Moallim'
      ],
      price_bn: '৳ ২৫০,০০০/-',
      price_en: '৳ 250,000 / $2,100',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'umrah-ramadan',
      badge_bn: 'রমজান',
      badge_en: 'Ramadan Special',
      title_bn: 'রমজান প্যাকেজ',
      title_en: 'Ramadan Sanctuary Package',
      accentColor: 'from-blue-600/30 to-slate-950/50',
      borderColor: 'border-blue-500/30',
      tagColor: 'text-blue-400',
      features_bn: [
        'উমরাহ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কা ও মদিনা স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Special Ramadan Umrah Visa',
        'Direct Flight Ticket',
        'Walking Distance Hotels near Courtyard',
        'AC Chauffeur Transport',
        'Historical Makkah & Madinah Ziyarah',
        'Traditional Iftar & Suhoor Included',
        'Dedicated Moallim Guidance'
      ],
      price_bn: '৳ ১৮০,০০০/- থেকে শুরু',
      price_en: 'Starts from ৳ 180,000 / $1,515',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    }
  ],
  hajj: [
    {
      id: 'hajj-c',
      badge_bn: 'ইকোনমি',
      badge_en: 'Economy',
      title_bn: 'হজ প্যাকেজ সি (শিফটিং)',
      title_en: 'Hajj Package C (Shifting)',
      accentColor: 'from-emerald-600/30 to-emerald-950/50',
      borderColor: 'border-emerald-500/30',
      tagColor: 'text-emerald-400',
      features_bn: [
        'হজ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কা ও মদিনা মানসম্মত স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'মিনার আরাফা মোজদালিফায় C - ক্যাটাগরি তাবু',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Official Hajj Visa & Insurance',
        'Direct Flight Ticket',
        'Standard Shifting Hotel in Makkah & Madinah',
        'AC Bus Intercity Transfers',
        'Guided Makkah & Madinah Ziyarah',
        'Bengali Catering (3 Meals)',
        'Mina, Arafat, Muzdalifah Category-C Tents',
        'Dedicated Scholar / Moallim Guide'
      ],
      price_bn: '৳ ৫৬০,০০০/-',
      price_en: '৳ 560,000 / $4,700',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'hajj-b',
      badge_bn: 'স্ট্যান্ডার্ড',
      badge_en: 'Standard',
      title_bn: 'হজ প্যাকেজ বি (শিফটিং)',
      title_en: 'Hajj Package B (Shifting)',
      accentColor: 'from-rose-600/30 to-rose-950/50',
      borderColor: 'border-rose-500/30',
      tagColor: 'text-rose-400',
      features_bn: [
        'হজ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কা ও মদিনা মানসম্মত স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'মিনার আরাফা মোজদালিফায় C - ক্যাটাগরি তাবু',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Official Hajj Visa & Health Insurance',
        'Direct Flight Ticket',
        'Quality Standard Hotel in Makkah & Madinah',
        'AC Bus Shuttle & Intercity Transfers',
        'Guided Makkah & Madinah Ziyarah',
        'Full Board Bengali Meals',
        'Mina, Arafat, Muzdalifah Category-C Tents',
        'Dedicated Scholar / Moallim Guide'
      ],
      price_bn: '৳ ৬৫০,০০০/-',
      price_en: '৳ 650,000 / $5,460',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'hajj-std-plus',
      badge_bn: 'স্ট্যান্ডার্ড প্লাস',
      badge_en: 'Standard Plus',
      title_bn: 'হজ প্যাকেজ (স্থায়ী)',
      title_en: 'Hajj Package (Non-Shifting)',
      accentColor: 'from-amber-600/30 to-amber-950/50',
      borderColor: 'border-amber-500/40',
      tagColor: 'text-amber-400',
      features_bn: [
        'হজ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কা ও মদিনা (স্থায়ী) স্ট্যান্ডার্ড হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'মিনার আরাফা মোজদালিফায় C - ক্যাটাগরি তাবু',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'Official Hajj Visa & Registration',
        'Direct Flight Ticket',
        'Non-Shifting Standard Hotel (Close to Courtyard)',
        'AC Bus Transport with Dedicated Group Coordinator',
        'Full Historical Ziyarah Excursion',
        'Bengali Catering Included',
        'Mina, Arafat, Muzdalifah Category-C Tents',
        'Experienced Moallim Supervision'
      ],
      price_bn: '৳ ৭০০,০০০/-',
      price_en: '৳ 700,000 / $5,880',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    },
    {
      id: 'hajj-a-vip',
      badge_bn: 'ভিআইপি',
      badge_en: 'VIP Presidential',
      title_bn: 'হজ প্যাকেজ এ (শিফটিং)',
      title_en: 'Hajj Package A (VIP Shifting)',
      accentColor: 'from-indigo-600/30 to-slate-950/50',
      borderColor: 'border-[#d4af37]',
      tagColor: 'text-[#d4af37]',
      isPopular: true,
      features_bn: [
        'হজ ভিসা',
        'ডিরেক্ট ফ্লাইট',
        'মক্কায় ৫ তারকা মদিনায় ৩/৪ তারকা হোটেল',
        'এসি বাসে পরিবহন সুবিধা',
        'মক্কা মদিনা মৌলিক জিয়ারাহ সফর',
        'বাঙালি খাবারের সুব্যবস্থা',
        'মিনার আরাফা মোজদালিফায় C - ক্যাটাগরি তাবু',
        'স্পেশাল মোয়াল্লিম গাইড সুবিধা'
      ],
      features_en: [
        'VIP Hajj Visa & CIP Fast-Track Assistance',
        'Direct Flight Ticket (Biman/Saudia)',
        '5-Star Hotel in Makkah & 3/4-Star in Madinah',
        'AC Bus Transport & Bullet Train Options',
        'Comprehensive Ziyarah Excursion Tour',
        'Premium Bengali & Buffet Catering',
        'Mina, Arafat, Muzdalifah Category-C VIP Tents',
        'Senior Scholar / Moallim Personalized Guidance'
      ],
      price_bn: '৳ ৭৭০,০০০/-',
      price_en: '৳ 770,000 / $6,470',
      priceUnit_bn: 'জনপ্রতি',
      priceUnit_en: 'per person'
    }
  ]
};


