import React from 'react';
import { Crown, ShieldCheck, Sparkles, Gem, ArrowRight, Compass, Building, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onOpenConsultation, onNavigateCurator }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-kiswah-pattern pt-12 pb-20">
      
      {/* Dark Ambient Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#996515]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Banner Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 z-10 w-full text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Kiswah Seal Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-2xl"
          >
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <span>Kiswah Inspired Ultra-Luxury Pilgrimage • MoRA License HAAB-1420</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-white leading-[1.1]"
          >
            The Sacred Sanctuary, <br />
            <span className="text-kiswah-gold drop-shadow-lg">Curated with Absolute Exclusivity</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed"
          >
            Serving distinguished pilgrims with presidential suites, private bullet train carriages, and discreet 24/7 scholarly guidance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#curator"
              onClick={onNavigateCurator}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-kiswah-gold text-[#080808] font-serif font-bold text-sm tracking-wider uppercase shadow-2xl shadow-[#d4af37]/20 hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#080808]" />
              <span>Curate Your Pilgrimage</span>
            </a>

            <a
              href="#suites"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/40 text-[#d4af37] font-serif font-semibold text-sm tracking-wider uppercase hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <span>Explore Royal Suites</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </a>
          </motion.div>

          {/* Key Privilege Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-slate-300 font-medium"
          >
            <span className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#d4af37]" />
              <span>Panoramic Ka'aba View Penthouse</span>
            </span>
            <span className="text-[#d4af37]/40">•</span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Haramain Bullet Train VIP Pass</span>
            </span>
            <span className="text-[#d4af37]/40">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Discreet 1-on-1 Scholar Chaperone</span>
            </span>
          </motion.div>

        </div>
      </div>

      {/* Bottom Trust & Protocol Strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#d4af37]/20">
          
          <div className="bg-white/[0.02] border border-[#d4af37]/15 p-4 rounded-2xl backdrop-blur-md text-center space-y-1">
            <span className="text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest block">Licensing</span>
            <p className="text-white text-xs font-semibold">MoRA Certified HAAB-1420</p>
          </div>

          <div className="bg-white/[0.02] border border-[#d4af37]/15 p-4 rounded-2xl backdrop-blur-md text-center space-y-1">
            <span className="text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest block">CIP Protocol</span>
            <p className="text-white text-xs font-semibold">Fast-Track DAC & JED Protocol</p>
          </div>

          <div className="bg-white/[0.02] border border-[#d4af37]/15 p-4 rounded-2xl backdrop-blur-md text-center space-y-1">
            <span className="text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest block">Lounge Presence</span>
            <p className="text-white text-xs font-semibold">Horizon Tower, Gulshan-2</p>
          </div>

          <div className="bg-white/[0.02] border border-[#d4af37]/15 p-4 rounded-2xl backdrop-blur-md text-center space-y-1">
            <span className="text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest block">Compliance</span>
            <p className="text-white text-xs font-semibold">100% Shariah Compliant</p>
          </div>

        </div>
      </div>

    </section>
  );
}
