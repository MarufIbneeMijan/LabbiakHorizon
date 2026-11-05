import React, { useState, useEffect } from 'react';
import { 
  Car, Users, Briefcase, Sparkles, Crown, CheckCircle2, 
  ArrowRight, ShieldCheck, MapPin, Shield, Check, Compass 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DICTIONARY, FLEET_ROUTES, FLEET_VEHICLES, applyTieredMarkup } from '../data/mockData';
import { transportAPI } from '../services/api';

export default function FleetSection({ locale = 'en', onConfirmFleet = () => {} }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  const [routes, setRoutes] = useState(FLEET_ROUTES);
  const [vehicles, setVehicles] = useState(FLEET_VEHICLES);
  const [selectedRouteId, setSelectedRouteId] = useState('jed_makkah');

  useEffect(() => {
    loadTransportData();
  }, []);

  const loadTransportData = async () => {
    try {
      const data = await transportAPI.get();
      if (data?.routes?.length > 0) setRoutes(data.routes);
      if (data?.vehicles?.length > 0) setVehicles(data.vehicles);
    } catch (err) {
      console.warn('Transport API loading fallback:', err);
    }
  };

  // Selected Route Object
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0] || FLEET_ROUTES[0];

  const handleReserveVehicle = (vehicle) => {
    const basePrice = (vehicle.basePrices && vehicle.basePrices[selectedRoute.id]) || selectedRoute.basePriceSAR || 500;
    const finalPriceSAR = applyTieredMarkup(basePrice);
    const markupAmount = finalPriceSAR - basePrice;
    const priceBDT = Math.round(finalPriceSAR * 33);
    const priceUSD = Math.round(finalPriceSAR / 3.75);

    const fleetData = {
      vehicleName: isBn ? (vehicle.nameBn || vehicle.nameEn) : vehicle.nameEn,
      routeName: isBn ? (selectedRoute.nameBn || selectedRoute.nameEn) : (selectedRoute.nameEn || selectedRoute.nameBn),
      routeType: isBn ? (selectedRoute.typeBn || selectedRoute.typeEn) : (selectedRoute.typeEn || selectedRoute.typeBn),
      basePriceSAR: basePrice,
      markupAmountSAR: markupAmount,
      finalPriceSAR: finalPriceSAR,
      totalBDT: priceBDT,
      totalUSD: priceUSD,
      passengers: vehicle.passengers,
      luggage: vehicle.luggage
    };

    if (onConfirmFleet) {
      onConfirmFleet(fleetData);
    }
  };

  return (
    <section id="fleet" className="py-20 lg:py-28 bg-[#0a0a0c] relative overflow-hidden">
      
      {/* Radial Glow Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Car className="w-3.5 h-3.5" />
            <span>{dict.fleet?.badge || 'Benaa Logistics • Tiered VIP Rate Card'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {dict.fleet?.titleMain || 'Private Royal Fleet &'} <span className="text-kiswah-gold">{dict.fleet?.titleGold || 'Chauffeur Services'}</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {dict.fleet?.subheading || 'Saudi government approved rates with automated tiered margin calculations and 24/7 dedicated chauffeurs.'}
          </p>
        </div>

        {/* 1. INTERACTIVE ROUTE SELECTOR PILLS */}
        <div className="bg-kiswah-card p-6 rounded-3xl border border-[#d4af37]/30 space-y-4 shadow-xl mb-12">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080809] font-bold text-xs flex items-center justify-center font-serif">
              1
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                {dict.fleet?.selectRouteTitle || '1. Select Transport Route'}
              </h3>
              <p className="text-xs text-slate-400">
                {dict.fleet?.selectRouteDesc || 'Airport arrival, intercity transfers, ziyarah excursions or full circuits'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {routes.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const routeName = isBn ? (route.nameBn || route.nameEn) : (route.nameEn || route.nameBn);
              const routeType = isBn ? (route.typeBn || route.typeEn) : (route.typeEn || route.typeBn);

              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                      : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-wider block">
                      {routeType}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-white leading-snug">
                      {routeName}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{route.distanceEn || 'Express Transfer'}</span>
                    <span className="font-bold text-[#d4af37]">{route.finalPriceSAR || applyTieredMarkup(route.basePriceSAR || 550)} SAR</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. FLEET CARDS SHOWCASE */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080809] font-bold text-xs flex items-center justify-center font-serif">
              2
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                {dict.fleet?.selectVehicleTitle || '2. Select Royal Vehicle & Capacity'}
              </h3>
              <p className="text-xs text-slate-400">
                {dict.fleet?.selectVehicleDesc || 'Real-time SAR, BDT, and USD rate card with tiered VIP margins applied'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((v) => {
              const basePrice = (v.basePrices && v.basePrices[selectedRoute.id]) || selectedRoute.basePriceSAR || 550;
              const finalPriceSAR = applyTieredMarkup(basePrice);
              const markupAmount = finalPriceSAR - basePrice;
              const priceBDT = Math.round(finalPriceSAR * 33);
              const priceUSD = Math.round(finalPriceSAR / 3.75);

              const name = isBn ? (v.nameBn || v.nameEn) : v.nameEn;
              const badge = isBn ? (v.badgeBn || v.badgeEn) : v.badgeEn;
              const features = isBn ? (v.featuresBn || v.featuresEn || []) : (v.featuresEn || v.featuresBn || []);

              return (
                <motion.div
                  key={v.id}
                  whileHover={{ y: -6 }}
                  className="bg-kiswah-card rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={v.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                        {badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{v.passengers} Guests</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{v.luggage} Luggage</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-snug">
                        {name}
                      </h3>

                      <div className="space-y-1.5 pt-3">
                        {features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                            <span className="font-light">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      {/* Price Breakdown with Tiered Markup */}
                      <div className="bg-[#0a0a0c] p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Base Saudi Fleet Rate:</span>
                          <span className="font-mono text-slate-200">{basePrice} SAR</span>
                        </div>
                        <div className="flex justify-between text-amber-400">
                          <span>Applied Tiered VIP Margin:</span>
                          <span className="font-mono font-bold">+{markupAmount} SAR</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1 border-t border-slate-800 text-sm font-bold text-kiswah-gold font-serif">
                          <span>Final Total (SAR):</span>
                          <span>{finalPriceSAR} SAR</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Approx. Investment:</span>
                          <span className="font-mono">৳{priceBDT.toLocaleString('en-IN')} BDT (${priceUSD} USD)</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReserveVehicle(v)}
                        className="w-full py-3 px-4 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Car className="w-4 h-4 text-[#080809]" />
                        <span>{dict.fleet?.reserveBtn || 'Reserve Vehicle & Route'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
