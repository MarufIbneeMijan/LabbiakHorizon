import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, MapPin, Plane, Star, Clock, CheckCircle2, 
  Sparkles, ArrowRight, Eye, ShieldCheck, Crown, Sliders, Check,
  ChevronLeft, ChevronRight, X, Luggage, Calendar, Award, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { packagesAPI, hotelsAPI } from '../services/api';
import { DICTIONARY } from '../data/mockData';

export default function PackagesSection({ locale = 'bn', onSelectPackage = () => {}, onOpenWizard = () => {} }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState('umrah'); // 'umrah' | 'hajj'
  const [packages, setPackages] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Swiper instance ref
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Package Details Modal State
  const [selectedDetailPkg, setSelectedDetailPkg] = useState(null);
  const [detailTab, setDetailTab] = useState('amenities'); // 'amenities' | 'hotels' | 'flights' | 'itinerary'

  useEffect(() => {
    fetchPackages(activeTab);
    fetchHotels();

    // Live CMS Binding: React immediately when admin adds/edits/deletes packages or hotels
    const handlePackagesUpdated = () => {
      fetchPackages(activeTab);
    };

    const handleHotelsUpdated = () => {
      fetchHotels();
    };

    window.addEventListener('horizon:packages-updated', handlePackagesUpdated);
    window.addEventListener('horizon:hotels-updated', handleHotelsUpdated);
    return () => {
      window.removeEventListener('horizon:packages-updated', handlePackagesUpdated);
      window.removeEventListener('horizon:hotels-updated', handleHotelsUpdated);
    };
  }, [activeTab]);

  const fetchHotels = async () => {
    try {
      const data = await hotelsAPI.getAll('all');
      setHotelsList(data || []);
    } catch (err) {
      console.warn('Failed to load hotels catalog:', err);
    }
  };

  // Lock body scroll when detail modal is open
  useEffect(() => {
    if (selectedDetailPkg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDetailPkg]);

  const fetchPackages = async (type) => {
    setLoading(true);
    try {
      const data = await packagesAPI.getAll(type);
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPackageTabsData = (pkg) => {
    const isClocktower = pkg.id?.includes('clocktower') || pkg.title_en?.includes('Clock Tower');
    const isHajj = pkg.type === 'hajj';

    // 1. Amenities / Inclusions
    let amenities = [];
    if (Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0) {
      amenities = pkg.inclusions.map((inc) => ({
        title: isBn ? (inc.title_bn || inc.title) : (inc.title || inc.title_bn),
        desc: isBn ? (inc.desc_bn || inc.desc) : (inc.desc || inc.desc_bn)
      }));
    } else {
      amenities = [
        {
          title: isBn ? 'ভিআইপি ওমরাহ/হজ ভিসা ও নুসুক পারমিট' : 'VIP Visa & Nusuk Priority Rawdah Permit',
          desc: isBn ? 'সৌদি সরকারের সরাসরি অনুমোদিত প্রোটোকল ও দ্রুত রওজা পারমিট সহায়তা।' : 'Government-verified visa processing with priority Nusuk Rawdah reservation.'
        },
        {
          title: isBn ? 'ব্যক্তিগত ১-অন-১ স্কলার মোয়াল্লেম গাইড' : 'Dedicated 1-on-1 Senior Scholar Moallim',
          desc: isBn ? 'বাংলাদেশের স্বনামধন্য প্রবীণ আলেম দ্বারা সকল আরকান ও মাসআলার সঠিক নির্দেশনা।' : 'Distinguished Bengali Islamic scholar escorting every ritual and tawaf.'
        },
        {
          title: isBn ? 'প্রাইভেট জিএমসি ও হারামাইন বুলেট ট্রেন ফার্স্ট ক্লাস' : 'Private GMC Yukon & Haramain Bullet Train 1st Class',
          desc: isBn ? 'বিমানবন্দর ও আন্তঃশহর যাতায়াতে ভিআইপি লাউঞ্জ ও এসি ব্যক্তিগত গাড়ি।' : 'Seamless chauffeur ground logistics and first-class high-speed rail cabins.'
        },
        {
          title: isBn ? 'ঢাকায় বাসায় ৫ লিটার জমজম ও আজওয়া ডেলিভারি' : '5L Zamzam & Madinah Ajwa Delivered to Dhaka Home',
          desc: isBn ? 'সফর শেষে আপনার বাসায় পৌঁছে দেওয়া হবে সৌদি মন্ত্রণালয় অনুমোদিত সিলগালা জমজম।' : 'Sealed official Kudai Zamzam and Al-Aliyah Ajwa delivered to your doorstep.'
        },
        {
          title: isBn ? 'সিআইপি ফাস্ট-ট্র্যাক এয়ারপোর্ট প্রোটোকল' : 'CIP Fast-Track Airport Protocol',
          desc: isBn ? 'ঢাকা ও জেদ্দা উভয় বিমানবন্দরে কূটনৈতিক লাইনে দ্রুত ইমিগ্রেশন ও লাউঞ্জ সুবিধা।' : 'Expedited customs, diplomatic immigration clearance, and lounge access at DAC & JED.'
        }
      ];
    }

    // 2. Hotels (Dynamic Directory Binding)
    let hotels = [];
    if (Array.isArray(pkg.selectedHotelIds) && pkg.selectedHotelIds.length > 0) {
      const resolved = pkg.selectedHotelIds.map((id) => {
        return (hotelsList || []).find((h) => h.id === id);
      }).filter(Boolean);

      if (resolved.length > 0) {
        hotels = resolved.map((h) => {
          const isMadinah = (h.city || '').toLowerCase().includes('madinah');
          return {
            city: isBn ? (isMadinah ? 'মদিনা মুনাওয়ারা' : 'মক্কা মুকাররমা') : (isMadinah ? 'Madinah Al-Munawwarah' : 'Makkah Al-Mukarramah'),
            hotel: isBn ? (h.nameBn || h.name) : (h.name || h.nameBn),
            dist: isBn ? (h.distBn || h.dist) : (h.dist || h.distBn),
            rating: h.starRating || `${h.stars || 5}-Star VIP`,
            features: Array.isArray(h.features) ? h.features.join(' • ') : (h.features || '')
          };
        });
      }
    }

    if (hotels.length === 0) {
      hotels = [
        {
          city: isBn ? 'মক্কা মুকাররমা' : 'Makkah Al-Mukarramah',
          hotel: isClocktower ? 'Raffles Makkah Palace / Fairmont Clock Tower' : 'Swissôtel Makkah / Pullman Zamzam',
          dist: isClocktower ? (isBn ? '০ মিটার সরাসরি চত্বর (Kaaba View)' : '0m Direct Courtyard (Kaaba View)') : (isBn ? '৫০ মিটার হারাম উঠান সংযোগ' : '50m Direct Courtyard Access'),
          rating: '5-Star Ultra Luxury',
          features: isBn ? 'হারামের সরাসরি অডিও সংযোগ, বুফে নাস্তা ও ২৪ ঘণ্টা রুম সার্ভিস' : 'Live Haram prayer audio feed, royal buffet dining, and 24/7 private butler.'
        },
        {
          city: isBn ? 'মদিনা মুনাওয়ারা' : 'Madinah Al-Munawwarah',
          hotel: isClocktower ? "The Oberoi Madinah (Prophet's Mosque Courtyard)" : 'Dar Al Taqwa Hotel / Mövenpick Madinah',
          dist: isBn ? 'মসজিদে নববীর গেটের ঠিক সামনে (০ মিটার)' : "0m Haram Courtyard (Steps to Ladies' Gate)",
          rating: '5-Star Ultra Luxury',
          features: isBn ? 'মসজিদে নববী সংলগ্ন মনোরম ভিউ ও নিরিবিলি আধুনিক স্যুইট' : "Direct pedestrian access to the Prophet's Mosque courtyard and luxury amenities."
        }
      ];
    }

    // 3. Flights
    const flights = {
      carrier: pkg.flightTier || (isBn ? 'সাউদিয়া এয়ারলাইন্স অথবা বিমান বাংলাদেশ ভিআইপি' : 'Saudia Airlines or Biman Bangladesh VIP'),
      aircraft: pkg.flightAircraft || 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
      route: pkg.flightRoute || (isHajj 
        ? (isBn ? 'ঢাকা ➔ মদিনা ➔ মক্কা ➔ জেদ্দা ➔ ঢাকা (ডিরেক্ট)' : 'Dhaka ➔ Madinah ➔ Makkah ➔ Jeddah ➔ Dhaka (Direct)')
        : (isBn ? 'ঢাকা ➔ জেদ্দা ➔ মদিনা ➔ ঢাকা (ডিরেক্ট নন-স্টপ)' : 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct Non-Stop)')),
      luggage: pkg.flightLuggage || (isBn 
        ? '২ টি লাগেজ (২৩ কেজি করে = ৪৬ কেজি) + ৭ কেজি হ্যান্ডব্যাগ + ৫ লিটার জমজম বক্স' 
        : '2 pieces check-in (23kg each = 46kg) + 7kg cabin baggage + 5L sealed Zamzam box'),
      vipAccess: isBn ? 'হযরত শাহজালাল ভিআইপি সিআইপি লাউঞ্জ এক্সেস ও ফাস্ট-ট্র্যাক বোর্ডিং' : 'CIP Fast-Track Lounge Access at DAC & Royal Terminal Protocol at JED'
    };

    // 4. Itinerary
    let itinerary = [];
    if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0) {
      itinerary = pkg.itinerary.map((step, idx) => ({
        day: isBn ? (step.day_bn || step.day || `দিন ${idx + 1}`) : (step.day || step.day_bn || `Day ${idx + 1}`),
        title: isBn ? (step.title_bn || step.title) : (step.title || step.title_bn),
        desc: isBn ? (step.desc_bn || step.desc) : (step.desc || step.desc_bn)
      }));
    } else {
      itinerary = [
        {
          day: isBn ? 'দিন ১' : 'Day 1',
          title: isBn ? 'ঢাকা ত্যাগ ও জেদ্দা রাজকীয় আগমন' : 'Dhaka Departure & Royal Jeddah Arrival',
          desc: isBn ? 'ঢাকা থেকে ভিআইপি বিমানে জেদ্দা পৌঁছানো এবং প্রাইভেট জিএমসি চফারে মক্কা ক্লক টাওয়ারে স্থানান্তর।' : 'VIP flight from DAC to JED, private GMC chauffeur transfer to Makkah 5-star suite.'
        },
        {
          day: isBn ? 'দিন ২' : 'Day 2',
          title: isBn ? 'স্কলারের নেতৃত্বে পবিত্র ওমরাহ পালন' : 'Guided Umrah under Senior Scholar Direction',
          desc: isBn ? 'ব্যক্তিগত আলেমের নির্দেশনায় তাওয়াফ, সায়ী ও তাহাল্লুল সঠিকভাবে সুন্নাহ মোতাবেক সম্পন্ন করা।' : 'Performing peaceful Umrah rites with discrete 1-on-1 Islamic scholar accompaniment.'
        },
        {
          day: isBn ? 'দিন ৩-৫' : 'Day 3–5',
          title: isBn ? 'মক্কার ঐতিহাসিক জিয়ারত ও তাহাজ্জুদ' : 'Makkah Sacred Ziyarah & Spiritual Seclusion',
          desc: isBn ? 'জাবালে নূর (হেরা গুহা), জাবালে সওর ও আরাফাত পরিদর্শন। হারামে নফল ইবাদতের পর্যাপ্ত সময়।' : 'Private historical excursion to Cave Hira, Thawr, Mina, and unhurried courtyard prayers.'
        },
        {
          day: isBn ? 'দিন ৬' : 'Day 6',
          title: isBn ? 'হারামাইন বুলেট ট্রেনে মদিনা যাত্রা' : 'Haramain High-Speed Train to Madinah',
          desc: isBn ? '৩০০ কিমি/ঘণ্টা গতির বুলেট ট্রেনের ফার্স্ট ক্লাস কেবিনে আরামদায়কভাবে মদিনায় গমনাগমন।' : 'First-Class Haramin bullet train transfer traversing the sacred desert to Madinah.'
        },
        {
          day: isBn ? 'দিন ৭-৮' : 'Day 7–8',
          title: isBn ? 'রওজা শরিফ জিয়ারত ও মসজিদে নববী' : "Rawdah Sharif Ziyarah & Prophet's Mosque",
          desc: isBn ? 'নুসুক অ্যাপ অগ্রাধিকার পারমিটে রিয়াদুল জান্নাতে সালাত ও রাসুলুল্লাহ (সাঃ)-এর রওজায় সালাম পেশ।' : "Priority VIP entrance to Rawdah Sharif and spiritual solace in the Prophet's Mosque."
        },
        {
          day: isBn ? 'দিন ৯-১০' : 'Day 9–10',
          title: isBn ? 'মদিনা জিয়ারত ও ঢাকায় সম্মানজনক প্রত্যাবর্তন' : 'Madinah Ziyarah & Homeward Return',
          desc: isBn ? 'মসজিদে কুবা, উহুদ প্রান্তর পরিদর্শন শেষে মদিনা বিমানবন্দর থেকে সরাসরি ঢাকায় প্রত্যাবর্তন।' : 'Visiting Quba Mosque and Mount Uhud before direct VIP flight return to Dhaka.'
        }
      ];
    }

    return { amenities, hotels, flights, itinerary };
  };

  return (
    <section id="packages" className="py-20 lg:py-28 bg-[#080809] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-[#d4af37]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#996515]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/35 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{dict.packages?.badge || (isBn ? 'মোরা অনুমোদিত প্যাকেজ' : 'MoRA Verified Pilgrimage Packages')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {dict.packages?.titleMain || (isBn ? 'পবিত্র হজ ও ওমরাহ' : 'Curated Sacred')} <span className="text-kiswah-gold">{dict.packages?.titleGold || (isBn ? 'প্রিমিয়াম প্যাকেজসমূহ' : 'Pilgrimage Packages')}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {dict.packages?.subheading || (isBn 
              ? 'সরাসরি ফ্লাইট, তারকা মানের হোটেল, ভিআইপি পরিবহন ও অভিজ্ঞ মোয়াল্লেম নির্দেশনাসহ সম্পূর্ণ সুবিধা সমৃদ্ধ হজ ও ওমরাহ সার্ভিস।' 
              : 'All-inclusive, fully licensed pilgrimage packages with direct flights, 0m-50m Haram courtyard proximity, and eminent scholar guidance.')}
          </p>

          {/* Umrah vs Hajj Switcher */}
          <div className="pt-3 flex items-center justify-center">
            <div className="bg-[#121214] p-1.5 rounded-2xl border border-[#d4af37]/30 inline-flex shadow-xl">
              <button
                onClick={() => setActiveTab('umrah')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                  activeTab === 'umrah'
                    ? 'bg-kiswah-gold text-[#080809] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isBn ? 'উমরাহ প্যাকেজসমূহ' : 'VIP Umrah Packages'}
              </button>

              <button
                onClick={() => setActiveTab('hajj')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                  activeTab === 'hajj'
                    ? 'bg-kiswah-gold text-[#080809] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isBn ? 'হজ প্যাকেজসমূহ' : 'Royal Hajj Packages'}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Header Controls: Subtle Gold Navigation Arrows */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs text-slate-400 font-mono">
            {isBn ? 'সোয়াইপ করে সকল প্যাকেজ দেখুন' : 'Swipe or use arrows to explore tiers'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isBeginning 
                  ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'border-[#d4af37]/50 text-[#d4af37] bg-white/[0.03] hover:bg-[#d4af37] hover:text-[#080809] hover:shadow-lg hover:shadow-[#d4af37]/20'
              }`}
              aria-label="Previous package"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isEnd 
                  ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'border-[#d4af37]/50 text-[#d4af37] bg-white/[0.03] hover:bg-[#d4af37] hover:text-[#080809] hover:shadow-lg hover:shadow-[#d4af37]/20'
              }`}
              aria-label="Next package"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Package Carousel (Swiper.js) with 3D Flip tab transition */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center text-slate-500 font-mono text-sm"
            >
              {isBn ? 'প্যাকেজসমূহ লোড হচ্ছে...' : 'Loading verified packages from LabbaikHorizon API...'}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, rotateY: 15, scale: 0.96 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -15, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
              className="relative"
            >
            <Swiper
              modules={[Navigation, Pagination, A11y, Keyboard]}
              spaceBetween={24}
              slidesPerView={1}
              keyboard={{ enabled: true }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
                setActiveIndex(swiper.activeIndex);
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 28,
                },
              }}
              className="packages-swiper pb-12"
            >
              {packages.map((pkg, idx) => {
                const title = isBn ? (pkg.title_bn || pkg.title_en) : (pkg.title_en || pkg.title_bn);
                const badge = isBn ? (pkg.badge_bn || pkg.badge_en) : (pkg.badge_en || pkg.badge_bn);
                const features = isBn ? (pkg.features_bn || pkg.features_en || []) : (pkg.features_en || pkg.features_bn || []);
                const priceDisplay = `৳ ${Number(pkg.priceBDT || 185000).toLocaleString('en-IN')}${isBn ? '/-' : ''}`;

                // High-Resolution Islamic Imagery Selection with dynamic Admin URL fallback
                const getPackageVisualImage = (item) => {
                  const directUrl = item.imageUrl || item.image_url || item.image;
                  if (directUrl && typeof directUrl === 'string' && directUrl.startsWith('http')) {
                    return directUrl;
                  }
                  const q = `${item.id || ''} ${item.title_en || ''} ${item.badge_en || ''} ${item.type || ''}`.toLowerCase();
                  if (q.includes('ramadan') || q.includes('clocktower') || q.includes('clock tower') || q.includes('penthouse')) {
                    return 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200';
                  }
                  if (q.includes('madinah') || q.includes('nabawi') || q.includes('prophet') || q.includes('green dome')) {
                    return 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&q=80&w=1200';
                  }
                  if (q.includes('hajj') || q.includes('presidential')) {
                    return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200';
                  }
                  return 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200';
                };

                const cardImage = getPackageVisualImage(pkg);

                return (
                  <SwiperSlide key={pkg.id} className="h-auto">
                    <div className="h-full bg-kiswah-card rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/65 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group">
                      
                      {/* Curated High-Resolution Islamic Visual Header with Dark Gradient Overlay */}
                      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={cardImage}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        {/* Subtle dark gradient overlay at the bottom so title text overlays cleanly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/30 to-transparent pointer-events-none" />

                        {/* Top floating badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                          <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-lg">
                            {badge}
                          </span>
                          {pkg.isPopular && (
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/40 font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-lg">
                              {isBn ? '★ সর্বাধিক পছন্দের' : '★ Most Popular'}
                            </span>
                          )}
                        </div>

                        {/* Bottom-left floating duration info on image */}
                        <div className="absolute bottom-3 left-4 z-10 pointer-events-none">
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono">
                            <Sparkles className="w-3 h-3 text-[#d4af37]" />
                            <span>{pkg.duration_en || (pkg.type === 'hajj' ? (isBn ? '৪০ দিন স্থায়ী হজ' : '40 Days Hajj') : (isBn ? '১৪ দিন ওমরাহ' : '14 Days Umrah'))}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title Header right below image */}
                      <div className="p-6 pb-2">
                        <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                          {title}
                        </h3>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="space-y-2 pt-1">
                            {features.slice(0, 4).map((f, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                                <span className="font-light">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 space-y-4">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                              {isBn ? 'আনুমানিক বিনিয়োগ' : 'Package Investment'}
                            </span>
                            <div className="text-xl font-serif font-extrabold text-kiswah-gold">
                              {priceDisplay}
                            </div>
                          </div>

                          {/* Dual Action Buttons: "Book Now" & "See Details" */}
                          <div className="grid grid-cols-2 gap-2.5 pt-1">
                            {/* "Book Now" Direct Trigger */}
                            <button
                              onClick={() => {
                                if (onSelectPackage) {
                                  onSelectPackage({
                                    tier: title,
                                    packageName: title,
                                    totalBDT: pkg.priceBDT,
                                    totalUSD: pkg.priceUSD,
                                    features: features,
                                    type: activeTab.toUpperCase()
                                  });
                                }
                              }}
                              className="py-3 px-3 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <span>{isBn ? 'বুকিং করুন' : 'Book Now'}</span>
                            </button>

                            {/* "See Details" Modal Trigger */}
                            <button
                              onClick={() => {
                                setSelectedDetailPkg(pkg);
                                setDetailTab('amenities');
                              }}
                              className="py-3 px-3 bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 hover:text-[#d4af37] border border-slate-700 hover:border-[#d4af37]/60 font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>{isBn ? 'বিস্তারিত দেখুন' : 'See Details'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Custom Active Bullet Indicators */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {packages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => swiperRef.current?.slideTo(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'w-8 bg-kiswah-gold'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* CLEAN & MINIMALIST "VIEW DETAILS" MODAL */}
      <AnimatePresence>
        {selectedDetailPkg && (() => {
          const title = isBn ? (selectedDetailPkg.title_bn || selectedDetailPkg.title_en) : (selectedDetailPkg.title_en || selectedDetailPkg.title_bn);
          const badge = isBn ? (selectedDetailPkg.badge_bn || selectedDetailPkg.badge_en) : (selectedDetailPkg.badge_en || selectedDetailPkg.badge_bn);
          const priceDisplay = `৳ ${Number(selectedDetailPkg.priceBDT || 185000).toLocaleString('en-IN')}${isBn ? '/-' : ''}`;
          const tabsData = getPackageTabsData(selectedDetailPkg);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
              {/* Modal Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDetailPkg(null)}
                className="fixed inset-0 bg-[#080809]/85 backdrop-blur-2xl transition-opacity"
              />

              {/* Modal Window Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative bg-[#101013] border border-[#d4af37]/40 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[85vh]"
              >
                {/* Header Visual with Gradient Overlay */}
                <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
                  <img
                    src={selectedDetailPkg.imageUrl || selectedDetailPkg.image_url || selectedDetailPkg.image || 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200'}
                    alt={title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-[#101013]/60 to-transparent" />

                  {/* Top Bar with Badge & 44x44px Close Button */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider shadow-lg">
                      {badge}
                    </span>

                    <button
                      onClick={() => setSelectedDetailPkg(null)}
                      className="w-11 h-11 rounded-full bg-[#080809]/80 hover:bg-[#d4af37] text-slate-300 hover:text-[#080809] border border-[#d4af37]/40 flex items-center justify-center transition-all cursor-pointer shadow-xl"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title Header */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight">
                      {title}
                    </h3>
                  </div>
                </div>

                {/* Tabbed Navigation Bar (4 Breakdown Tabs) */}
                <div className="bg-[#0a0a0c] border-b border-slate-800 px-4 sm:px-6 flex overflow-x-auto scrollbar-none gap-2 sm:gap-4 shrink-0">
                  <button
                    onClick={() => setDetailTab('amenities')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      detailTab === 'amenities'
                        ? 'text-[#d4af37] border-[#d4af37]'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isBn ? 'অন্তর্ভুক্ত সুবিধাসমূহ' : 'Included Amenities'}</span>
                  </button>

                  <button
                    onClick={() => setDetailTab('hotels')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      detailTab === 'hotels'
                        ? 'text-[#d4af37] border-[#d4af37]'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{isBn ? 'হোটেল ও দূরত্ব' : 'Hotel Proximity & Stars'}</span>
                  </button>

                  <button
                    onClick={() => setDetailTab('flights')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      detailTab === 'flights'
                        ? 'text-[#d4af37] border-[#d4af37]'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                    <span>{isBn ? 'ফ্লাইট ও লাগেজ' : 'Flight & Luggage'}</span>
                  </button>

                  <button
                    onClick={() => setDetailTab('itinerary')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      detailTab === 'itinerary'
                        ? 'text-[#d4af37] border-[#d4af37]'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isBn ? 'দৈনন্দিন সফরসূচি' : 'Day-by-Day Journey'}</span>
                  </button>
                </div>

                {/* Tab Content Body (Scrollable with explicit flex constraint) */}
                <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1 min-h-0 pr-2 sm:pr-4">
                  
                  {/* TAB 1: Included Amenities */}
                  {detailTab === 'amenities' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h4 className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                        {isBn ? 'প্যাকেজের প্রধান বিশেষত্ব' : 'White-Glove Inclusions & Privileges'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tabsData.amenities.map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-slate-800 space-y-1">
                            <div className="flex items-center gap-2 text-sm font-serif font-bold text-white">
                              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                              <span>{item.title}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-light pl-6">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: Hotel Proximity & Stars */}
                  {detailTab === 'hotels' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                        {isBn ? 'মক্কা ও মদিনা আবাসন বিবরণ' : 'Holy Sanctuaries Accommodations'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tabsData.hotels.map((h, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-[#d4af37]/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                                {h.city}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-amber-300 text-[10px] font-bold border border-[#d4af37]/30">
                                {h.rating}
                              </span>
                            </div>
                            <h5 className="text-base font-serif font-bold text-white">
                              {h.hotel}
                            </h5>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{h.dist}</span>
                            </div>
                            <p className="text-xs text-slate-300 font-light leading-relaxed pt-1 border-t border-slate-800">
                              {h.features}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: Flight Carrier & Luggage Specs */}
                  {detailTab === 'flights' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                        {isBn ? 'বিমান ও লাগেজ নীতিমালা' : 'Aviation & Baggage Allowances'}
                      </h4>
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-500 block">
                              {isBn ? 'এয়ারলাইন্স ক্যারিয়ার' : 'Airline Carrier'}
                            </span>
                            <span className="text-sm font-serif font-bold text-white">
                              {tabsData.flights.carrier}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-500 block">
                              {isBn ? 'উড়োজাহাজ মডেল' : 'Aircraft'}
                            </span>
                            <span className="text-sm font-serif font-bold text-white">
                              {tabsData.flights.aircraft}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-500 block">
                            {isBn ? 'ফ্লাইট রুট' : 'Flight Route'}
                          </span>
                          <span className="text-xs text-[#d4af37] font-semibold">
                            {tabsData.flights.route}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-start gap-3">
                          <Luggage className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-serif font-bold text-white block">
                              {isBn ? 'লাগেজ ক্যাপাসিটি' : 'Baggage Allowance'}
                            </span>
                            <p className="text-xs text-slate-300 font-light mt-0.5">
                              {tabsData.flights.luggage}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-start gap-3">
                          <Award className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-serif font-bold text-white block">
                              {isBn ? 'সিআইপি লাউঞ্জ প্রোটোকল' : 'CIP Fast-Track Protocol'}
                            </span>
                            <p className="text-xs text-slate-300 font-light mt-0.5">
                              {tabsData.flights.vipAccess}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: Day-by-Day Journey Outline */}
                  {detailTab === 'itinerary' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pb-6"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                          {isBn ? `${tabsData.itinerary.length} দিনের সাজানো পবিত্র সফরসূচি` : `${tabsData.itinerary.length}-Day Detailed Itinerary`}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          {isBn ? 'প্রতিদিনের পূর্ণাঙ্গ বিবরণ' : 'Daily Plan'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tabsData.itinerary.map((step, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-slate-800 hover:border-[#d4af37]/40 transition-colors">
                            <span className="w-20 shrink-0 text-xs font-mono font-bold text-[#d4af37] pt-0.5">
                              {step.day}
                            </span>
                            <div className="space-y-1 flex-1">
                              <h5 className="text-sm font-serif font-bold text-white">
                                {step.title}
                              </h5>
                              <p className="text-xs text-slate-300 font-light leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Price Summary Card Footer with Instant "Proceed to Booking" CTA */}
                <div className="p-5 sm:p-6 bg-[#0c0c0e] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                      {isBn ? 'আনুমানিক সর্বমোট প্যাকেজ মূল্য' : 'Estimated Total Investment'}
                    </span>
                    <div className="text-2xl font-serif font-extrabold text-kiswah-gold">
                      {priceDisplay}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        const pkgToBook = selectedDetailPkg;
                        setSelectedDetailPkg(null);
                        if (onSelectPackage) {
                          const resolvedTitle = isBn ? (pkgToBook.title_bn || pkgToBook.title_en) : (pkgToBook.title_en || pkgToBook.title_bn);
                          onSelectPackage({
                            tier: resolvedTitle,
                            packageName: resolvedTitle,
                            totalBDT: pkgToBook.priceBDT,
                            totalUSD: pkgToBook.priceUSD,
                            features: isBn ? (pkgToBook.features_bn || pkgToBook.features_en) : (pkgToBook.features_en || pkgToBook.features_bn),
                            type: (pkgToBook.type || activeTab).toUpperCase()
                          });
                        }
                      }}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02]"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{isBn ? 'বুকিং নিশ্চিত করুন' : 'Proceed to Booking'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </section>
  );
}
