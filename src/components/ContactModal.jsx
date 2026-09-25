import React, { useState } from 'react';
import { X, Crown, Send, CheckCircle2, ShieldCheck, MapPin, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ContactModal({ onClose, presetData }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelDates: 'Ramadan 2027',
    briefingMode: 'Private Meeting at Gulshan-2 Lounge',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Celebratory Gold Confetti Burst
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#996515', '#ffffff']
    });
    
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080808]/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#121214] border border-[#d4af37]/40 rounded-3xl max-w-lg w-full p-7 shadow-2xl relative kiswah-gold-glow"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center space-y-5 py-6">
            <div className="w-16 h-16 bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Confidential Dossier Requested</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
              JazakAllah Khair <strong className="text-amber-300">{formData.name}</strong>. Our Private Client Director will contact your phone (<strong className="text-white">{formData.phone}</strong>) to confirm your briefing session.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-kiswah-gold text-[#080808] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#d4af37]/20 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Request VIP Pilgrimage Dossier</h3>
                <p className="text-xs text-amber-300 font-medium">LabbaikHorizon Concierge • Gulshan-2 Lounge</p>
              </div>
            </div>

            {presetData && (
              <div className="bg-white/[0.02] p-3 rounded-xl border border-[#d4af37]/20 text-xs text-slate-300">
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase tracking-widest block">Selected Journey Tier</span>
                <span className="font-bold text-white text-sm">{presetData.tier || 'The Kiswah Presidential Sanctum'}</span>
                {presetData.totalBDT && (
                  <span className="text-amber-300 font-bold block mt-0.5">
                    Est. Valuation: ৳{presetData.totalBDT.toLocaleString('en-IN')} BDT
                  </span>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Al-Haj Syful Islam Chowdhury"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#080808] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                Phone / WhatsApp Number (+880) *
              </label>
              <input
                type="tel"
                required
                placeholder="01711-XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#080808] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                  Target Travel Horizon
                </label>
                <select
                  value={formData.travelDates}
                  onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                  className="w-full bg-[#080808] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 text-xs focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Ramadan 2027">Ramadan 2027 (Last 10 Days)</option>
                  <option value="Winter Sanctuary (Dec - Feb)">Winter Sanctuary (Dec - Feb)</option>
                  <option value="Royal VIP Hajj">Royal VIP Hajj 2027</option>
                  <option value="Immediate Private Umrah">Immediate Private Umrah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                  Preferred Briefing Mode
                </label>
                <select
                  value={formData.briefingMode}
                  onChange={(e) => setFormData({ ...formData, briefingMode: e.target.value })}
                  className="w-full bg-[#080808] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 text-xs focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Private Meeting at Gulshan-2 Lounge">Private Meeting at Gulshan-2 Lounge</option>
                  <option value="Confidential Phone Briefing">Confidential Phone Briefing</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080808] font-serif font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Send className="w-4 h-4 text-[#080808]" />
              <span>Confirm Dossier Request & Celebration</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
