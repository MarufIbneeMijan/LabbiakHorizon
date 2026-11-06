import React, { useState, useMemo } from 'react';
import { 
  Building2, Car, Sparkles, Users, Crown, Check, CheckCircle2, 
  ArrowRight, MessageSquare, FileText, Download, ShieldCheck, MapPin, 
  Calendar, Star, CreditCard, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DICTIONARY, CONCIERGE_DATA } from '../data/mockData';

// Conversion Rates
const BDT_TO_SAR = 32.5; // 1 SAR = 32.5 BDT
const BDT_TO_USD = 122.5; // 1 USD = 122.5 BDT

export default function CustomTourBooking({ locale, onOpenConsultation, onOpenDossier, onOpenPdfModal }) {
  const dict = DICTIONARY[locale]?.customBooking || DICTIONARY.en.customBooking;
  const mainDict = DICTIONARY[locale] || DICTIONARY.en;

  // Active Panel Tab state ('hotels' | 'fleet' | 'addons' | 'delegation')
  const [activeTab, setActiveTab] = useState('hotels');

  // --- 1. HOTELS STATE ---
  const [makkahHotelId, setMakkahHotelId] = useState('raffles');
  const [madinahHotelId, setMadinahHotelId] = useState('oberoi');
  const [makkahNights, setMakkahNights] = useState(7);
  const [madinahNights, setMadinahNights] = useState(5);
  const [occupancy, setOccupancy] = useState('double'); // 'quad' | 'triple' | 'double' | 'presidential'

  // --- 2. FLEET & ROUTES STATE ---
  const [selectedVehicleId, setSelectedVehicleId] = useState('gmc');
  const [selectedRouteIds, setSelectedRouteIds] = useState(['jed_mak', 'mak_med_train', 'taif_tour', 'ziyarah_both']);

  // --- 3. ADD-ONS STATE ---
  const [selectedAddonIds, setSelectedAddonIds] = useState(['scholar', 'cip_fasttrack', 'zamzam_home', 'nusuk_concierge']);

  // --- 4. DELEGATION & FLIGHT STATE ---
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flightTier, setFlightTier] = useState('first'); // 'first' | 'business' | 'economy'

  // Selected Objects
  const selectedMakkahHotel = useMemo(() => {
    return CONCIERGE_DATA.hotels.makkah.find(h => h.id === makkahHotelId) || CONCIERGE_DATA.hotels.makkah[0];
  }, [makkahHotelId]);

  const selectedMadinahHotel = useMemo(() => {
    return CONCIERGE_DATA.hotels.madinah.find(h => h.id === madinahHotelId) || CONCIERGE_DATA.hotels.madinah[0];
  }, [madinahHotelId]);

  const selectedVehicle = useMemo(() => {
    return CONCIERGE_DATA.vehicles.find(v => v.id === selectedVehicleId) || CONCIERGE_DATA.vehicles[0];
  }, [selectedVehicleId]);

  // Occupancy Multipliers
  const occupancyMultiplier = useMemo(() => {
    switch (occupancy) {
      case 'quad': return 1.0;
      case 'triple': return 1.25;
      case 'double': return 1.5;
      case 'presidential': return 2.5;
      default: return 1.5;
    }
  }, [occupancy]);

  // Flight Tier Base BDT per person
  const flightRatePerPerson = useMemo(() => {
    switch (flightTier) {
      case 'first': return 320000;
      case 'business': return 195000;
      case 'economy': return 110000;
      default: return 195000;
    }
  }, [flightTier]);

  // --- DYNAMIC REAL-TIME CALCULATION ENGINE ---
  const valuation = useMemo(() => {
    // 1. Makkah Hotel Total
    const makkahHotelTotalBDT = Math.round(selectedMakkahHotel.nightlyBdt * makkahNights * occupancyMultiplier);
    
    // 2. Madinah Hotel Total
    const madinahHotelTotalBDT = Math.round(selectedMadinahHotel.nightlyBdt * madinahNights * occupancyMultiplier);

    const hotelsTotalBDT = makkahHotelTotalBDT + madinahHotelTotalBDT;

    // 3. Private Transport Routes Total (baseBdt * ratePerKm of selected vehicle)
    let transportTotalBDT = 0;
    selectedRouteIds.forEach(routeId => {
      const routeObj = CONCIERGE_DATA.routes.find(r => r.id === routeId);
      if (routeObj) {
        transportTotalBDT += Math.round(routeObj.baseBdt * selectedVehicle.ratePerKm);
      }
    });

    // 4. Add-Ons Total
    let addOnsTotalBDT = 0;
    selectedAddonIds.forEach(addonId => {
      const addonObj = CONCIERGE_DATA.addOns.find(a => a.id === addonId);
      if (addonObj) {
        addOnsTotalBDT += addonObj.bdt;
      }
    });

    // 5. Flights Total
    const totalPayingGuests = adults + children;
    const flightsTotalBDT = (adults * flightRatePerPerson) + (children * flightRatePerPerson * 0.8) + (infants * 25000);

    // 6. Grand Total Investment
    const totalBDT = hotelsTotalBDT + transportTotalBDT + addOnsTotalBDT + flightsTotalBDT;
    
    // Currency Conversions
    const totalSAR = Math.round(totalBDT / BDT_TO_SAR);
    const totalUSD = Math.round(totalBDT / BDT_TO_USD);

    const perPersonBDT = totalPayingGuests > 0 ? Math.round(totalBDT / totalPayingGuests) : totalBDT;
    const perPersonSAR = Math.round(perPersonBDT / BDT_TO_SAR);
    const perPersonUSD = Math.round(perPersonBDT / BDT_TO_USD);

    // 0% Interest EMI Installments
    const emi6MonthsBDT = Math.round(totalBDT / 6);
    const emi12MonthsBDT = Math.round(totalBDT / 12);

    return {
      makkahHotelTotalBDT,
      madinahHotelTotalBDT,
      hotelsTotalBDT,
      transportTotalBDT,
      addOnsTotalBDT,
      flightsTotalBDT,
      totalBDT,
      totalSAR,
      totalUSD,
      perPersonBDT,
      perPersonSAR,
      perPersonUSD,
      totalPayingGuests,
      emi6MonthsBDT,
      emi12MonthsBDT
    };
  }, [
    selectedMakkahHotel, selectedMadinahHotel, makkahNights, madinahNights, occupancyMultiplier,
    selectedVehicle, selectedRouteIds, selectedAddonIds, adults, children, infants, flightRatePerPerson
  ]);

  // Route Selection Toggle
  const toggleRoute = (routeId) => {
    if (selectedRouteIds.includes(routeId)) {
      if (selectedRouteIds.length > 1) {
        setSelectedRouteIds(selectedRouteIds.filter(id => id !== routeId));
      }
    } else {
      setSelectedRouteIds([...selectedRouteIds, routeId]);
    }
  };

  // Add-On Selection Toggle
  const toggleAddon = (addonId) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter(id => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  // Trigger Gold Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#996515', '#ffffff']
    });
  };

  // Request Dossier / Booking
  const handleRequestDossier = () => {
    triggerConfetti();

    const selectedRouteNames = selectedRouteIds.map(id => {
      const r = CONCIERGE_DATA.routes.find(route => route.id === id);
      return locale === 'bn' ? r?.name_bn : r?.name_en;
    });

    const selectedAddonNames = selectedAddonIds.map(id => {
      const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
      return locale === 'bn' ? a?.name_bn : a?.name_en;
    });

    const bookingPayload = {
      tier: locale === 'bn' ? 'কাস্টম বেসপোক ওমরাহ সফর' : 'Bespoke Custom Pilgrimage',
      makkahHotel: selectedMakkahHotel.name,
      madinahHotel: selectedMadinahHotel.name,
      makkahNights,
      madinahNights,
      vehicle: selectedVehicle.name,
      routes: selectedRouteNames,
      addOns: selectedAddonNames,
      adults,
      children,
      infants,
      totalBDT: valuation.totalBDT,
      totalSAR: valuation.totalSAR,
      totalUSD: valuation.totalUSD,
      perPersonBDT: valuation.perPersonBDT,
      perPersonSAR: valuation.perPersonSAR,
      features: [
        `${selectedMakkahHotel.name} (${makkahNights} ${locale === 'bn' ? 'রাত' : 'Nights'})`,
        `${selectedMadinahHotel.name} (${madinahNights} ${locale === 'bn' ? 'রাত' : 'Nights'})`,
        `${selectedVehicle.name} (${selectedVehicle.badge})`,
        ...selectedAddonNames
      ],
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onOpenDossier) {
      onOpenDossier(bookingPayload);
    } else if (onOpenConsultation) {
      onOpenConsultation(bookingPayload);
    }
  };

  // Direct WhatsApp Connection with Detailed Itinerary Text
  const handleWhatsAppBooking = () => {
    triggerConfetti();

    const routeList = selectedRouteIds.map(id => {
      const r = CONCIERGE_DATA.routes.find(route => route.id === id);
      return `• ${locale === 'bn' ? r?.name_bn : r?.name_en}`;
    }).join('\n');

    const addOnList = selectedAddonIds.map(id => {
      const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
      return `• ${locale === 'bn' ? a?.name_bn : a?.name_en}`;
    }).join('\n');

    const message = `Assalamu Alaikum! I have configured a Custom Bespoke Umrah & Ziyarah Itinerary via LabbaikHorizon Booking Engine:

🕋 *Sanctuary Accommodation:*
- Makkah: ${selectedMakkahHotel.name} (${makkahNights} Nights)
- Madinah: ${selectedMadinahHotel.name} (${madinahNights} Nights)

🚗 *Chauffeur Fleet & Routes:*
- Vehicle: ${selectedVehicle.name} (${selectedVehicle.badge})
${routeList}

✨ *VIP Add-On Privileges:*
${addOnList}

👥 *Delegation Size:* ${adults} Adults, ${children} Children, ${infants} Infants

💰 *Investment Summary:*
- Total Investment: ৳${valuation.totalBDT.toLocaleString('en-IN')}/-
- Per Person Investment: ৳${valuation.perPersonBDT.toLocaleString('en-IN')}/-

Please connect me with your Private Client Director at Horizon Lounge, Gulshan-2 to finalize our dates.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/8801800522224?text=${encoded}`, '_blank');
  };

  // Print PDF Quotation
  const handlePrintPdfQuotation = () => {
    triggerConfetti();
    if (onOpenPdfModal) {
      const selectedRouteNames = selectedRouteIds.map(id => {
        const r = CONCIERGE_DATA.routes.find(route => route.id === id);
        return locale === 'bn' ? r?.name_bn : r?.name_en;
      });

      const selectedAddonNames = selectedAddonIds.map(id => {
        const a = CONCIERGE_DATA.addOns.find(addon => addon.id === id);
        return locale === 'bn' ? a?.name_bn : a?.name_en;
      });

      onOpenPdfModal({
        tripType: 'custom_bespoke',
        season: locale === 'bn' ? 'বেসপোক ওমরাহ পছন্দ' : 'Custom Bespoke Umrah',
        makkahHotel: `${selectedMakkahHotel.name} (${makkahNights} Nights)`,
        madinahHotel: `${selectedMadinahHotel.name} (${madinahNights} Nights)`,
        vehicle: selectedVehicle.name,
        routes: selectedRouteNames,
        selectedAddons: selectedAddonNames,
        adults,
        children,
        infants,
        perPersonBDT: valuation.perPersonBDT,
        perPersonUSD: valuation.perPersonUSD,
        totalGroupBDT: valuation.totalBDT,
        totalGroupUSD: valuation.totalUSD,
        totalGroupSAR: valuation.totalSAR,
        emi6Months: valuation.emi6MonthsBDT,
        emi12Months: valuation.emi12MonthsBDT,
        date: new Date().toLocaleDateString('en-GB')
      });
    } else {
      handleRequestDossier();
    }
  };

  return (
    <section id="custom-booking" className="py-20 lg:py-28 bg-[#080809] relative overflow-hidden">
      
      {/* Background Ambient Gold Halo Spotlights */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[550px] h-[550px] bg-[#996515]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/35 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{dict.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {dict.titleMain} <span className="text-kiswah-gold">{dict.titleGold}</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {dict.subheading}
          </p>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: 'hotels', label: dict.hotelTab, icon: Building2 },
            { id: 'fleet', label: dict.fleetTab, icon: Car },
            { id: 'addons', label: dict.addonsTab, icon: Sparkles },
            { id: 'delegation', label: dict.partyTab, icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-kiswah-gold text-[#080809] shadow-lg shadow-[#d4af37]/20 scale-[1.02]'
                    : 'bg-white/[0.03] border border-slate-800 text-slate-300 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#080809]' : 'text-[#d4af37]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN TWO-COLUMN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (7 COLS): INTERACTIVE SELECTION PANELS */}
          <div className="lg:col-span-7 bg-[#121214] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 min-h-[580px]">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: SANCTUARY HOTELS (MAKKAH & MADINAH) */}
              {activeTab === 'hotels' && (
                <motion.div
                  key="tab-hotels"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-7"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#d4af37]" />
                        <span>{dict.hotelTab}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Select 5-star courtyard hotels and stay durations</p>
                    </div>
                    <span className="text-xs font-serif text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
                      Step 1 of 4
                    </span>
                  </div>

                  {/* MAKKAH HOTEL SELECTION */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                        {dict.makkahHotelLabel}
                      </label>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span>{dict.makkahNights}:</span>
                        <div className="flex items-center gap-1.5 bg-[#080809] border border-slate-700 px-2.5 py-1 rounded-lg">
                          <button 
                            type="button" 
                            onClick={() => setMakkahNights(Math.max(1, makkahNights - 1))}
                            className="text-amber-300 font-bold px-1 hover:text-white"
                          >-</button>
                          <span className="font-mono font-bold text-white px-1">{makkahNights}</span>
                          <button 
                            type="button" 
                            onClick={() => setMakkahNights(makkahNights + 1)}
                            className="text-amber-300 font-bold px-1 hover:text-white"
                          >+</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {CONCIERGE_DATA.hotels.makkah.map((hotel) => {
                        const isSelected = makkahHotelId === hotel.id;
                        const nightlySAR = Math.round(hotel.nightlyBdt / BDT_TO_SAR);
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif font-bold text-sm text-white">{hotel.name}</h4>
                                <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                  {hotel.dist}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                5-Star Presidential Luxury • Direct Haram Access
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-sm font-serif font-bold text-kiswah-gold block">
                                ৳{hotel.nightlyBdt.toLocaleString('en-IN')}/-
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MADINAH HOTEL SELECTION */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                        {dict.madinahHotelLabel}
                      </label>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span>{dict.madinahNights}:</span>
                        <div className="flex items-center gap-1.5 bg-[#080809] border border-slate-700 px-2.5 py-1 rounded-lg">
                          <button 
                            type="button" 
                            onClick={() => setMadinahNights(Math.max(1, madinahNights - 1))}
                            className="text-amber-300 font-bold px-1 hover:text-white"
                          >-</button>
                          <span className="font-mono font-bold text-white px-1">{madinahNights}</span>
                          <button 
                            type="button" 
                            onClick={() => setMadinahNights(madinahNights + 1)}
                            className="text-amber-300 font-bold px-1 hover:text-white"
                          >+</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {CONCIERGE_DATA.hotels.madinah.map((hotel) => {
                        const isSelected = madinahHotelId === hotel.id;
                        const nightlySAR = Math.round(hotel.nightlyBdt / BDT_TO_SAR);
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif font-bold text-sm text-white">{hotel.name}</h4>
                                <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                  {hotel.dist}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                Prophet's Mosque Front • VIP Chauffeur Service
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-sm font-serif font-bold text-kiswah-gold block">
                                ৳{hotel.nightlyBdt.toLocaleString('en-IN')}/-
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROOM OCCUPANCY SELECTOR */}
                  <div className="pt-2">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Suite Occupancy Benchmark
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'quad', label: locale === 'bn' ? 'কয়াড (৪ জন)' : 'Quad (4 Guests)', mult: '1.0x' },
                        { id: 'triple', label: locale === 'bn' ? 'ট্রিপল (৩ জন)' : 'Triple (3 Guests)', mult: '1.25x' },
                        { id: 'double', label: locale === 'bn' ? 'ডাবল/টুইন (২ জন)' : 'Double/Twin (2 Guests)', mult: '1.5x' },
                        { id: 'presidential', label: locale === 'bn' ? 'সোলো/প্রেসিডেন্সিয়াল' : 'Single / Presidential', mult: '2.5x' }
                      ].map((occ) => (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => setOccupancy(occ.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            occupancy === occ.id
                              ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                              : 'bg-white/[0.02] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="block">{occ.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">({occ.mult})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setActiveTab('fleet')}
                      className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                    >
                      <span>Proceed to Chauffeur Fleet</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: CHAUFFEUR FLEET & ROUTES */}
              {activeTab === 'fleet' && (
                <motion.div
                  key="tab-fleet"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-7"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Car className="w-5 h-5 text-[#d4af37]" />
                        <span>{dict.fleetTab}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Select private VIP luxury fleet vehicle & transfers</p>
                    </div>
                    <span className="text-xs font-serif text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
                      Step 2 of 4
                    </span>
                  </div>

                  {/* VEHICLE SELECTION */}
                  <div className="space-y-3">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                      {dict.selectVehicle}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CONCIERGE_DATA.vehicles.map((v) => {
                        const isSelected = selectedVehicleId === v.id;
                        return (
                          <div
                            key={v.id}
                            onClick={() => setSelectedVehicleId(v.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                              isSelected
                                ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                                : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-serif font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                {v.badge}
                              </span>
                              <h4 className="font-serif font-bold text-sm text-white pt-1">{v.name}</h4>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                              <span>Fleet Multiplier:</span>
                              <span className="font-mono font-bold text-kiswah-gold">{v.ratePerKm}x Rate</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROUTE SELECTION */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                      {dict.selectRoutes} (Select All Applicable)
                    </label>

                    <div className="space-y-2.5">
                      {CONCIERGE_DATA.routes.map((route) => {
                        const isChecked = selectedRouteIds.includes(route.id);
                        const routeName = locale === 'bn' ? route.name_bn : route.name_en;
                        const calculatedRouteBDT = Math.round(route.baseBdt * selectedVehicle.ratePerKm);
                        const calculatedRouteSAR = Math.round(calculatedRouteBDT / BDT_TO_SAR);

                        return (
                          <div
                            key={route.id}
                            onClick={() => toggleRoute(route.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
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

                            <div className="text-right shrink-0">
                              <span className="text-xs font-serif font-bold text-kiswah-gold block">
                                ৳{calculatedRouteBDT.toLocaleString('en-IN')}/-
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setActiveTab('hotels')}
                      className="px-4 py-2 border border-slate-700 text-slate-300 font-serif text-xs rounded-xl hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => setActiveTab('addons')}
                      className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                    >
                      <span>Proceed to VIP Add-Ons</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: VIP PRIVILEGES & ADD-ONS */}
              {activeTab === 'addons' && (
                <motion.div
                  key="tab-addons"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-7"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#d4af37]" />
                        <span>{dict.addonsTab}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Select scholar guidance, airport CIP, and Rawdah Nusuk permits</p>
                    </div>
                    <span className="text-xs font-serif text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
                      Step 3 of 4
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                      {dict.selectAddons}
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                      {CONCIERGE_DATA.addOns.map((addon) => {
                        const isChecked = selectedAddonIds.includes(addon.id);
                        const addonName = locale === 'bn' ? addon.name_bn : addon.name_en;
                        const addonSAR = Math.round(addon.bdt / BDT_TO_SAR);

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
                                <p className="text-xs text-slate-400 font-light">White-Glove VIP Service Guarantee</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-sm font-serif font-bold text-kiswah-gold block">
                                ৳{addon.bdt.toLocaleString('en-IN')}/-
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setActiveTab('fleet')}
                      className="px-4 py-2 border border-slate-700 text-slate-300 font-serif text-xs rounded-xl hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => setActiveTab('delegation')}
                      className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                    >
                      <span>Proceed to Delegation Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 4: DELEGATION & FLIGHT DETAILS */}
              {activeTab === 'delegation' && (
                <motion.div
                  key="tab-delegation"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-7"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#d4af37]" />
                        <span>{dict.partyTab}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Specify traveling guest counts and flight cabin preference</p>
                    </div>
                    <span className="text-xs font-serif text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
                      Step 4 of 4
                    </span>
                  </div>

                  {/* GUEST COUNTERS */}
                  <div className="space-y-4">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                      {dict.guestsCount}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Adults */}
                      <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-white block">{dict.adults}</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >-</button>
                          <span className="font-mono font-bold text-white text-base">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >+</button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-white block">{dict.children}</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >-</button>
                          <span className="font-mono font-bold text-white text-base">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >+</button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="bg-white/[0.02] border border-slate-800 p-4 rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-white block">{dict.infants}</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >-</button>
                          <span className="font-mono font-bold text-white text-base">{infants}</span>
                          <button
                            type="button"
                            onClick={() => setInfants(infants + 1)}
                            className="w-8 h-8 rounded-lg bg-[#080809] border border-slate-700 text-amber-300 font-bold"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FLIGHT CABIN TIER */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                      Flight Cabin Suite Tier (DAC ➔ JED Direct)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'first', label: locale === 'bn' ? 'ভিআইপি ফার্স্ট ক্লাস স্যুইট' : 'VIP First Class Suite', bdt: 320000 },
                        { id: 'business', label: locale === 'bn' ? 'বিজনেস ক্লাস লাই-ফ্ল্যাট' : 'Business Class Lie-Flat', bdt: 195000 },
                        { id: 'economy', label: locale === 'bn' ? 'ডাইরেক্ট এক্সপ্রেস ইকোনমি' : 'Direct Express Economy', bdt: 110000 }
                      ].map((flight) => (
                        <button
                          key={flight.id}
                          type="button"
                          onClick={() => setFlightTier(flight.id)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all space-y-1 ${
                            flightTier === flight.id
                              ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                              : 'bg-white/[0.02] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs font-serif font-bold block text-white">{flight.label}</span>
                          <span className="text-[11px] font-mono text-kiswah-gold block">
                            ৳{flight.bdt.toLocaleString('en-IN')} / guest
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setActiveTab('addons')}
                      className="px-4 py-2 border border-slate-700 text-slate-300 font-serif text-xs rounded-xl hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleRequestDossier}
                      className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover shadow-lg"
                    >
                      <Crown className="w-4 h-4 text-[#080809]" />
                      <span>Review Final Valuation</span>
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* RIGHT COLUMN (5 COLS): AUTOMATED LIVE VALUATION DOSSIER */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-b from-[#161619] to-[#0d0d0f] border-2 border-[#d4af37]/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden kiswah-gold-glow">
              
              {/* Top Card Badge Header */}
              <div className="flex justify-between items-center border-b border-[#d4af37]/25 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
                    {dict.summaryTitle}
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-2.5 py-0.5 rounded-full uppercase">
                  Live Calculator
                </span>
              </div>

              {/* Real-Time Total Pricing Display */}
              <div className="space-y-2 bg-[#080809]/80 p-5 rounded-2xl border border-[#d4af37]/20">
                <span className="text-[11px] text-slate-400 font-serif uppercase tracking-widest block">
                  {dict.totalInvestment} ({valuation.totalPayingGuests} Guests)
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-extrabold text-kiswah-gold drop-shadow-md">
                    ৳{valuation.totalBDT.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">BDT</span>
                </div>

              </div>

              {/* Per Person & Cost Breakdown List */}
              <div className="space-y-2 text-xs text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">{dict.perPerson}:</span>
                  <span className="font-bold text-white font-serif">
                    ৳{valuation.perPersonBDT.toLocaleString('en-IN')}/-
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">{dict.hotelTotal}:</span>
                  <span className="font-mono font-semibold text-slate-200">৳{valuation.hotelsTotalBDT.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{dict.transportTotal}:</span>
                  <span className="font-mono font-semibold text-slate-200">৳{valuation.transportTotalBDT.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{dict.addonsTotal}:</span>
                  <span className="font-mono font-semibold text-slate-200">৳{valuation.addOnsTotalBDT.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 0% Interest EMI Installments Card */}
              <div className="bg-[#080809]/90 p-4 rounded-2xl border border-[#d4af37]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
                  <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{dict.emiTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white/[0.02] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">{dict.emiMonth6}</span>
                    <span className="font-bold text-kiswah-gold">৳{valuation.emi6MonthsBDT.toLocaleString('en-IN')} / mo</span>
                  </div>
                  <div className="bg-white/[0.02] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">{dict.emiMonth12}</span>
                    <span className="font-bold text-kiswah-gold">৳{valuation.emi12MonthsBDT.toLocaleString('en-IN')} / mo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleRequestDossier}
                  className="w-full py-4 px-6 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold rounded-2xl text-xs sm:text-sm tracking-wider uppercase shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <FileText className="w-4 h-4 text-[#080809]" />
                  <span>{dict.requestDossier}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrintPdfQuotation}
                    className="py-3 px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-[#d4af37]/40 text-amber-300 font-serif font-semibold rounded-xl text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{dict.printQuotation}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppBooking}
                    className="py-3 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-white font-serif font-semibold rounded-xl text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp VIP</span>
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-light pt-1">
                Confidentiality Guaranteed • Gulshan-2 Private Client Lounge, Dhaka
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
