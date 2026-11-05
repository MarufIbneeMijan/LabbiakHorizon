import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DICTIONARY, LUXURY_FAQS } from '../data/mockData';

export default function FaqSection({ locale }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const dict = DICTIONARY[locale] || DICTIONARY.en;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#080809] relative overflow-hidden border-t border-b border-[#d4af37]/20">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{dict.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {dict.faq.titleMain} <span className="text-kiswah-gold">{dict.faq.titleGold}</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            {dict.faq.subheading}
          </p>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-4">
          {LUXURY_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const qText = locale === 'bn' ? faq.qBn : faq.qEn;
            const aText = locale === 'bn' ? faq.aBn : faq.aEn;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all overflow-hidden border ${
                  isOpen
                    ? 'bg-kiswah-card-active border-[#d4af37]/70 kiswah-gold-glow'
                    : 'bg-kiswah-card border-[#d4af37]/25 hover:border-[#d4af37]/50'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] font-serif text-xs font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-snug">
                      {qText}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-1 rounded-full bg-white/[0.04] text-[#d4af37] shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-slate-800/80 pt-4">
                        {aText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
