import React, { useState, useMemo } from 'react';
import { 
  Calculator as CalcIcon, Plane, Building2, MapPin, Users, User, UserCheck, 
  CheckSquare, Square, Download, Share2, Sparkles, ChevronRight, CheckCircle2,
  Calendar, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PRICING_CONFIG } from '../data/mockData';

export default function Calculator({ onOpenPdfModal }) {
  // State for Calculator Options
  const [tripType, setTripType] = useState('umrah_14'); // umrah_10, umrah_14, umrah_21, hajj_exec, hajj_econ
  const [season, setSeason] = useState('regular'); // regular, rajab, ramadan1, ramadan2
  const [departureCity, setDepartureCity] = useState('Dhaka (DAC)');
  const [airlineType, setAirlineType] = useState('direct'); // direct, transit
  
  const [makkahTierId, setMakkahTierId] = useState('clock'); // clock, walking, shuttle
  const [madinahTierId, setMadinahTierId] = useState('markaziah_north'); // markaziah_north, standard_walk

  const [occupancy, setOccupancy] = useState('quad'); // quad, triple, twin, single

  // Group Count
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Selected Addons array
  const [selectedAddons, setSelectedAddons] = useState(['scholar', 'bullet_train', 'zamzam_home']);

  // Toggle Addon
  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Synchronous Dynamic Cost Calculation
  const calculation = useMemo(() => {
    // 1. Duration in days
    let numDays = 14;
    let makkahNights = 7;
    let madinahNights = 7;

    if (tripType === 'umrah_10') {
      numDays = 10; makkahNights = 5; madinahNights = 4;
    } else if (tripType === 'umrah_14') {
      numDays = 14; makkahNights = 7; madinahNights = 6;
    } else if (tripType === 'umrah_21') {
      numDays = 21; makkahNights = 12; madinahNights = 8;
    } else if (tripType === 'hajj_exec') {
      numDays = 30; makkahNights = 15; madinahNights = 10;
    } else if (tripType === 'hajj_econ') {
      numDays = 25; makkahNights = 14; madinahNights = 8;
    }

    // 2. Flight Base Cost per person
    const baseFlight = airlineType === 'direct' 
      ? PRICING_CONFIG.flightBaseBDT.direct 
      : PRICING_CONFIG.flightBaseBDT.transit;

    // 3. Season multiplier
    const seasonObj = PRICING_CONFIG.seasonMultipliers[season] || PRICING_CONFIG.seasonMultipliers.regular;
    const seasonFactor = seasonObj.factor;

    // 4. Hotel Rates
    const makkahObj = PRICING_CONFIG.makkahHotelTiers.find(t => t.id === makkahTierId) || PRICING_CONFIG.makkahHotelTiers[0];
    const madinahObj = PRICING_CONFIG.madinahHotelTiers.find(t => t.id === madinahTierId) || PRICING_CONFIG.madinahHotelTiers[0];

    const totalMakkahHotelRaw = makkahObj.baseNightBDT * makkahNights;
    const totalMadinahHotelRaw = madinahObj.baseNightBDT * madinahNights;
    const rawAccommodation = totalMakkahHotelRaw + totalMadinahHotelRaw;

    // 5. Occupancy multiplier
    const occFactor = PRICING_CONFIG.occupancyMultipliers[occupancy]?.factor || 1.0;

    const accommodationPerPerson = Math.round((rawAccommodation / 4) * occFactor);

    // 6. Visa & Insurance mandatory per person
    const visaInsurancePerPerson = PRICING_CONFIG.visaInsuranceBDT;

    // 7. Addons Calculation
    let perPersonAddonsBDT = 0;
    let groupAddonsBDT = 0;

    selectedAddons.forEach(addonId => {
      const addonObj = PRICING_CONFIG.addonsList.find(a => a.id === addonId);
      if (addonObj) {
        if (addonObj.perPerson) {
          perPersonAddonsBDT += addonObj.priceBDT;
        } else {
          groupAddonsBDT += addonObj.priceBDT;
        }
      }
    });

    // Subtotal per adult
    const adultBasePerPersonBDT = Math.round(
      (baseFlight + accommodationPerPerson + visaInsurancePerPerson) * seasonFactor + perPersonAddonsBDT
    );

    // Child rate (80% of flight + full visa + accommodation)
    const childPerPersonBDT = Math.round(
      (baseFlight * 0.8 + accommodationPerPerson * 0.7 + visaInsurancePerPerson) * seasonFactor + perPersonAddonsBDT
    );

    // Infant rate (25% flight + visa)
    const infantPerPersonBDT = Math.round((baseFlight * 0.25 + 8500) * seasonFactor);

    // Total Group Calculation
    const totalAdultsCost = adultBasePerPersonBDT * adults;
    const totalChildrenCost = childPerPersonBDT * children;
    const totalInfantsCost = infantPerPersonBDT * infants;
    const totalGroupBDT = totalAdultsCost + totalChildrenCost + totalInfantsCost + groupAddonsBDT;

    const totalPayingCount = adults + children;
    const effectivePerPersonBDT = totalPayingCount > 0 ? Math.round(totalGroupBDT / totalPayingCount) : adultBasePerPersonBDT;

    const totalGroupUSD = Math.round(totalGroupBDT / PRICING_CONFIG.usdExchangeRate);
    const effectivePerPersonUSD = Math.round(effectivePerPersonBDT / PRICING_CONFIG.usdExchangeRate);

    // 0% EMI Calculation
    const emi6Months = Math.round(totalGroupBDT / 6);
    const emi12Months = Math.round(totalGroupBDT / 12);

    return {
      numDays,
      makkahNights,
      madinahNights,
      seasonName: seasonObj.name,
      makkahHotelName: makkahObj.name,
      madinahHotelName: madinahObj.name,
      adultBasePerPersonBDT,
      effectivePerPersonBDT,
      effectivePerPersonUSD,
      totalGroupBDT,
      totalGroupUSD,
      flightTotalGroup: (baseFlight * seasonFactor) * (adults + children * 0.8),
      hotelTotalGroup: (accommodationPerPerson * seasonFactor) * (adults + children * 0.7),
      visaTotalGroup: visaInsurancePerPerson * (adults + children),
      addonsTotalGroup: (perPersonAddonsBDT * (adults + children)) + groupAddonsBDT,
      emi6Months,
      emi12Months
    };
  }, [tripType, season, departureCity, airlineType, makkahTierId, madinahTierId, occupancy, adults, children, infants, selectedAddons]);

  // Trigger celebration & Open PDF Modal
  const handleGeneratePdf = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#047857', '#ffffff']
    });

    const quoteData = {
      tripType,
      season: calculation.seasonName,
      departureCity,
      airlineType,
      occupancy: PRICING_CONFIG.occupancyMultipliers[occupancy]?.name,
      adults,
      children,
      infants,
      makkahHotel: calculation.makkahHotelName,
      madinahHotel: calculation.madinahHotelName,
      selectedAddons: selectedAddons.map(id => PRICING_CONFIG.addonsList.find(a => a.id === id)?.name),
      perPersonBDT: calculation.effectivePerPersonBDT,
      perPersonUSD: calculation.effectivePerPersonUSD,
      totalGroupBDT: calculation.totalGroupBDT,
      totalGroupUSD: calculation.totalGroupUSD,
      emi6Months: calculation.emi6Months,
      emi12Months: calculation.emi12Months,
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onOpenPdfModal) {
      onOpenPdfModal(quoteData);
    }
  };

  // WhatsApp Itinerary Share
  const handleWhatsAppShare = () => {
    const text = `Assalamu Alaikum! I would like to inquire about a Custom Pilgrimage Package from Noor Al Haramain Travels & Tours Dhaka:
    
🕋 *Trip:* ${calculation.seasonName} (${calculation.numDays} Days)
📍 *Departure City:* ${departureCity}
✈️ *Airline:* ${airlineType === 'direct' ? 'Direct (Biman/Saudia)' : 'Transit Airline'}
🏨 *Makkah Stay:* ${calculation.makkahHotelName} (${calculation.makkahNights} Nights)
🏨 *Madinah Stay:* ${calculation.madinahHotelName} (${calculation.madinahNights} Nights)
👥 *Group Size:* ${adults} Adults, ${children} Children, ${infants} Infants (${PRICING_CONFIG.occupancyMultipliers[occupancy]?.name})
✨ *Selected Add-ons:* ${selectedAddons.map(id => PRICING_CONFIG.addonsList.find(a => a.id === id)?.name).join(', ')}

💰 *Est. Per Person:* ৳${calculation.effectivePerPersonBDT.toLocaleString('en-IN')} BDT ($${calculation.effectivePerPersonUSD})
💵 *Total Estimated Group Price:* ৳${calculation.totalGroupBDT.toLocaleString('en-IN')} BDT ($${calculation.totalGroupUSD})

Please confirm available dates & official booking process.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/8801700000000?text=${encodedText}`, '_blank');
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Interactive Custom Tour Planner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Calculate Your Custom <span className="text-gold-gradient">Umrah & Hajj Package</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Customize every aspect of your sacred journey in real-time. Instantly view itemized pricing in Bangladeshi Taka (BDT ৳) & USD ($) with 0% EMI calculation.
          </p>
        </div>

        {/* Main Grid: Options on Left, Live Sticky Cost Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: Interactive Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Trip Type & Season */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Step 1: Select Trip Type & Travel Season</span>
              </div>

              {/* Trip Type Pills */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">Package Category & Duration</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'umrah_10', label: 'Umrah (10 Days)' },
                    { id: 'umrah_14', label: 'Umrah (14 Days)' },
                    { id: 'umrah_21', label: 'Umrah (21 Days)' },
                    { id: 'hajj_exec', label: 'Executive Hajj' },
                    { id: 'hajj_econ', label: 'Economy Hajj' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                        tripType === t.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-950/40'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Season Select */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">Travel Season Factor</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="regular">Regular Season (Best Price)</option>
                  <option value="rajab">Rajab & Shaban Season (+15%)</option>
                  <option value="ramadan1">Ramadan 1st 15 Days (+35%)</option>
                  <option value="ramadan2">Ramadan Last 10 Days - Lailatul Qadr (+70%)</option>
                </select>
              </div>
            </div>

            {/* Step 2: Flight & Departure City */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <Plane className="w-4 h-4 text-amber-500" />
                <span>Step 2: Flight & Departure City</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Departure City */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">Departure Airport</label>
                  <select
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none font-medium"
                  >
                    <option value="Dhaka (DAC)">Dhaka (DAC) - Shahjalal Int'l</option>
                    <option value="Chittagong (CGP)">Chittagong (CGP) - Shah Amanat Int'l</option>
                    <option value="Sylhet (ZYL)">Sylhet (ZYL) - Osmani Int'l</option>
                  </select>
                </div>

                {/* Airline Preference */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">Airline Route Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAirlineType('direct')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        airlineType === 'direct'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Direct (Biman / Saudia)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAirlineType('transit')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        airlineType === 'transit'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Transit (flydubai/Flynas)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Hotel Distance & Proximity */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Step 3: Makkah & Madinah Hotel Proximity</span>
              </div>

              {/* Makkah Proximity */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  Makkah Hotel Distance ({calculation.makkahNights} Nights)
                </label>
                <div className="space-y-2">
                  {PRICING_CONFIG.makkahHotelTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setMakkahTierId(tier.id)}
                      className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                        makkahTierId === tier.id
                          ? 'bg-emerald-950/80 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 ${makkahTierId === tier.id ? 'text-amber-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-xs font-bold block">{tier.name}</span>
                          <span className="text-[11px] text-slate-400">{tier.stars}-Star Accommodation Partner</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400">
                        ৳{tier.baseNightBDT.toLocaleString('en-IN')}/night
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Madinah Proximity */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  Madinah Hotel Distance ({calculation.madinahNights} Nights)
                </label>
                <div className="space-y-2">
                  {PRICING_CONFIG.madinahHotelTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setMadinahTierId(tier.id)}
                      className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                        madinahTierId === tier.id
                          ? 'bg-emerald-950/80 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 ${madinahTierId === tier.id ? 'text-amber-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-xs font-bold block">{tier.name}</span>
                          <span className="text-[11px] text-slate-400">{tier.stars}-Star Markaziah Zone</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400">
                        ৳{tier.baseNightBDT.toLocaleString('en-IN')}/night
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Room Sharing Occupancy */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Step 4: Room Sharing Occupancy</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(PRICING_CONFIG.occupancyMultipliers).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setOccupancy(key)}
                    className={`p-3 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      occupancy === key
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold">{val.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Group Breakdown Counters */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-amber-500" />
                <span>Step 5: Group Passenger Breakdown</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Adults */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Adults</span>
                    <span className="text-[10px] text-slate-400">Age 12+ Years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-amber-400 text-sm">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Children</span>
                    <span className="text-[10px] text-slate-400">Age 2-11 Years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-amber-400 text-sm">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Infants</span>
                    <span className="text-[10px] text-slate-400">Under 2 Years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-amber-400 text-sm">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(infants + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Value-Added Add-ons */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Step 6: Value-Added Sacred Add-ons</span>
              </div>

              <div className="space-y-2.5">
                {PRICING_CONFIG.addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/70 border-amber-400/80 text-white'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 text-amber-400">
                        {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">{addon.name}</span>
                          <span className="text-xs font-bold text-amber-400">
                            +৳{addon.priceBDT.toLocaleString('en-IN')} {addon.perPerson ? '/person' : '/group'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{addon.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Live Sticky Price Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <motion.div
              layout
              className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-6 gold-glow"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Live Package Quotation</h3>
                  <p className="text-xs text-emerald-300">Synchronous real-time estimation</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  {calculation.seasonName}
                </span>
              </div>

              {/* Per Person & Group Total Price Display */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 space-y-3 text-center">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Estimated Price Per Person</span>
                  <div className="flex items-baseline justify-center gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-400">
                      ৳{calculation.effectivePerPersonBDT.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">BDT</span>
                  </div>
                  <span className="text-xs text-emerald-400 block font-medium mt-0.5">
                    (~ ${calculation.effectivePerPersonUSD.toLocaleString()} USD)
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Total Group Cost ({adults + children} Travellers):</span>
                  <span className="font-bold text-amber-300 text-sm">
                    ৳{calculation.totalGroupBDT.toLocaleString('en-IN')} BDT
                  </span>
                </div>
              </div>

              {/* Cost Itemization List */}
              <div className="space-y-2 text-xs">
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">Itemized Cost Breakdown</span>
                <div className="bg-slate-900/70 rounded-xl p-3.5 space-y-2 border border-slate-800 text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>Flights ({airlineType === 'direct' ? 'Direct' : 'Transit'} • {departureCity}):</span>
                    <span className="font-semibold text-white">৳{Math.round(calculation.flightTotalGroup).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accommodation ({calculation.numDays} Days):</span>
                    <span className="font-semibold text-white">৳{Math.round(calculation.hotelTotalGroup).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Saudi Visa & Medical Insurance:</span>
                    <span className="font-semibold text-white">৳{Math.round(calculation.visaTotalGroup).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Selected Sacred Add-ons ({selectedAddons.length}):</span>
                    <span className="font-semibold text-amber-300">৳{Math.round(calculation.addonsTotalGroup).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 0% Interest Bank EMI Box */}
              <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-emerald-800/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>0% Interest Bank EMI Options</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Pay in easy installments with City Bank, BRAC Bank, DBBL, or Islami Bank:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-white">
                  <div className="bg-slate-900/90 p-2 rounded-lg text-center border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">6 Months EMI</span>
                    <span className="text-amber-300 font-bold">৳{calculation.emi6Months.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg text-center border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">12 Months EMI</span>
                    <span className="text-amber-300 font-bold">৳{calculation.emi12Months.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleGeneratePdf}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download PDF Quotation (Instant)</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Custom Itinerary to WhatsApp</span>
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
