import React from 'react';
import { Building, MapPin, Star, Sparkles, Gem, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LUXURY_SUITES } from '../data/mockData';

export default function SuiteCollection({ onOpenConsultation }) {
  return (
    <section id="suites" className="py-20 lg:py-28 bg-[#0D1114] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-amber-400 text-xs font-serif font-bold uppercase tracking-widest">
            <Gem className="w-3.5 h-3.5" />
            <span>The Presidential Suite Collection</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            Presidential Suites & <span className="text-gold-metallic">Courtyard Palaces</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            We hold exclusive year-round allotments in Makkah & Madinah's most coveted 5-star suites with direct Haram courtyard access.
          </p>
        </div>

        {/* Suites Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LUXURY_SUITES.map((suite, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-obsidian-card rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Suite Image Banner */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={suite.image}
                  alt={suite.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12171A] via-[#12171A]/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-gold-metallic text-slate-950 font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                    Presidential Tier
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif font-bold text-white leading-snug">
                    {suite.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{suite.subtitle}</p>
                </div>
              </div>

              {/* Suite Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Location & Star Rating */}
                  <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {suite.location}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(suite.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-serif font-bold text-amber-300 uppercase tracking-widest block">
                      Immersive Luxury Amenities:
                    </span>
                    <div className="space-y-1.5">
                      {suite.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-light">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={onOpenConsultation}
                    className="w-full py-3 bg-white/[0.04] hover:bg-gold-metallic text-amber-300 hover:text-slate-950 font-serif font-bold rounded-xl text-xs tracking-wider uppercase border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Reserve Suite via Gulshan Concierge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
