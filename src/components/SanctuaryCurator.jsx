import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Crown, CheckSquare, Square, 
  MapPin, Clock, ArrowRight, CheckCircle2, UserCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DICTIONARY, RAWDAH_WINDOWS, RAWDAH_EXCURSIONS } from '../data/mockData';

export default function SanctuaryCurator({ locale, onConfirmSanctuary }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;

  // Selected Rawdah Window ('gentlemen' or 'ladies')
  const [selectedRawdahWindow, setSelectedRawdahWindow] = useState('gentlemen');

  // Selected Excursions array of IDs
  const [selectedExcursions, setSelectedExcursions] = useState(['taif', 'hira_nour']);

  const toggleExcursion = (id) => {
    if (selectedExcursions.includes(id)) {
      setSelectedExcursions(selectedExcursions.filter(e => e !== id));
    } else {
      setSelectedExcursions([...selectedExcursions, id]);
    }
  };

  const handleConfirm = () => {
    const rawdahObj = RAWDAH_WINDOWS.find(w => w.id === selectedRawdahWindow);
    const excursionsList = selectedExcursions.map(id => {
      const item = RAWDAH_EXCURSIONS.find(e => e.id === id);
      return locale === 'bn' ? item.titleBn : item.titleEn;
    });

    const sanctuaryData = {
      rawdahWindow: locale === 'bn' ? rawdahObj.titleBn : rawdahObj.titleEn,
      rawdahDetails: locale === 'bn' ? rawdahObj.subtitleBn : rawdahObj.subtitleEn,
      selectedExcursions: excursionsList,
      totalCount: 1 + selectedExcursions.length
    };

    if (onConfirmSanctuary) {
      onConfirmSanctuary(sanctuaryData);
    }
  };

  return (
    <section id="sanctuary" className="py-20 lg:py-28 bg-[#0a0a0c] relative overflow-hidden">
      
      {/* Radial Glow Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/30 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{dict.sanctuary.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {dict.sanctuary.titleMain} <span className="text-kiswah-gold">{dict.sanctuary.titleGold}</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {dict.sanctuary.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: Interactive Rawdah Window & Excursion Selector */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. RAWDAH SHARIF WINDOW SELECTOR */}
            <div className="bg-kiswah-card p-6 rounded-3xl border border-[#d4af37]/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080809] font-bold text-xs flex items-center justify-center font-serif">
                  1
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    {dict.sanctuary.windowTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {dict.sanctuary.windowDesc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {RAWDAH_WINDOWS.map((window) => {
                  const isSelected = selectedRawdahWindow === window.id;
                  return (
                    <div
                      key={window.id}
                      onClick={() => setSelectedRawdahWindow(window.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-kiswah-card-active border-[#d4af37] text-white kiswah-gold-glow'
                          : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/30">
                            {locale === 'bn' ? window.badgeBn : window.badgeEn}
                          </span>
                          {window.icon === 'Crown' ? <Crown className="w-4 h-4 text-[#d4af37]" /> : <ShieldCheck className="w-4 h-4 text-[#d4af37]" />}
                        </div>

                        <h4 className="font-serif font-bold text-sm text-white leading-snug">
                          {locale === 'bn' ? window.titleBn : window.titleEn}
                        </h4>

                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          {locale === 'bn' ? window.subtitleBn : window.subtitleEn}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
                        <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-[#d4af37]' : 'text-slate-600'}`} />
                        <span>{isSelected ? (locale === 'bn' ? 'পারমিট নির্বাচিত' : 'Permit Slot Selected') : (locale === 'bn' ? 'নির্বাচন করুন' : 'Select Slot')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. BESPOKE VIP EXCURSION MULTI-SELECT CARDS */}
            <div className="bg-kiswah-card p-6 rounded-3xl border border-[#d4af37]/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-kiswah-gold text-[#080809] font-bold text-xs flex items-center justify-center font-serif">
                  2
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    {dict.sanctuary.excursionTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {dict.sanctuary.excursionDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {RAWDAH_EXCURSIONS.map((excursion) => {
                  const isChecked = selectedExcursions.includes(excursion.id);
                  return (
                    <div
                      key={excursion.id}
                      onClick={() => toggleExcursion(excursion.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-kiswah-card-active border-[#d4af37]/80 text-white shadow-lg'
                          : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 text-[#d4af37]">
                        {isChecked ? <CheckSquare className="w-5 h-5 text-[#d4af37]" /> : <Square className="w-5 h-5 text-slate-600" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-serif font-bold text-sm text-white">
                            {locale === 'bn' ? excursion.titleBn : excursion.titleEn}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 text-amber-300 text-[10px] font-semibold border border-[#d4af37]/30">
                            {locale === 'bn' ? excursion.badgeBn : excursion.badgeEn}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          {locale === 'bn' ? excursion.descBn : excursion.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Summary & Confirm Direct Concierge Action */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-gradient-to-b from-[#121214] via-[#0f0f12] to-[#080809] p-7 rounded-3xl border-2 border-[#d4af37]/40 shadow-2xl kiswah-gold-glow space-y-6">
              
              <div className="border-b border-[#d4af37]/20 pb-4">
                <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-widest block">Sanctuary Curator Summary</span>
                <h3 className="text-xl font-serif font-bold text-white">
                  {locale === 'bn' ? 'সংরক্ষিত পারমিট ও জিয়ারত' : 'Reserved Slot & Excursions'}
                </h3>
              </div>

              {/* Rawdah Selected Window summary */}
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider font-mono block">Rawdah Sharif Entry Permit</span>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {selectedRawdahWindow === 'gentlemen' 
                      ? (locale === 'bn' ? 'পুরুষদের ফাস্ট-ট্র্যাক পারমিট (তাহাজ্জুদ/দোহা)' : 'Gentlemen Fast-Track Permit (Tahajjud/Duha)') 
                      : (locale === 'bn' ? 'মহিলাদের পারমিট (আলেমা স্কলার গাইড সহ)' : 'Ladies Permit (Female Scholar Escort)')
                    }
                  </span>
                </div>
              </div>

              {/* Selected Excursions List */}
              <div className="space-y-2">
                <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest block">
                  {locale === 'bn' ? 'নির্বাচিত প্রাইভেট সফরসমূহ:' : 'Selected VIP Excursions:'}
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  {selectedExcursions.map(id => {
                    const item = RAWDAH_EXCURSIONS.find(e => e.id === id);
                    return (
                      <div key={id} className="flex items-center gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>{locale === 'bn' ? item.titleBn : item.titleEn}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counter Badge */}
              <div className="bg-[#d4af37]/10 p-3 rounded-xl border border-[#d4af37]/30 flex items-center justify-between text-xs text-[#d4af37] font-bold">
                <span>{dict.sanctuary.selectedCount}:</span>
                <span className="text-white bg-[#d4af37]/20 px-2.5 py-0.5 rounded-full">
                  {1 + selectedExcursions.length} {locale === 'bn' ? 'টি অভিজ্ঞতা' : 'Experiences'}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirm}
                className="w-full py-4 px-6 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold rounded-2xl text-xs sm:text-sm tracking-wider uppercase shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <span>{dict.sanctuary.confirmBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#080809]" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
