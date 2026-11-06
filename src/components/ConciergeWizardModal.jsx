import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ArrowLeft, ArrowRight, Crown, Building2, Car, Sparkles, 
  Users, Check, CheckCircle2, ShieldCheck, Download, MessageSquare, 
  Send, Calendar, Plane, User, Phone, MapPin, Star, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DICTIONARY, CONCIERGE_DATA, AGENCY_CREDENTIALS } from '../data/mockData';
import { ordersAPI, hotelsAPI, FALLBACK_HOTELS } from '../services/api';

const BDT_TO_USD = 122.5; // 1 USD = 122.5 BDT
const BDT_TO_SAR = 32.5;  // 1 SAR = 32.5 BDT
const VISA_INSURANCE_PER_PERSON_BDT = 28000;

export default function ConciergeWizardModal({ locale, isOpen, onClose, onOpenPdfModal }) {
  if (!isOpen) return null;

  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  // Wizard Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- STEP 1: HORIZON & DELEGATION ---
  const [tripCategory, setTripCategory] = useState('vip_umrah'); // 'vip_umrah' | 'royal_hajj'
  const [seasonHorizon, setSeasonHorizon] = useState('ramadan'); // 'ramadan' | 'winter' | 'flexible'
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // --- STEP 2: SANCTUARY SUITES (MAKKAH & MADINAH) ---
  const [makkahHotelId, setMakkahHotelId] = useState('raffles');
  const [madinahHotelId, setMadinahHotelId] = useState('oberoi');
  const [makkahNights, setMakkahNights] = useState(5);
  const [madinahNights, setMadinahNights] = useState(4);
  const [occupancy, setOccupancy] = useState('double'); // 'single' | 'double' | 'royal_family'

  // --- STEP 3: GROUND & RAIL TRANSPORT ---
  const [selectedVehicleId, setSelectedVehicleId] = useState('gmc');
  const [selectedRouteIds, setSelectedRouteIds] = useState(['jed_mak', 'mak_med_train']);

  // --- STEP 4: WHITE-GLOVE ADD-ONS ---
  const [selectedAddonIds, setSelectedAddonIds] = useState(['scholar', 'cip_fasttrack', 'zamzam_home', 'nusuk_concierge']);

  // --- STEP 5: LEAD CAPTURE ---
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [flightCarrier, setFlightCarrier] = useState('saudia'); // 'biman' | 'saudia' | 'emirates'

  // Keyboard Escape Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Quick Preset Handlers for Step 1
  const applyPreset = (preset) => {
    if (preset === 'solo') {
      setAdults(1); setChildren(0); setInfants(0);
    } else if (preset === 'couple') {
      setAdults(2); setChildren(0); setInfants(0);
    } else if (preset === 'family') {
      setAdults(4); setChildren(2); setInfants(0);
    }
  };

  // Dynamic Hotels Catalog from CMS / API
  const [hotelsList, setHotelsList] = useState(FALLBACK_HOTELS);

  useEffect(() => {
    loadHotels();

    const handleHotelsUpdated = () => {
      loadHotels();
    };

    window.addEventListener('horizon:hotels-updated', handleHotelsUpdated);
    return () => {
      window.removeEventListener('horizon:hotels-updated', handleHotelsUpdated);
    };
  }, []);

  const loadHotels = async () => {
    try {
      const data = await hotelsAPI.getAll('all');
      if (data && data.length > 0) {
        setHotelsList(data);
      }
    } catch (err) {
      console.warn('Could not load dynamic hotels in wizard:', err);
    }
  };

  const makkahHotels = useMemo(() => {
    const list = hotelsList.filter(h => h.city?.toLowerCase() === 'makkah');
    return list.length > 0 ? list : CONCIERGE_DATA.hotels.makkah;
  }, [hotelsList]);

  const madinahHotels = useMemo(() => {
    const list = hotelsList.filter(h => h.city?.toLowerCase() === 'madinah');
    return list.length > 0 ? list : CONCIERGE_DATA.hotels.madinah;
  }, [hotelsList]);

  // Selected Data Objects
  const selectedMakkahHotel = useMemo(() => {
    return makkahHotels.find(h => h.id === makkahHotelId) || makkahHotels[0] || CONCIERGE_DATA.hotels.makkah[0];
  }, [makkahHotelId, makkahHotels]);

  const selectedMadinahHotel = useMemo(() => {
    return madinahHotels.find(h => h.id === madinahHotelId) || madinahHotels[0] || CONCIERGE_DATA.hotels.madinah[0];
  }, [madinahHotelId, madinahHotels]);

  const selectedVehicle = useMemo(() => {
    return CONCIERGE_DATA.vehicles.find(v => v.id === selectedVehicleId) || CONCIERGE_DATA.vehicles[0];
  }, [selectedVehicleId]);

  // Occupancy Factor
  const occupancyFactor = useMemo(() => {
    if (occupancy === 'single') return 2.5;
    if (occupancy === 'double') return 1.5;
    return 1.0; // royal_family share
  }, [occupancy]);

  // Dynamic Valuation Engine
  const valuation = useMemo(() => {
    // 1. Accommodations Total
    const makkahCost = Math.round(selectedMakkahHotel.nightlyBdt * makkahNights * occupancyFactor);
    const madinahCost = Math.round(selectedMadinahHotel.nightlyBdt * madinahNights * occupancyFactor);
    const totalAccommodationsBDT = makkahCost + madinahCost;

    // 2. Transport Total (route baseBdt * vehicle ratePerKm)
    let totalTransportBDT = 0;
    selectedRouteIds.forEach(id => {
      const r = CONCIERGE_DATA.routes.find(route => route.id === id);
      if (r) {
        totalTransportBDT += Math.round(r.baseBdt * selectedVehicle.ratePerKm);
      }
    });

    // 3. Add-ons Total
    let totalAddonsBDT = 0;
    selectedAddonIds.forEach(id => {
      const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
      if (a) {
        totalAddonsBDT += a.bdt;
      }
    });

    // 4. Visa & Mandatory Medical Insurance Total per person
    const totalPayingGuests = adults + children;
    const totalVisaInsuranceBDT = totalPayingGuests * VISA_INSURANCE_PER_PERSON_BDT;

    // 5. Trip Category Multiplier
    const tripCategoryMultiplier = tripCategory === 'royal_hajj' ? 1.8 : 1.0;

    // Grand Total BDT
    const grandTotalBDT = Math.round(
      (totalAccommodationsBDT + totalTransportBDT + totalAddonsBDT + totalVisaInsuranceBDT) * tripCategoryMultiplier
    );

    const grandTotalUSD = Math.round(grandTotalBDT / BDT_TO_USD);
    const grandTotalSAR = Math.round(grandTotalBDT / BDT_TO_SAR);
    const perPersonBDT = totalPayingGuests > 0 ? Math.round(grandTotalBDT / totalPayingGuests) : grandTotalBDT;
    const perPersonUSD = Math.round(perPersonBDT / BDT_TO_USD);

    return {
      makkahCost,
      madinahCost,
      totalAccommodationsBDT,
      totalTransportBDT,
      totalAddonsBDT,
      totalVisaInsuranceBDT,
      grandTotalBDT,
      grandTotalUSD,
      grandTotalSAR,
      perPersonBDT,
      perPersonUSD,
      totalPayingGuests
    };
  }, [
    selectedMakkahHotel, selectedMadinahHotel, makkahNights, madinahNights, occupancyFactor,
    selectedVehicle, selectedRouteIds, selectedAddonIds, adults, children, tripCategory
  ]);

  // Route Toggle
  const toggleRoute = (id) => {
    if (selectedRouteIds.includes(id)) {
      setSelectedRouteIds(selectedRouteIds.filter(r => r !== id));
    } else {
      setSelectedRouteIds([...selectedRouteIds, id]);
    }
  };

  // Addon Toggle
  const toggleAddon = (id) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter(a => a !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  // Step Step Navigation
  const goNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Final Action 1: Download PDF
  const handleDownloadPdf = () => {
    const routeNames = selectedRouteIds.map(id => {
      const r = CONCIERGE_DATA.routes.find(route => route.id === id);
      return isBn ? r?.name_bn : r?.name_en;
    });

    const addonNames = selectedAddonIds.map(id => {
      const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
      return isBn ? a?.name_bn : a?.name_en;
    });

    const pdfData = {
      leadName: leadName || (isBn ? 'সম্মানিত তীর্থযাত্রী' : 'Distinguished Pilgrim'),
      leadPhone: leadPhone || '+880 1700-000000',
      season: seasonHorizon === 'ramadan' 
        ? (isBn ? 'রমজান (শেষ ১০ রাত)' : 'Ramadan (Royal Last 10 Nights)') 
        : seasonHorizon === 'winter' 
        ? (isBn ? 'শীতকালীন পবিত্র মাস' : 'Winter Sacred Season') 
        : (isBn ? 'স্বাচ্ছন্দ্যময় তারিখ' : 'Flexible Dates'),
      tripType: tripCategory === 'royal_hajj' ? 'Royal Executive Hajj' : 'VIP Umrah Sanctum',
      departureCity: 'Dhaka (DAC)',
      airlineType: flightCarrier.toUpperCase(),
      makkahHotel: `${selectedMakkahHotel.name} (${makkahNights} Nights)`,
      madinahHotel: `${selectedMadinahHotel.name} (${madinahNights} Nights)`,
      vehicle: selectedVehicle.name,
      routes: routeNames,
      selectedAddons: addonNames,
      adults,
      children,
      infants,
      occupancy: occupancy === 'single' ? 'Single Room' : occupancy === 'double' ? 'Twin/Double' : 'Family Share',
      perPersonBDT: valuation.perPersonBDT,
      perPersonUSD: valuation.perPersonUSD,
      totalGroupBDT: valuation.grandTotalBDT,
      totalGroupUSD: valuation.grandTotalUSD,
      totalGroupSAR: valuation.grandTotalSAR,
      visaInsuranceBDT: valuation.totalVisaInsuranceBDT,
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onOpenPdfModal) {
      onOpenPdfModal(pdfData);
    }
  };

  // Final Action 2: WhatsApp Booking
  const handleWhatsAppBooking = () => {
    const routeList = selectedRouteIds.map(id => {
      const r = CONCIERGE_DATA.routes.find(route => route.id === id);
      return `  • ${isBn ? r?.name_bn : r?.name_en}`;
    }).join('\n');

    const addOnList = selectedAddonIds.map(id => {
      const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
      return `  • ${isBn ? a?.name_bn : a?.name_en}`;
    }).join('\n');

    const msg = `Assalamu Alaikum! I have curated a Bespoke Custom Pilgrimage Itinerary on LabbaikHorizon:

👤 *Guest Name:* ${leadName || 'Pilgrim Delegation'}
📱 *Phone:* ${leadPhone || '+880...'}
🕋 *Trip Category:* ${tripCategory === 'royal_hajj' ? 'Royal Executive Hajj' : 'VIP Umrah Sanctum'} (${seasonHorizon.toUpperCase()})
✈️ *Preferred Airline:* ${flightCarrier.toUpperCase()}

🏨 *Sanctuary Accommodations:*
  - Makkah: ${selectedMakkahHotel.name} (${makkahNights} Nights)
  - Madinah: ${selectedMadinahHotel.name} (${madinahNights} Nights)

🚗 *Private Fleet & Logistics:*
  - Vehicle: ${selectedVehicle.name} (${selectedVehicle.badge})
${routeList}

✨ *White-Glove Privileges:*
${addOnList}

👥 *Delegation Count:* ${adults} Adults, ${children} Children, ${infants} Infants

💰 *Grand Investment Valuation:*
  - Total: ৳${valuation.grandTotalBDT.toLocaleString('en-IN')}/-
  - Per Person: ৳${valuation.perPersonBDT.toLocaleString('en-IN')}/-

Please connect me with your Private Client Director to confirm our booking.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/8801700000000?text=${encoded}`, '_blank');
  };

  // Final Action 3: Submit Dossier Form
  const handleSubmitDossier = async (e) => {
    e.preventDefault();

    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#996515', '#ffffff']
    });

    try {
      await ordersAPI.create({
        type: 'vip_dossier',
        customerName: leadName,
        customerPhone: leadPhone,
        notes: `Category: ${tripCategory}. Season: ${seasonHorizon}. Airline: ${flightCarrier}. Delegation: ${adults}A, ${children}C, ${infants}I.`,
        tier: tripCategory === 'royal_hajj' ? 'Royal Executive Hajj' : 'VIP Umrah Sanctum',
        makkahHotel: `${selectedMakkahHotel.name} (${makkahNights} Nights)`,
        madinahHotel: `${selectedMadinahHotel.name} (${madinahNights} Nights)`,
        totalBDT: valuation.grandTotalBDT,
        totalUSD: valuation.grandTotalUSD
      });
    } catch (err) {
      console.warn('Could not record dossier to backend:', err);
    }

    setIsSubmitted(true);
  };

  // Step Titles for Progress Header
  const stepTitles = [
    isBn ? 'ধাপ ১/৫: সফরের ক্যাটাগরি ও যাত্রী সংখ্যা' : 'Step 1 of 5: Pilgrimage Horizon & Delegation Size',
    isBn ? 'ধাপ ২/৫: হারামের রাজকীয় স্যুইটসমূহ' : 'Step 2 of 5: Sanctuary Suites & Proximity',
    isBn ? 'ধাপ ৩/৫: প্রাইভেট লজিস্টিকস ও শফার কার' : 'Step 3 of 5: VIP Ground & Rail Transport',
    isBn ? 'ধাপ ৪/৫: বিশেষ ভিআইপি সুবিধাসমূহ' : 'Step 4 of 5: White-Glove Add-ons & Rawdah Coordination',
    isBn ? 'ধাপ ৫/৫: ফাইনাল বাজেট ও অফিশিয়াল ফাইল' : 'Step 5 of 5: The Final Round & Grand Valuation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080809]/95 backdrop-blur-2xl border border-[#d4af37]/30 text-slate-100 overflow-hidden font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      
      {/* Ambient Halo Spots */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#996515]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP WIZARD HEADER BAR */}
      <div className="bg-[#050505] border-b border-[#d4af37]/25 py-3.5 px-4 sm:px-8 flex items-center justify-between z-20 relative shrink-0">
        
        {/* Brand & Progress Bar */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕋</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-wider">
              Labbaik<span className="text-[#d4af37]">Horizon</span>
            </span>
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-wider">
              {stepTitles[currentStep - 1]}
            </span>
            <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-gradient-to-r from-[#996515] to-[#d4af37] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Running Total & Close Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
              {isBn ? 'চলতি আনুমানিক বাজেট' : 'Est. Running Total'}
            </span>
            <span className="text-sm sm:text-base font-serif font-extrabold text-kiswah-gold">
              ৳{valuation.grandTotalBDT.toLocaleString('en-IN')}{isBn ? '/-' : ''}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] border border-slate-800 text-slate-400 hover:text-white hover:border-[#d4af37]/50 transition-colors cursor-pointer"
            title="Press ESC to close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE STEP PROGRESS BAR (Shown only on small screens) */}
      <div className="md:hidden bg-[#0a0a0c] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <span className="font-serif font-bold text-[#d4af37]">{stepTitles[currentStep - 1]}</span>
        <span className="font-mono text-slate-400">{currentStep}/5</span>
      </div>

      {/* MAIN CONTENT BODY (SCROLLABLE STEP PANELS) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 max-w-5xl mx-auto w-full">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PILGRIMAGE HORIZON & DELEGATION SIZE */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-[#d4af37]/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider mb-2">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Step 1: Journey Scope & Delegation</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  {isBn ? 'আপনার পবিত্র সফরের পরিকল্পনা ও যাত্রী সংখ্যা' : 'Select Pilgrimage Horizon & Delegation Size'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                  Choose your journey type, seasonal horizon, and traveling family delegation parameters.
                </p>
              </div>

              {/* TRIP CATEGORY SELECTION */}
              <div className="space-y-3">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                  1. Trip Category Benchmark
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'vip_umrah', titleEn: 'VIP Umrah Sanctum', titleBn: 'ভিআইপি ওমরাহ স্যাঙ্কটাম', descEn: 'Year-round bespoke Umrah with presidential penthouse suites', descBn: 'সারা বছর ব্যাপী প্রেসিডেন্সিয়াল স্যুইট সহ অভিজাত ওমরাহ' },
                    { id: 'royal_hajj', titleEn: 'Royal Executive Hajj', titleBn: 'রাজকীয় এক্সিকিউティブ হজ', descEn: 'Direct Mina VIP tents & 0m Haram suite accommodations', descBn: 'মিনা চত্বরে এয়ারকন্ডিশনড রাজকীয় তাবু ও সরাসরি হারাম হোটেল' }
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setTripCategory(cat.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                        tripCategory === cat.id
                          ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                          : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-base text-white">
                          {isBn ? cat.titleBn : cat.titleEn}
                        </h3>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          tripCategory === cat.id ? 'bg-kiswah-gold border-[#d4af37] text-[#080809]' : 'border-slate-700'
                        }`}>
                          {tripCategory === cat.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-light">{isBn ? cat.descBn : cat.descEn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEASON HORIZON SELECTION */}
              <div className="space-y-3">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                  2. Season Horizon Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'ramadan', labelEn: 'Upcoming Ramadan (Royal Last 10 Nights)', labelBn: 'আসন্ন রমজান (শেষ ১০ রাত)' },
                    { id: 'winter', labelEn: 'Winter Sacred Season (Dec - Feb)', labelBn: 'শীতকালীন পবিত্র মাস (ডিসেম্বর - ফেব্রুয়ারি)' },
                    { id: 'flexible', labelEn: 'Flexible Custom Dates', labelBn: 'স্বাচ্ছন্দ্যময় তারিখ' }
                  ].map((season) => (
                    <button
                      key={season.id}
                      type="button"
                      onClick={() => setSeasonHorizon(season.id)}
                      className={`p-4 rounded-xl border text-left text-xs font-serif font-semibold cursor-pointer transition-all ${
                        seasonHorizon === season.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{isBn ? season.labelBn : season.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DELEGATION COUNTERS & QUICK PRESETS */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                    3. Traveling Family Delegation Size
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono uppercase">Quick Presets:</span>
                    <button onClick={() => applyPreset('solo')} className="px-2.5 py-1 bg-white/[0.04] border border-slate-700 rounded-lg hover:border-[#d4af37] text-slate-300 hover:text-white">Solo Pilgrim</button>
                    <button onClick={() => applyPreset('couple')} className="px-2.5 py-1 bg-white/[0.04] border border-slate-700 rounded-lg hover:border-[#d4af37] text-slate-300 hover:text-white">Couple (2)</button>
                    <button onClick={() => applyPreset('family')} className="px-2.5 py-1 bg-white/[0.04] border border-slate-700 rounded-lg hover:border-[#d4af37] text-slate-300 hover:text-white">Royal Family (4-6)</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-serif font-bold text-white block">Adults (12+ yrs)</span>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">-</button>
                      <span className="font-mono font-bold text-white text-lg">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">+</button>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-serif font-bold text-white block">Children (2–11 yrs)</span>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">-</button>
                      <span className="font-mono font-bold text-white text-lg">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">+</button>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-serif font-bold text-white block">Infants (&lt;2 yrs)</span>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">-</button>
                      <span className="font-mono font-bold text-white text-lg">{infants}</span>
                      <button onClick={() => setInfants(infants + 1)} className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold text-base">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SANCTUARY SUITES & PROXIMITY */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-[#d4af37]/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Step 2: Haramain Penthouse & Suite Proximity</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  {isBn ? 'হারামাইন রাজকীয় হোটেল ও স্যুইটসমূহ' : 'Sanctuary Suites & Proximity (Makkah & Madinah)'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                  Select your preferred 5-star courtyard hotels and stay durations in Makkah & Madinah.
                </p>
              </div>

              {/* MAKKAH HOTELS */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                    Makkah Accommodation (Radio Visual Cards)
                  </label>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Nights in Makkah:</span>
                    <div className="flex items-center gap-1.5 bg-[#080809] border border-slate-700 px-2.5 py-1 rounded-lg">
                      <button onClick={() => setMakkahNights(Math.max(1, makkahNights - 1))} className="text-amber-300 font-bold px-1 font-mono text-sm">-</button>
                      <span className="font-mono font-bold text-white px-1">{makkahNights}</span>
                      <button onClick={() => setMakkahNights(makkahNights + 1)} className="text-amber-300 font-bold px-1 font-mono text-sm">+</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {makkahHotels.map((hotel) => {
                    const isSelected = makkahHotelId === hotel.id;
                    const hotelName = isBn ? (hotel.nameBn || hotel.name) : hotel.name;
                    const hotelDist = isBn ? (hotel.distBn || hotel.dist) : hotel.dist;
                    return (
                      <div
                        key={hotel.id}
                        onClick={() => setMakkahHotelId(hotel.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                            : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-kiswah-gold border-[#d4af37] text-[#080809]' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-sm text-white">{hotelName}</h4>
                              <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                {hotelDist}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-light mt-0.5">
                              {hotel.starRating || (isBn ? '৫-স্টার রাজকীয় স্যুইট' : '5-Star Presidential Courtyard Luxury')}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-serif font-bold text-kiswah-gold block">
                            ৳{Number(hotel.nightlyBdt || 0).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MADINAH HOTELS */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                    Madinah Accommodation
                  </label>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Nights in Madinah:</span>
                    <div className="flex items-center gap-1.5 bg-[#080809] border border-slate-700 px-2.5 py-1 rounded-lg">
                      <button onClick={() => setMadinahNights(Math.max(1, madinahNights - 1))} className="text-amber-300 font-bold px-1 font-mono text-sm">-</button>
                      <span className="font-mono font-bold text-white px-1">{madinahNights}</span>
                      <button onClick={() => setMadinahNights(madinahNights + 1)} className="text-amber-300 font-bold px-1 font-mono text-sm">+</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {madinahHotels.map((hotel) => {
                    const isSelected = madinahHotelId === hotel.id;
                    const hotelName = isBn ? (hotel.nameBn || hotel.name) : hotel.name;
                    const hotelDist = isBn ? (hotel.distBn || hotel.dist) : hotel.dist;
                    return (
                      <div
                        key={hotel.id}
                        onClick={() => setMadinahHotelId(hotel.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                            : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-kiswah-gold border-[#d4af37] text-[#080809]' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-sm text-white">{hotelName}</h4>
                              <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                {hotelDist}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-light mt-0.5">
                              {hotel.starRating || (isBn ? 'মসজিদে নববীর সরাসরি চত্বর সংযোগ' : "Prophet's Mosque Front • VIP Chauffeur Service")}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-serif font-bold text-kiswah-gold block">
                            ৳{Number(hotel.nightlyBdt || 0).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SUITE OCCUPANCY */}
              <div className="pt-2">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  Suite Occupancy Configuration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'single', label: 'Private Single Room', mult: '2.5x Solo Suite Rate' },
                    { id: 'double', label: 'Twin / Double Room', mult: '1.5x Standard Twin Rate' },
                    { id: 'royal_family', label: 'Royal Suite Family Share', mult: '1.0x Base Suite Rate' }
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccupancy(occ.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        occupancy === occ.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-serif font-bold text-white block">{occ.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{occ.mult}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: GROUND & RAIL TRANSPORT */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-[#d4af37]/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider mb-2">
                  <Car className="w-3.5 h-3.5" />
                  <span>Step 3: VIP Fleet & Chauffeur Logistics</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  {isBn ? 'প্রাইভেট লজিস্টিকস ও শফার কার বহর' : 'VIP Ground & Rail Transport (Al Ahsaniya Logistics)'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                  Select your private VIP chauffeur fleet vehicle and inter-city bullet train transfer routes.
                </p>
              </div>

              {/* VEHICLE FLEET */}
              <div className="space-y-3">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                  1. Chauffeur Fleet Selection
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CONCIERGE_DATA.vehicles.slice(0, 3).map((v) => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                            : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-serif font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                          {v.badge}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-white pt-1">{v.name}</h4>
                        <span className="text-xs text-amber-300 font-mono block pt-1">{v.ratePerKm}x Rate Multiplier</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROUTE CHECKBOXES */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                  2. Route Checkbox Selection (Real-Time Dynamic Updates)
                </label>
                <div className="space-y-2.5">
                  {CONCIERGE_DATA.routes.map((route) => {
                    const isChecked = selectedRouteIds.includes(route.id);
                    const routeName = isBn ? route.name_bn : route.name_en;
                    const calculatedBDT = Math.round(route.baseBdt * selectedVehicle.ratePerKm);

                    return (
                      <div
                        key={route.id}
                        onClick={() => toggleRoute(route.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-kiswah-card-active border-[#d4af37] text-white'
                            : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-kiswah-gold border-[#d4af37] text-[#080809]' : 'border-slate-700'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-serif font-semibold">{routeName}</span>
                        </div>

                        <span className="text-xs sm:text-sm font-serif font-bold text-kiswah-gold shrink-0">
                          ৳{calculatedBDT.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: WHITE-GLOVE ADD-ONS */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-[#d4af37]/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 4: Privileges & Rawdah Scheduling</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  {isBn ? 'বিশেষ আভিজাত্য ও রওজা শরিফ পারমিট' : 'White-Glove Add-ons & Rawdah Coordination'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                  Enhance your pilgrimage with 1-on-1 scholars, airport CIP protocol, and Nusuk permit scheduling.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                  Select VIP Privileges (Check All Applicable)
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {CONCIERGE_DATA.addOns.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    const addonName = isBn ? addon.name_bn : addon.name_en;

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isChecked
                            ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                            : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                            isChecked ? 'bg-kiswah-gold border-[#d4af37] text-[#080809]' : 'border-slate-700'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-sm text-white">{addonName}</h4>
                            <p className="text-xs text-slate-400 font-light">MoRA Protocol & White-Glove Execution</p>
                          </div>
                        </div>

                        <span className="text-sm font-serif font-bold text-kiswah-gold shrink-0">
                          +৳{addon.bdt.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: THE FINAL ROUND (GRAND VALUATION & ACTIONS) */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {isSubmitted ? (
                <div className="text-center py-12 space-y-6 max-w-lg mx-auto bg-[#121214] border border-[#d4af37]/40 p-8 rounded-3xl kiswah-gold-glow">
                  <div className="w-20 h-20 bg-[#d4af37]/10 border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white">
                    {isBn ? 'গোপনীয় ফাইল অনুরোধ গৃহীত হয়েছে' : 'Sealed VIP Dossier Requested'}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {isBn 
                      ? 'জাজাকআল্লাহ খাইরান। আমাদের প্রাইভেট ক্লায়েন্ট ডিরেক্টর আপনার ফোন নম্বরে যোগাযোগ করবেন এবং গুলশান-২ লাউঞ্জে কফি ব্রিফিং সময়সূচী নিশ্চিত করবেন।'
                      : 'JazakAllah Khair. Our Private Client Director will contact your phone to confirm your private coffee briefing at Horizon Lounge, Gulshan-2.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-[#d4af37]/20 pb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider mb-2">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Step 5: Final Valuation & Lead Confirmation</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                      {isBn ? 'ফাইনাল আনুমানিক বাজেট ও আইটেমভিত্তিক সারসংক্ষেপ' : 'The Final Round: Grand Valuation & Summary'}
                    </h2>
                  </div>

                  {/* INSTANT GRAND TOTAL DISPLAY */}
                  <div className="bg-gradient-to-b from-[#161619] to-[#0d0d0f] border-2 border-[#d4af37]/50 p-6 sm:p-8 rounded-3xl shadow-2xl kiswah-gold-glow space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-serif uppercase tracking-widest">
                        Estimated Grand Total ({valuation.totalPayingGuests} Guests)
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                        100% Shariah Compliant
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl sm:text-6xl font-serif font-extrabold text-kiswah-gold drop-shadow-md">
                        ৳{valuation.grandTotalBDT.toLocaleString('en-IN')}{isBn ? '/-' : ''}
                      </span>
                      <span className="text-base font-bold text-slate-400">BDT</span>
                    </div>

                    {/* ITEMIZED COST SHEET TABLE */}
                    <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs pt-2">
                      <table className="w-full text-left">
                        <thead className="bg-[#080809] text-amber-300 font-serif font-bold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Item Description</th>
                            <th className="p-3 text-right">Investment Breakdown</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 font-light">
                          <tr>
                            <td className="p-3">
                              <strong>Makkah Stay:</strong> {selectedMakkahHotel.name} ({makkahNights} Nights)
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-white">৳{valuation.makkahCost.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <strong>Madinah Stay:</strong> {selectedMadinahHotel.name} ({madinahNights} Nights)
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-white">৳{valuation.madinahCost.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <strong>Private Vehicle & Rail:</strong> {selectedVehicle.name} ({selectedRouteIds.length} Routes)
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-white">৳{valuation.totalTransportTotalBDT || valuation.totalTransportBDT.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <strong>White-Glove Privileges:</strong> {selectedAddonIds.length} Selected Add-ons
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-white">৳{valuation.totalAddonsBDT.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <strong>MoRA License (HAAB-1420), Saudi e-Visa & Health Insurance:</strong> ৳28,000 / person
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-white">৳{valuation.totalVisaInsuranceBDT.toLocaleString('en-IN')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* LEAD CAPTURE FORM */}
                  <form onSubmit={handleSubmitDossier} className="bg-[#121214] border border-[#d4af37]/30 p-6 rounded-3xl space-y-4">
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#d4af37]" />
                      <span>Pilgrim Delegation Lead Contact Details</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Al-Haj Syful Islam Chowdhury"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-[#080809] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Phone / WhatsApp (+880) *</label>
                        <input
                          type="tel"
                          required
                          placeholder="01711-XXXXXX"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full bg-[#080809] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Flight Carrier Preference</label>
                        <select
                          value={flightCarrier}
                          onChange={(e) => setFlightCarrier(e.target.value)}
                          className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="saudia">Saudia (Royal Direct)</option>
                          <option value="biman">Biman Bangladesh Airlines (Direct VIP)</option>
                          <option value="emirates">Emirates (First Class Transit)</option>
                        </select>
                      </div>
                    </div>

                    {/* FINAL ACTION BUTTONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="py-3.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-[#d4af37]/40 text-amber-300 font-serif font-semibold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#d4af37]" />
                        <span>Download PDF Quotation</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppBooking}
                        className="py-3.5 px-4 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 text-white font-serif font-semibold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Book via WhatsApp</span>
                      </button>

                      <button
                        type="submit"
                        className="py-3.5 px-4 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] shadow-xl"
                      >
                        <Send className="w-4 h-4 text-[#080809]" />
                        <span>Submit Sealed VIP Dossier</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* STICKY FOOTER NAVIGATION BAR */}
      <div className="bg-[#050505] border-t border-[#d4af37]/25 py-3.5 px-4 sm:px-8 flex items-center justify-between z-20 relative shrink-0">
        <button
          onClick={goBack}
          disabled={currentStep === 1}
          className={`px-5 py-2.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 1
              ? 'border-slate-800 text-slate-600 cursor-not-allowed'
              : 'border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-serif font-semibold text-slate-400">
          <span>Step {currentStep} of 5</span>
        </div>

        {currentStep < 5 ? (
          <button
            onClick={goNext}
            className="px-6 py-2.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.02]"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs font-serif text-amber-300 italic">Select final action above</span>
        )}
      </div>

    </div>
  );
}
