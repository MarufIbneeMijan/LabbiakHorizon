import React from 'react';
import { Plane, ShieldCheck, Sparkles, Gem, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONCIERGE_PILLARS } from '../data/mockData';

export default function ConciergePillars() {
  return (
    <section id="pillars" className="py-20 lg:py-28 bg-[#080808] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Four Pillars of White-Glove Concierge</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            The Standards of <span className="text-kiswah-gold">LabbaikHorizon</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Every aspect of your pilgrimage is executed with diplomatic precision, complete privacy, and uncompromised spiritual reverence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CONCIERGE_PILLARS.map((pillar) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: pillar.id * 0.1 }}
              className="bg-kiswah-card p-6 rounded-3xl border border-[#d4af37]/25 hover:border-[#d4af37]/55 transition-all flex flex-col justify-between shadow-2xl group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-kiswah-gold/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {pillar.icon === 'Plane' && <Plane className="w-6 h-6" />}
                  {pillar.icon === 'ShieldCheck' && <ShieldCheck className="w-6 h-6" />}
                  {pillar.icon === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                  {pillar.icon === 'Gem' && <Gem className="w-6 h-6" />}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-widest block">
                    Pillar 0{pillar.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center gap-1.5 text-[#d4af37] text-xs font-serif font-semibold">
                <span>Diplomatic Guarantee</span>
                <Crown className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
