import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Gem, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { DICTIONARY, ROYAL_SUITES } from '../data/mockData';
import { hotelsAPI } from '../services/api';

export default function SuiteShowcase({ locale = 'en', onOpenConsultation = () => {} }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  const [suites, setSuites] = useState(ROYAL_SUITES);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await hotelsAPI.getAll();
      if (Array.isArray(data) && data.length > 0) {
        // Map dynamic hotels into suite format if needed, or augment
        const mapped = data.map((h, idx) => ({
          name: h.name || h.nameBn || `Luxury Suite ${idx + 1}`,
          subtitleEn: h.city === 'madinah' ? 'Madinah Sanctum' : 'Makkah Haram View',
          subtitleBn: h.city === 'madinah' ? 'পবিত্র মদিনা সান্নিধ্য' : 'কাবা শরীফ ভিউ',
          locationEn: h.distance || (h.city === 'madinah' ? 'Madinah Al Munawwarah' : 'Makkah Al Mukarramah'),
          locationBn: h.distance || (h.city === 'madinah' ? 'মদিনা মুনাওয়ারা' : 'মক্কা মুকাররমা'),
          stars: h.stars || 5,
          image: h.image || ROYAL_SUITES[idx % ROYAL_SUITES.length]?.image,
          highlightsEn: h.amenities || ['Direct Haram Access', 'Private Chauffeur', '24/7 Butler Service'],
          highlightsBn: h.amenities || ['হারামের দৃশ্যমান ভিউ', 'প্রাইভেট বাফেল্ট সার্ভিস', '২৪/৭ ডেডিকেটেড সাপোর্ট']
        }));
        setSuites(mapped.length >= 3 ? mapped : [...ROYAL_SUITES, ...mapped]);
      }
    } catch (e) {
      // Fallback to ROYAL_SUITES
      setSuites(ROYAL_SUITES);
    }
  };

  return (
    <section id="suites" className="py-20 lg:py-28 bg-[#0b0b0d] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
              <Gem className="w-3.5 h-3.5" />
              <span>{dict.suites?.badge || 'Presidential & Sanctuary Suites'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
              {dict.suites?.titleMain || 'Exclusive'} <span className="text-kiswah-gold">{dict.suites?.titleGold || 'Sanctuary Suites'}</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              {dict.suites?.subheading || 'Ultra-luxury accommodations overlooking the Kaaba and the Prophet’s Mosque.'}
            </p>
          </div>

          {/* Gold Carousel Arrow Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isBeginning 
                  ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'border-[#d4af37]/50 text-[#d4af37] bg-white/[0.03] hover:bg-[#d4af37] hover:text-[#080809] hover:shadow-lg hover:shadow-[#d4af37]/20'
              }`}
              aria-label="Previous suite"
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
              aria-label="Next suite"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suites Touch Carousel Slider */}
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
            {suites.map((suite, idx) => (
              <SwiperSlide key={idx} className="h-auto flex">
                <div className="bg-kiswah-card rounded-3xl border border-[#d4af37]/30 overflow-hidden shadow-2xl hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 w-full flex-1">
                  {/* Suite Image Banner */}
                  <div className="relative h-60 overflow-hidden bg-slate-950">
                    <img
                      src={suite.image}
                      alt={suite.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080808] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                        {isBn ? 'প্রেসিডেন্সিয়াল স্যুইট' : 'Presidential Suite'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif font-bold text-white leading-snug">
                        {suite.name}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">
                        {isBn ? (suite.subtitleBn || suite.subtitleEn) : (suite.subtitleEn || suite.subtitleBn)}
                      </p>
                    </div>
                  </div>

                  {/* Suite Body */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      
                      {/* Location & Star Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-3">
                        <span className="flex items-center gap-1.5 text-[#d4af37] font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {isBn ? (suite.locationBn || suite.locationEn) : (suite.locationEn || suite.locationBn)}
                        </span>
                        <div className="flex items-center gap-0.5 text-[#d4af37]">
                          {[...Array(suite.stars || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#d4af37]" />
                          ))}
                        </div>
                      </div>

                      {/* Feature Tags List */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-serif font-bold text-amber-300 uppercase tracking-widest block">
                          {isBn ? 'স্যুইটের সুবিধাসমূহ:' : 'Suite Features & Amenities:'}
                        </span>
                        <div className="space-y-1.5">
                          {(isBn ? (suite.highlightsBn || suite.highlightsEn || []) : (suite.highlightsEn || suite.highlightsBn || [])).map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                              <span className="font-light">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOpenConsultation({
                            tier: suite.name,
                            packageName: `${suite.name} - ${isBn ? suite.subtitleBn : suite.subtitleEn}`,
                            totalBDT: suite.name.includes('Raffles') ? 145000 : (suite.name.includes('Oberoi') ? 135000 : 95000),
                            type: 'SUITE RESERVATION'
                          });
                        }}
                        className="w-full py-3 bg-white/[0.04] hover:bg-kiswah-gold text-[#d4af37] hover:text-[#080808] font-serif font-bold rounded-xl text-xs tracking-wider uppercase border border-[#d4af37]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{dict.suites?.reserveBtn || 'Reserve Sanctuary Suite'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Active Bullet Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {suites.map((_, idx) => (
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
    </section>
  );
}
