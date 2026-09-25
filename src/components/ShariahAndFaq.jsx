import React, { useState } from 'react';
import { 
  ShieldCheck, HelpCircle, ChevronDown, ChevronUp, 
  Award, Sparkles, UserCheck, BookOpen, Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS, SHARIAH_BOARD } from '../data/mockData';

export default function ShariahAndFaq() {
  const [openFaq, setOpenFaq] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="shariah" className="py-16 lg:py-24 bg-slate-950 relative overflow-hidden">
      
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* SHARIAH ADVISORY BOARD SECTION */}
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Shariah Guidance & Oversight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Guided by Experienced <span className="text-gold-gradient">Bengali Islamic Scholars</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Our travel contracts, hotel proximity, and pilgrimage rituals are vetted and supervised by Bangladesh's premier Islamic jurisprudence scholars.
            </p>
          </div>

          {/* Scholars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SHARIAH_BOARD.map((scholar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={scholar.image}
                      alt={scholar.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-snug">
                        {scholar.name}
                      </h3>
                      <span className="text-xs font-bold text-amber-400 block mt-0.5">
                        {scholar.title}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-medium">
                    {scholar.qualification}
                  </div>

                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    "{scholar.bio}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-6 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Personalized Scholar Escort on VIP Tours</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
        <div id="faq" className="space-y-10 pt-10 border-t border-slate-800">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pilgrim Clarifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h2>
            <p className="text-slate-300 text-sm font-light">
              Clear answers to female Mahram rules, airline luggage allowances, child visa procedures, and 0% EMI financing.
            </p>

            {/* Search FAQ Input */}
            <div className="max-w-md mx-auto pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. Mahram, Luggage, EMI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <div className="p-1 rounded-lg bg-slate-800 text-amber-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-slate-800/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
