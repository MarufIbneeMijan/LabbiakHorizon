import React from 'react';
import { X, Printer, Crown, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivateDossierModal({ locale, data, onClose }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080809]/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121214] border border-[#d4af37]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto kiswah-gold-glow"
      >
        {/* Top Control Header */}
        <div className="no-print bg-[#050505] p-4 border-b border-[#d4af37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
              {locale === 'bn' ? 'লাব্বাইকহরাইজন গোপনীয় ফাইল প্রিভিউ' : 'LabbaikHorizon VIP Dossier Preview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{locale === 'bn' ? 'প্রিন্ট / ডাউনলোড ফাইল' : 'Print / Download Dossier'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-100 bg-[#121214] print-card">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#d4af37]/30 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-serif">🕋</span>
                <div>
                  <h1 className="text-xl font-serif font-bold text-kiswah-gold uppercase tracking-widest">
                    LABBAIK HORIZON
                  </h1>
                  <p className="text-[11px] text-amber-300 font-mono">
                    {locale === 'bn' ? 'কিসওয়াহ আল্ট্রা-লাক্সারি জিয়ারত কনসিয়ার্জ • গুলশান-২, ঢাকা' : 'Kiswah Ultra-Luxury Pilgrimage Concierge • Gulshan-2, Dhaka'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                MoRA Certified: <strong className="text-white">HAAB-1420</strong> | ATAB License: <strong className="text-white">09823</strong>
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <span className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/40 text-amber-300 font-serif font-bold text-[10px] uppercase tracking-widest rounded-full inline-block">
                {locale === 'bn' ? 'গোপনীয় ফাইলের অনুলিপি' : 'CONFIDENTIAL DOSSIER'}
              </span>
              <p className="text-slate-400">Date: {data.date}</p>
              <p className="text-slate-400">Ref: LBH-VIP-2026-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
          </div>

          {/* Experience Specs */}
          <div className="bg-white/[0.02] p-5 rounded-2xl border border-[#d4af37]/20 space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase tracking-widest block">
                  {locale === 'bn' ? 'সফরের ক্যাটাগরি' : 'Journey Tier'}
                </span>
                <h3 className="text-xl font-serif font-bold text-white">{data.tier}</h3>
                <p className="text-xs text-amber-300">{data.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">
                  {locale === 'bn' ? 'আনুমানিক মোট বিনিয়োগ' : 'Estimated Total Investment'}
                </span>
                {data.isCustom ? (
                  <span className="text-lg font-serif font-bold text-[#d4af37]">
                    {locale === 'bn' ? 'গোপনীয় চার্টার' : 'Confidential Charter'}
                  </span>
                ) : (
                  <span className="text-xl font-serif font-extrabold text-kiswah-gold">
                    ৳{data.totalBDT.toLocaleString('en-IN')} BDT
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-400 block font-medium">{locale === 'bn' ? 'সফরের সময়সূচী' : 'Season Horizon'}</span>
                <span className="font-bold text-white">{data.season}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{locale === 'bn' ? 'ভ্রমণকারী পার্টি' : 'Traveling Party'}</span>
                <span className="font-bold text-white">{data.party}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{locale === 'bn' ? 'মক্কার হোটেল' : 'Makkah Accommodation'}</span>
                <span className="font-bold text-white">{data.makkahHotel}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{locale === 'bn' ? 'মদিনার হোটেল' : 'Madinah Accommodation'}</span>
                <span className="font-bold text-white">{data.madinahHotel}</span>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div>
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest block mb-3">
              {locale === 'bn' ? 'অন্তর্ভুক্ত ভিআইপি সুবিধাসমূহ' : 'Included Presidential Perks & Privileges'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-white/[0.01] p-4 rounded-2xl border border-slate-800">
              {data.features && data.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-serif font-bold text-white text-sm">LabbaikHorizon Concierge</p>
              <p>{locale === 'bn' ? 'লেভেল ৬, হরাইজন টাওয়ার, গুলশান-২, ঢাকা-১২১২' : 'Level 6, Horizon Tower, Gulshan-2, Dhaka-1212'}</p>
              <p>VIP Hotline: +880 1800-LABBAIK | Email: vip@labbaikhorizon.com</p>
            </div>

            <div className="text-right">
              <div className="w-36 h-10 border-b border-[#d4af37]/40 text-amber-300 font-serif italic text-xs flex items-center justify-end">
                Private Client Director
              </div>
              <span className="text-[10px] text-slate-400">
                {locale === 'bn' ? 'অনুমোদিত স্বাক্ষর ও সিল' : 'Authorized Signature & Seal'}
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
