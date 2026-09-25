import React from 'react';
import { Star, ShieldCheck, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { DIGNITARY_TESTIMONIALS } from '../data/mockData';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#0b0b0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Discrete Dignitary Impressions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            Trusted by Distinguished <span className="text-kiswah-gold">Pilgrims</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Reflections from corporate chairpersons, industrial leaders, and VIP families who entrust their spiritual journey to LabbaikHorizon.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIGNITARY_TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-kiswah-card p-7 rounded-3xl border border-[#d4af37]/25 shadow-2xl flex flex-col justify-between space-y-6 hover:border-[#d4af37]/50 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 text-amber-300 text-[10px] font-mono font-bold border border-[#d4af37]/30 uppercase">
                    {t.packageTaken}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-light italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  <span>{t.author}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                </h4>
                <p className="text-[11px] text-[#d4af37]/80 font-medium mt-0.5">
                  {t.designation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
