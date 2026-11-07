import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, Users, Briefcase, Sparkles, Crown, CheckCircle2, 
  ArrowRight, ShieldCheck, MapPin, Shield, Check, Compass,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { DICTIONARY, FLEET_ROUTES, FLEET_VEHICLES, applyTieredMarkup } from '../data/mockData';
import { transportAPI } from '../services/api';

export default function FleetSection({ locale = 'bn', onConfirmFleet = () => {} }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  const [routes, setRoutes] = useState(FLEET_ROUTES);
  const [vehicles, setVehicles] = useState(FLEET_VEHICLES);
  const [selectedRouteId, setSelectedRouteId] = useState('jed_makkah');

  // Swiper state
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadTransportData();

    const handleTransportUpdated = () => {
      loadTransportData();
    };

    window.addEventListener('horizon:transport-updated', handleTransportUpdated);
    return () => {
      window.removeEventListener('horizon:transport-updated', handleTransportUpdated);
    };
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
              const title = isBn ? (route.nameBn || route.nameEn) : route.nameEn;
              const type = isBn ? (route.typeBn || route.typeEn) : route.typeEn;

              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-lg shadow-[#d4af37]/10' 
                      : 'bg-white/[0.02] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-amber-300 font-medium">
                      {type}
                    </span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-xs font-serif font-bold text-white leading-tight mb-2">
                    {title}
                  </h4>
                  <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                    <span className="text-[11px] text-slate-400">
                      {isBn ? 'আনুমানিক দূরত্ব' : 'Distance'}
                    </span>
                    <span className="text-xs font-bold text-[#d4af37]">
                      {route.distanceKm || '75-100'} km
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. FLEET CAROUSEL SHOWCASE */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080809] font-bold text-xs flex items-center justify-center font-serif">
                2
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  {dict.fleet?.selectVehicleTitle || (isBn ? '২. রাজকীয় যানবাহন ও আসন সংখ্যা নির্বাচন' : '2. Select Royal Vehicle & Capacity')}
                </h3>
                <p className="text-xs text-slate-400">
                  {isBn ? 'স্বচ্ছ রেট কার্ড ও ২৪/৭ ডেডিকেটেড ভিআইপি চফার সার্ভিস' : 'Transparent BDT rate card with 24/7 dedicated VIP chauffeurs'}
                </p>
              </div>
            </div>

            {/* Gold Carousel Arrow Controls */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isBeginning 
                    ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                    : 'border-[#d4af37]/50 text-[#d4af37] bg-white/[0.03] hover:bg-[#d4af37] hover:text-[#080809] hover:shadow-lg hover:shadow-[#d4af37]/20'
                }`}
                aria-label="Previous vehicle"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isEnd 
                    ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                    : 'border-[#d4af37]/50 text-[#d4af37] bg-white/[0.03] hover:bg-[#d4af37] hover:text-[#080809] hover:shadow-lg hover:shadow-[#d4af37]/20'
                }`}
                aria-label="Next vehicle"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Touch-Friendly Fleet Swiper Slider */}
          <div className="relative">
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
              className="pb-12"
            >
              {vehicles.map((v) => {
                const basePrice = (v.basePrices && v.basePrices[selectedRoute.id]) || selectedRoute.basePriceSAR || 550;
                const finalPriceSAR = applyTieredMarkup(basePrice);
                const markupAmount = finalPriceSAR - basePrice;
                const priceBDT = Math.round(finalPriceSAR * 33);
                const priceUSD = Math.round(finalPriceSAR / 3.75);

                const name = isBn ? (v.nameBn || v.nameEn || v.name) : (v.nameEn || v.name || v.nameBn);
                const badge = isBn ? (v.badgeBn || v.badgeEn || v.category) : (v.badgeEn || v.badgeBn || v.category || 'VIP Fleet');
                const features = (isBn ? (v.featuresBn || v.featuresEn || v.features) : (v.featuresEn || v.featuresBn || v.features)) || [];
                const vehicleImg = v.imageUrl || v.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                const isMaintenance = v.status === 'maintenance';

                return (
                  <SwiperSlide key={v.id} className="h-auto flex">
                    <div className="bg-kiswah-card rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group w-full flex-1">
                      <div className="relative h-56 overflow-hidden bg-slate-950">
                        <img
                          src={vehicleImg}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                            {badge}
                          </span>
                          {isMaintenance && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono text-[10px] uppercase tracking-wider">
                              {isBn ? 'সার্ভিসিং চলছে' : 'Maintenance'}
                            </span>
                          )}
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
                          {/* Price Breakdown in Clean BDT */}
                          <div className="bg-[#0a0a0c] p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>{isBn ? 'মূল যানবাহন ভাড়া:' : 'Standard Vehicle Fare:'}</span>
                              <span className="font-mono text-slate-200">৳{Math.round(basePrice * 33).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-amber-400">
                              <span>{isBn ? 'ভিআইপি চফার ও সার্ভিস চার্জ:' : 'VIP Chauffeur & Service:'}</span>
                              <span className="font-mono font-bold">+৳{Math.round(markupAmount * 33).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-1 border-t border-slate-800 text-sm font-bold text-kiswah-gold font-serif">
                              <span>{isBn ? 'সর্বমোট প্যাকেজ রেট:' : 'Total Fleet Fare (BDT):'}</span>
                              <span>৳{priceBDT.toLocaleString('en-IN')}/-</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isMaintenance}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReserveVehicle(v);
                            }}
                            className={`w-full py-3 px-4 font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                              isMaintenance
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809]'
                            }`}
                          >
                            <Car className="w-4 h-4" />
                            <span>
                              {isMaintenance 
                                ? (isBn ? 'গাড়িটি সাময়িক রক্ষণাবেক্ষণে রয়েছে' : 'Vehicle in Maintenance') 
                                : (dict.fleet?.reserveBtn || 'Reserve Vehicle & Route')}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Active Bullet Indicators */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {vehicles.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
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
          </div>
        </div>

      </div>
    </section>
  );
}
