import React, { useState } from 'react';
import { X, Crown, Send, CheckCircle2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ConsultationModal({ onClose, presetData }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    consultationMode: 'Private Meeting at Our Gulshan Lounge',
    preferredTime: 'Morning (10:30 AM)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#047857', '#ffffff']
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0D1114] border border-amber-500/40 rounded-3xl max-w-lg w-full p-7 shadow-2xl relative gold-glow"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center space-y-5 py-6">
            <div className="w-16 h-16 bg-gold-metallic/10 border border-amber-400 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Private Briefing Requested</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
              JazakAllah Khair <strong className="text-amber-300">{formData.name}</strong>. Our Private Client Director will contact your WhatsApp (<strong className="text-white">{formData.whatsapp}</strong>) to confirm your confidential briefing slot.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gold-metallic text-slate-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gold-metallic/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Request Private Consultation</h3>
                <p className="text-xs text-amber-300 font-medium">Gulshan-2 Private Lounge • Road 11</p>
              </div>
            </div>

            {presetData && (
              <div className="bg-white/[0.02] p-3 rounded-xl border border-amber-500/20 text-xs text-slate-300">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">Selected Signature Experience</span>
                <span className="font-bold text-white text-sm">{presetData.experience || 'The Royal Sanctuary'}</span>
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
                placeholder="e.g. Al-Haj Mahmudul Islam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0A0D0F] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                WhatsApp Direct Mobile Number (+880) *
              </label>
              <input
                type="tel"
                required
                placeholder="01711-XXXXXX"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#0A0D0F] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                Preferred Consultation Mode
              </label>
              <select
                value={formData.consultationMode}
                onChange={(e) => setFormData({ ...formData, consultationMode: e.target.value })}
                className="w-full bg-[#0A0D0F] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="Private Meeting at Our Gulshan Lounge">Private Meeting at Our Gulshan Lounge (Road 11)</option>
                <option value="Confidential Phone Briefing">Confidential Phone Briefing</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gold-metallic hover:bg-gold-hover text-slate-950 font-serif font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Confirm Confidential Briefing Request</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
