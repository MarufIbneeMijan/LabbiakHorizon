import React from 'react';
import { 
  Crown, Sparkles, CheckCircle2, ArrowRight, 
  Sliders, Building2, Car, Calendar, Users, 
  ShieldCheck, Star, Award, HeartHandshake, PhoneCall
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConciergeCurator({ 
  locale = 'en', 
  onOpenWizard = () => {}, 
  onOpenConsultation = () => {} 
}) {
  const isBn = locale === 'bn';

  const handleCustomReservation = () => {
    onOpenConsultation({
      tier: isBn ? 'কাস্টম বেসপোক ওমরাহ ও হজ পরিকল্পনা' : 'Bespoke Custom Pilgrimage Itinerary',
      packageName: isBn ? 'কাস্টম বেসপোক ওমরাহ ও হজ পরিকল্পনা' : 'Bespoke Custom Pilgrimage Itinerary',
      totalBDT: 245000,
      totalUSD: 2040,
      type: 'CUSTOM BESPOKE',
      features: [
        isBn ? 'ব্যক্তিগত ৫-স্টার পেন্টহাউস (০ মিটার কাবা ভিউ)' : 'Private 5-Star Penthouse (0m Kaaba View)',
        isBn ? 'প্রাইভেট জিএমসি ইউকন / মাইবাখ ট্রান্সফার' : 'Private GMC Yukon / Maybach Transfer',
        isBn ? '১-অন-১ প্রবীণ আলেম স্কলারের সান্নিধ্য' : '1-on-1 Eminent Senior Scholar Moallim',
        isBn ? 'সিআইপি ডিপ্লোমেটিক ফাস্ট-ট্র্যাক প্রোটোকল' : 'CIP Diplomatic Fast-Track Airport Protocol'
      ]
    });
  };

  const stepsData = [
    {
      step: '01',
      icon: Calendar,
      titleEn: 'Sacred Dates & Horizon',
      titleBn: 'পবিত্র সফর ও যাত্রীর সংখ্যা',
      descEn: 'VIP Umrah or Royal Hajj during Ramadan Last 10 Nights, Winter Sacred Months, or flexible private dates. Configurable for solo, couple, or family delegation.',
      descBn: 'রমজানের শেষ দশক, শীতকালীন বরকতময় মাস কিংবা আপনার সুবিধাজনক তারিখে সোলো, কাপল বা পরিবার সহ রাজকীয় হজ ও ওমরাহ নির্ধারণ করুন।',
      tagEn: 'Step 1: Dates & Delegation',
      tagBn: 'ধাপ ১: সফর ও দল'
    },
    {
      step: '02',
      icon: Building2,
      titleEn: 'Sanctuary Suites & Proximity',
      titleBn: '০ মিটার হারাম চত্বর স্যুইট',
      descEn: 'Handpick 0m direct courtyard suites at Raffles Makkah Palace, Fairmont Clock Tower, or The Oberoi Madinah with private butler and Kaaba audio feeds.',
      descBn: 'র‍্যাফেলস মক্কা প্যালেস, ফেয়ারমন্ট ক্লক টাওয়ার ও মদিনার দ্য ওবেরয়ে কাবা শরিফ ও মসজিদে নববীর সরাসরি উঠানমুখী বিলাসবহুল স্যুইট নির্বাচন করুন।',
      tagEn: 'Step 2: Haramain Hotels',
      tagBn: 'ধাপ ২: তারকা হোটেল'
    },
    {
      step: '03',
      icon: Car,
      titleEn: 'Fleet Logistics & Scholar Care',
      titleBn: 'প্রাইভেট শফার কার ও মোয়াল্লেম',
      descEn: 'Select private GMC Yukon XL or Mercedes Maybach ground fleet, Haramain high-speed rail 1st class, and discrete 1-on-1 senior scholar guidance.',
      descBn: 'জেদ্দা-মক্কা-মদিনা রুটে জিএমসি ইউকন এক্সএল বা মার্সিডিজ-বেঞ্জ বহর, হারামাইন ট্রেনের ফার্স্ট ক্লাস ও অভিজ্ঞ প্রবীণ আলেম স্কলারের সান্নিধ্য যুক্ত করুন।',
      tagEn: 'Step 3: Chauffeur & Guidance',
      tagBn: 'ধাপ ৩: প্রাইভেট বহর'
    }
  ];

  return (
    <section id="custom-package" className="py-20 lg:py-28 bg-[#080809] relative overflow-hidden">
      
      {/* Anchor for legacy curator link */}
      <div id="curator" className="relative -top-24" />

      {/* Kiswah Ambient Glow Spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[#d4af37]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#996515]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ATTENTION-GRABBING CUSTOM TOUR BUILDER HERO BANNER */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#996515] via-[#d4af37] via-[#ffd700] to-[#996515] shadow-[0_0_50px_rgba(212,175,55,0.18)] mb-14 group">
          
          <div className="bg-[#0e0e11]/98 backdrop-blur-2xl rounded-[23px] p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-[#d4af37]/40">
            
            {/* Ambient Background Decorative Grid */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-6">
              
              {/* Prestigious Gold Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/50 text-[#d4af37] text-xs font-serif font-extrabold uppercase tracking-widest shadow-lg">
                <Crown className="w-4 h-4 text-[#d4af37]" />
                <span>{isBn ? 'ভিআইপি বেসপোক সার্ভিস' : 'VIP BESPOKE SERVICE'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>

              {/* Bold Call-out Headline */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight">
                {isBn 
                  ? 'আপনার পছন্দসই পবিত্র সফর সাজান — ' 
                  : 'Design Your Own Sacred Journey — '
                }
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#ffd700]">
                  {isBn ? 'মাত্র ৩ ধাপে রাজকীয় অভিজ্ঞতা' : 'Tailored Luxury in 3 Steps'}
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                {isBn 
                  ? 'মক্কা ও মদিনায় ০ মিটার পেন্টহাউস, বিলাসবহুল জিএমসি চফার বহর, হারামাইন বুলেট ট্রেন ফার্স্ট ক্লাস ও প্রবীণ মোয়াল্লেম গাইডসহ আপনার বাজেট ও পছন্দ অনুযায়ী তাৎক্ষণিক হিসেব করুন।'
                  : 'Experience absolute freedom. Select your royal courtyard penthouses, Maybach ground logistics, and dedicated scholar accompaniment with automated real-time valuation.'
                }
              </p>

              {/* Action Buttons Group */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                
                {/* Primary CTA: Launch Guided Wizard */}
                <button
                  type="button"
                  onClick={onOpenWizard}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#e5c158] hover:brightness-110 text-[#080809] font-serif font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-2xl hover:scale-[1.02] cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-[#080809]" />
                  <span>{isBn ? 'কাস্টম কনসিয়ার্জ উইজার্ড চালু করুন' : 'Launch Bespoke Concierge Wizard'}</span>
                  <ArrowRight className="w-4 h-4 text-[#080809]" />
                </button>

                {/* Secondary CTA: Quick Lead Reservation */}
                <button
                  type="button"
                  onClick={handleCustomReservation}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-amber-300 hover:text-white border border-[#d4af37]/40 font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#d4af37]" />
                  <span>{isBn ? 'সরাসরি ডিরেক্টর পরামর্শ চান' : 'Consult Private Director'}</span>
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* 3-STEP VISUAL ROADMAP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {stepsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#121215] rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/70 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
              >
                {/* Step Watermark */}
                <div className="absolute top-3 right-4 text-4xl font-mono font-extrabold text-white/[0.04] group-hover:text-[#d4af37]/10 transition-colors pointer-events-none select-none">
                  {item.step}
                </div>

                <div className="space-y-4">
                  {/* Step Tag & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 bg-white/[0.03] px-2.5 py-1 rounded-full border border-slate-800">
                      {isBn ? item.tagBn : item.tagEn}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {isBn ? item.descBn : item.descEn}
                    </p>
                  </div>
                </div>

                {/* Card Footer Feature Indicator */}
                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between text-xs text-[#d4af37]">
                  <span className="font-serif font-semibold">
                    {isBn ? 'সম্পূর্ণ স্বয়ংক্রিয় ও লাইভ' : '100% Customizable'}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* REAL-TIME VALUATION PREVIEW BANNER */}
        <div className="bg-[#121215]/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">
                {isBn ? 'স্বচ্ছ বাজেট ও সরাসরি সৌদি রিয়েল-টাইম হিসাব' : 'Instant Real-Time Pricing Engine'}
              </h4>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                {isBn 
                  ? 'কোনো গোপন চার্জ নেই • আল আহসানিয়া ট্রান্সপোর্ট গ্রিড ও ৫-স্টার হোটেলের সরাসরি চুক্তি অনুযায়ী মূল্য নির্ধারিত।' 
                  : 'Zero hidden fees. Rates reflect direct Al Ahsaniya fleet infrastructure & MoRA verified hotel contracts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                {isBn ? 'নমুনা হিসেব শুরু' : 'Sample Curations From'}
              </span>
              <div className="text-lg font-serif font-extrabold text-kiswah-gold">
                ৳185,000 <span className="text-xs text-slate-400 font-normal">/ person</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWizard}
              className="px-5 py-2.5 rounded-xl bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span>{isBn ? 'শুরু করুন' : 'Curate Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
