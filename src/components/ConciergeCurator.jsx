import React, { useState, useMemo } from 'react';
import { 
  Crown, Sparkles, Gem, ShieldCheck, Check, ArrowRight, 
  MessageSquare, FileText, Calendar, Users, Plane, Star, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LABBAIK_JOURNEY_TIERS, SEASON_HORIZONS, 
  PARTY_SIZES, FLIGHT_TIERS 
} from '../data/mockData';

export default function ConciergeCurator({ onOpenConsultation, onOpenDossier }) {
  // Curator State
  const [selectedTierId, setSelectedTierId] = useState('kiswah_sanctum');
  const [seasonId, setSeasonId] = useState('ramadan');
  const [partyId, setPartyId] = useState('couple');
  const [flightId, setFlightId] = useState('first_suite');

  // Selected Objects
  const selectedTier = useMemo(() => {
    return LABBAIK_JOURNEY_TIERS.find(t => t.id === selectedTierId) || LABBAIK_JOURNEY_TIERS[0];
  }, [selectedTierId]);

  const selectedParty = useMemo(() => {
    return PARTY_SIZES.find(p => p.id === partyId) || PARTY_SIZES[0];
  }, [partyId]);

  const selectedSeason = useMemo(() => {
    return SEASON_HORIZONS.find(s => s.id === seasonId) || SEASON_HORIZONS[0];
  }, [seasonId]);

  const selectedFlight = useMemo(() => {
    return FLIGHT_TIERS.find(f => f.id === flightId) || FLIGHT_TIERS[0];
  }, [flightId]);

  // Valuation Calculation
  const valuation = useMemo(() => {
    if (selectedTier.isCustomPrice) {
      return {
        isCustom: true,
        perPersonBDT: 1250000,
        totalBDT: 2450000,
        totalUSD: 20000
      };
    }

    const basePerPerson = selectedTier.priceBDT;
    const flightExtra = selectedFlight.extraBDT;
    
    // Season multiplier
    let seasonMultiplier = 1.0;
    if (seasonId === 'ramadan') seasonMultiplier = 1.35;
    if (seasonId === 'hajj') seasonMultiplier = 2.2;

    const perPersonBDT = Math.round((basePerPerson + flightExtra) * seasonMultiplier);
    const totalBDT = perPersonBDT * selectedParty.multiplier;
    const totalUSD = Math.round(totalBDT / 122.5);
    const perPersonUSD = Math.round(perPersonBDT / 122.5);

    return {
      isCustom: false,
      perPersonBDT,
      perPersonUSD,
      totalBDT,
      totalUSD
    };
  }, [selectedTier, selectedParty, selectedFlight, seasonId]);

  // Handle Direct WhatsApp Director Link
  const handleWhatsAppConnect = () => {
    const text = `Assalamu Alaikum. I am interested in inquiring about a VIP Pilgrimage Dossier with LabbaikHorizon:
    
🕋 *Journey Tier:* ${selectedTier.title}
📍 *Season Horizon:* ${selectedSeason.label}
👥 *Party Size:* ${selectedParty.label}
✈️ *Flight Tier:* ${selectedFlight.label}

💰 *Est. Valuation:* ${valuation.isCustom ? 'Confidential Custom Charter' : `৳${valuation.totalBDT.toLocaleString('en-IN')} BDT ($${valuation.totalUSD.toLocaleString()} USD)`}

Please connect me with your Private Client Director.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/8801800522224?text=${encodedText}`, '_blank');
  };

  const handleRequestDossier = () => {
    const dossierData = {
      tier: selectedTier.title,
      subtitle: selectedTier.subtitle || selectedTier.tagline,
      season: selectedSeason.label,
      party: selectedParty.label,
      flight: selectedFlight.label,
      perPersonBDT: valuation.perPersonBDT,
      totalBDT: valuation.totalBDT,
      totalUSD: valuation.totalUSD,
      isCustom: valuation.isCustom,
      features: selectedTier.features,
      makkahHotel: selectedTier.makkahHotel,
      madinahHotel: selectedTier.madinahHotel,
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onOpenDossier) {
      onOpenDossier(dossierData);
    } else {
      onOpenConsultation(dossierData);
    }
  };

  return (
    <section id="curator" className="py-20 lg:py-28 bg-[#080808] relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#996515]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Frictionless Concierge Curator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            Curate Your Sacred <span className="text-kiswah-gold">Pilgrimage Sanctum</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Designed for distinguished pilgrims. Select your journey tier, season horizon, and party parameters in three effortless steps.
          </p>
        </div>

        {/* STEP 1: SELECT YOUR JOURNEY TIER */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 border-b border-[#d4af37]/20 pb-4">
            <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080808] font-bold text-sm flex items-center justify-center font-serif">
              1
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Step 1: Select Your Journey Tier</h3>
              <p className="text-xs text-slate-400">Choose your presidential penthouse tier and luxury benchmark</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {LABBAIK_JOURNEY_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <motion.div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected ? 'bg-kiswah-card-active' : 'bg-kiswah-card hover:border-[#d4af37]/50'
                  }`}
                >
                  {/* Card Image Banner */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tier.image}
                      alt={tier.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/50 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080808] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                        {tier.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-serif font-bold text-white leading-snug">
                        {tier.title}
                      </h4>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">{tier.subtitle || tier.tagline}</p>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-[#d4af37]/15 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-slate-200 font-semibold">
                          <span>Makkah:</span>
                          <span className="text-[#d4af37] font-bold">{tier.makkahHotel}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-200 font-semibold">
                          <span>Madinah:</span>
                          <span className="text-[#d4af37] font-bold">{tier.madinahHotel}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {tier.features.slice(0, 4).map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                            <span className="font-light">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Indicative Investment</span>
                        {tier.isCustomPrice ? (
                          <span className="text-lg font-serif font-bold text-[#d4af37]">Confidential Dossier</span>
                        ) : (
                          <span className="text-xl font-serif font-extrabold text-kiswah-gold">
                            ~ ৳{tier.priceBDT.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ guest</span>
                          </span>
                        )}
                      </div>

                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-kiswah-gold text-[#080808] border-[#d4af37]' : 'border-slate-700 text-slate-500'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: IMMEDIATE PARAMETERS */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 border-b border-[#d4af37]/20 pb-4">
            <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080808] font-bold text-sm flex items-center justify-center font-serif">
              2
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Step 2: Immediate Parameters</h3>
              <p className="text-xs text-slate-400">Select season horizon, party size, and flight tier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Season Horizon */}
            <div className="bg-kiswah-card p-5 rounded-2xl border border-[#d4af37]/20 space-y-3">
              <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>1. Season Horizon</span>
              </label>
              <div className="space-y-2">
                {SEASON_HORIZONS.map((season) => (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => setSeasonId(season.id)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      seasonId === season.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                        : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{season.label}</span>
                    {seasonId === season.id && <Check className="w-4 h-4 text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Size */}
            <div className="bg-kiswah-card p-5 rounded-2xl border border-[#d4af37]/20 space-y-3">
              <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-2">
                <Users className="w-4 h-4 text-[#d4af37]" />
                <span>2. Traveling Party Size</span>
              </label>
              <div className="space-y-2">
                {PARTY_SIZES.map((party) => (
                  <button
                    key={party.id}
                    type="button"
                    onClick={() => setPartyId(party.id)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      partyId === party.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                        : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{party.label}</span>
                    {partyId === party.id && <Check className="w-4 h-4 text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Tier */}
            <div className="bg-kiswah-card p-5 rounded-2xl border border-[#d4af37]/20 space-y-3">
              <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#d4af37]" />
                <span>3. Flight Cabin Tier</span>
              </label>
              <div className="space-y-2">
                {FLIGHT_TIERS.map((flight) => (
                  <button
                    key={flight.id}
                    type="button"
                    onClick={() => setFlightId(flight.id)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      flightId === flight.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300'
                        : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{flight.label}</span>
                    {flightId === flight.id && <Check className="w-4 h-4 text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* STEP 3: INSTANT VALUATION & DIRECT WHITE-GLOVE CTA */}
        <div className="bg-gradient-to-b from-[#121214] to-[#080808] p-8 sm:p-10 rounded-3xl border-2 border-[#d4af37]/40 shadow-2xl kiswah-gold-glow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Live Valuation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 3: Instant Valuation Summary</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-serif uppercase tracking-widest block">Estimated Total Investment ({selectedParty.label})</span>
              {valuation.isCustom ? (
                <div className="mt-1">
                  <span className="text-3xl sm:text-4xl font-serif font-extrabold text-kiswah-gold">
                    Confidential Custom Quotation
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Tailored charter pricing upon briefing</p>
                </div>
              ) : (
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-5xl font-serif font-extrabold text-kiswah-gold drop-shadow-md">
                    ৳{valuation.totalBDT.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">BDT</span>
                  <span className="text-xs sm:text-sm text-amber-300 font-serif">
                    (~ ${valuation.totalUSD.toLocaleString()} USD)
                  </span>
                </div>
              )}
            </div>

            {/* Inclusions summary bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Diplomatic CIP Fast-Track at DAC & JED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>24/7 Personal Concierge & Butler</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Haramain Bullet Train VIP First Class</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Private GMC Yukon / Maybach Chauffeur</span>
              </div>
            </div>
          </div>

          {/* Right Column: White-Glove Action CTAs */}
          <div className="lg:col-span-6 space-y-3">
            <button
              onClick={handleRequestDossier}
              className="w-full py-4 px-6 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080808] font-serif font-bold rounded-2xl text-sm sm:text-base tracking-wider uppercase shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <FileText className="w-5 h-5 text-[#080808]" />
              <span>Request Confidential VIP Dossier</span>
            </button>

            <button
              onClick={handleWhatsAppConnect}
              className="w-full py-3.5 px-6 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-white font-serif font-semibold rounded-2xl text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Connect with Private Client Director</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 font-light pt-1">
              Confidentiality Guaranteed • Private Briefing Meeting at Gulshan-2, Dhaka
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
