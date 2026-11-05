import React, { useState, useEffect } from 'react';
import { 
  X, Crown, Send, CheckCircle2, ShieldCheck, MapPin, 
  Phone, Calendar, Users, MessageSquare, ExternalLink, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DICTIONARY } from '../data/mockData';
import { ordersAPI } from '../services/api';

export default function ContactModal({ locale = 'en', onClose = () => {}, presetData = null }) {
  const isBn = locale === 'bn';
  const dict = DICTIONARY[locale] || DICTIONARY.en;

  const [submitted, setSubmitted] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching technical specifications:
  // Full Name, WhatsApp / Phone Number, Preferred Travel Month & Party Size, Brief Special Requirements / Notes
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelMonth: isBn ? 'রমজান ২০২৭ (শেষ ১০ দিন)' : 'Upcoming Ramadan (Royal Last 10 Nights)',
    partySize: 2,
    notes: ''
  });

  // Lock body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard Escape Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Celebratory Gold Confetti Explosion
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#996515', '#ffffff', '#ffd700']
    });

    const itemTitle = presetData?.tier || presetData?.packageName || presetData?.vehicleName || 'VIP Sacred Pilgrimage Reservation';
    const totalBDT = Number(presetData?.totalBDT) || 0;
    const totalUSD = Number(presetData?.totalUSD) || Math.round(totalBDT / 120);

    const detailedNotes = `Travel Month: ${formData.travelMonth} | Party Size: ${formData.partySize} Pilgrim(s)${presetData?.routeName ? ` | Route: ${presetData.routeName}` : ''}${formData.notes ? ` | Notes: ${formData.notes}` : ''}`;

    let savedOrder = null;
    try {
      savedOrder = await ordersAPI.create({
        type: 'vip_dossier',
        customerName: formData.name,
        customerPhone: formData.phone,
        notes: detailedNotes,
        tier: itemTitle,
        totalBDT,
        totalUSD,
        items: [
          {
            name: itemTitle,
            quantity: formData.partySize,
            priceBDT: totalBDT,
            notes: detailedNotes
          }
        ]
      });
    } catch (err) {
      console.warn('Could not record reservation order to API:', err);
    }

    const orderId = savedOrder?.id || `DOS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedOrderRef(orderId);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  // WhatsApp Pre-filled URL for Director connection
  const waMessage = `Assalamu Alaikum! I have submitted a VIP Reservation on LabbaikHorizon:
*Reference:* ${createdOrderRef || 'VIP-DOSSIER'}
*Name:* ${formData.name}
*WhatsApp / Phone:* ${formData.phone}
*Travel Month:* ${formData.travelMonth}
*Party Size:* ${formData.partySize} Pilgrim(s)
*Selected Package / Service:* ${presetData?.tier || presetData?.packageName || presetData?.vehicleName || 'VIP Sacred Pilgrimage Dossier'}
${presetData?.totalBDT ? `*Estimated Investment:* ৳${Number(presetData.totalBDT).toLocaleString('en-IN')} BDT\n` : ''}${formData.notes ? `*Special Notes:* ${formData.notes}\n` : ''}
Please connect me with a Private Client Director to confirm our dates and itinerary.`;

  const waUrl = `https://wa.me/8801800522224?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans">
      
      {/* Background Dim Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#121215]/95 border border-[#d4af37] backdrop-blur-xl rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] z-10 selection:bg-[#d4af37] selection:text-[#080809]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* CONFIRMATION SCREEN WITH INSTANT WHATSAPP LINK */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-[#d4af37]/15 border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#d4af37]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                {isBn ? 'সংরক্ষণ সফলভাবে নিশ্চিত' : 'VIP Reservation Confirmed'}
              </span>
              <h3 className="text-2xl font-serif font-extrabold text-white">
                {isBn ? 'আপনার বুকিং অনুরোধ গৃহীত হয়েছে!' : 'Sacred Dossier Transmitted!'}
              </h3>
            </div>

            <div className="bg-[#080809] p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
              <div>
                {isBn ? 'রেফারেন্স কোড:' : 'Dossier Ref:'} <strong className="text-[#d4af37] text-sm">{createdOrderRef}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                {formData.name} • {formData.partySize} {isBn ? 'জন সম্মানিত যাত্রী' : 'Pilgrim(s)'}
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
              {isBn 
                ? 'জাজাকআল্লাহ খাইরান। আমাদের প্রাইভেট ক্লায়েন্ট ডিরেক্টর আপনার সাথে অতিসত্বর যোগাযোগ করবেন। সরাসরি এখনই আলোচনা করতে নিচের বাটনে ক্লিক করুন।' 
                : 'JazakAllah Khair. Your VIP dossier has been logged. You may connect directly with our Private Client Director on WhatsApp right now.'}
            </p>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-2 flex flex-col gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isBn ? 'হোয়াটসঅ্যাপে ডিরেক্টরের সাথে কথা বলুন' : 'Connect with Director on WhatsApp'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                {isBn ? 'উইন্ডো বন্ধ করুন' : 'Close Window'}
              </button>
            </div>
          </div>
        ) : (
          /* VIP CREDENTIALS RESERVATION FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Form Header */}
            <div className="flex items-center gap-3 border-b border-[#d4af37]/25 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white leading-tight">
                  {isBn ? 'ভিআইপি তীর্থযাত্রা রিজার্ভেশন' : 'VIP Pilgrimage Reservation'}
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {isBn ? 'প্রাইভেট ডিরেক্টরের সরাসরি তত্ত্বাবধান ও অনুমোদন' : 'Direct Private Client Director Consultation'}
                </p>
              </div>
            </div>

            {/* Selected Package / Fleet Preset Summary Card */}
            {presetData && (
              <div className="bg-[#080809]/80 p-3.5 rounded-2xl border border-[#d4af37]/30 text-xs text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase tracking-widest">
                    {presetData.vehicleName 
                      ? (isBn ? 'নির্বাচিত প্রাইভেট গাড়ি ও রুট' : 'Selected Fleet & Route')
                      : (isBn ? 'নির্বাচিত ক্যাটাগরি / প্যাকেজ' : 'Selected Pilgrimage Package')
                    }
                  </span>
                  {presetData.type && (
                    <span className="text-[10px] bg-[#d4af37]/10 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      {presetData.type}
                    </span>
                  )}
                </div>

                <div className="font-serif font-bold text-white text-sm">
                  {presetData.tier || presetData.packageName || presetData.vehicleName || 'Custom Sacred Pilgrimage'}
                </div>

                {presetData.routeName && (
                  <div className="text-amber-300 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{presetData.routeName}</span>
                  </div>
                )}

                {presetData.totalBDT ? (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 mt-1">
                    <span className="text-slate-400 font-light">
                      {isBn ? 'আনুমানিক বিনিয়োগ:' : 'Estimated Investment:'}
                    </span>
                    <span className="text-kiswah-gold font-serif font-extrabold text-sm">
                      ৳{Number(presetData.totalBDT).toLocaleString('en-IN')} BDT
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Field 1: Full Name */}
            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                {isBn ? 'সম্মানিত যাত্রীর পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমনঃ আলহাজ্ব সাইফুল ইসলাম চৌধুরী' : 'e.g. Al-Haj Syful Islam Chowdhury'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#080809] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>

            {/* Field 2: WhatsApp / Phone Number */}
            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                {isBn ? 'হোয়াটসঅ্যাপ / ফোন নম্বর (+৮৮০) *' : 'WhatsApp / Phone Number (+880) *'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="01711-XXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none font-mono transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Fields 3 & 4: Preferred Travel Month & Party Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                  {isBn ? 'ভ্রমণের সম্ভাব্য মাস' : 'Preferred Travel Month'}
                </label>
                <div className="relative">
                  <select
                    value={formData.travelMonth}
                    onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                    className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 text-xs focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value={isBn ? 'রমজান ২০২৭ (শেষ ১০ দিন)' : 'Upcoming Ramadan (Royal Last 10 Nights)'}>
                      {isBn ? 'রমজান ২০২৭ (শেষ ১০ দিন)' : 'Upcoming Ramadan (Royal Last 10 Nights)'}
                    </option>
                    <option value={isBn ? 'শীতকালীন পবিত্র মাস (ডিসেম্বর-ফেব্রুয়ারি)' : 'Winter Sacred Season (Dec - Feb)'}>
                      {isBn ? 'শীতকালীন পবিত্র মাস (ডিসেম্বর-ফেব্রুয়ারি)' : 'Winter Sacred Season (Dec - Feb)'}
                    </option>
                    <option value={isBn ? 'রাজকীয় ভিআইপি হজ ২০২৭' : 'Royal VIP Hajj 2027'}>
                      {isBn ? 'রাজকীয় ভিআইপি হজ ২০২৭' : 'Royal VIP Hajj 2027'}
                    </option>
                    <option value={isBn ? 'রজব ও শাবান মাস' : 'Rajab & Shaban Sacred Months'}>
                      {isBn ? 'রজব ও শাবান মাস' : 'Rajab & Shaban Sacred Months'}
                    </option>
                    <option value={isBn ? 'তাৎক্ষণিক প্রাইভেট ওমরাহ' : 'Immediate Private Umrah'}>
                      {isBn ? 'তাৎক্ষণিক প্রাইভেট ওমরাহ' : 'Immediate Private Umrah'}
                    </option>
                  </select>
                  <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                  {isBn ? 'যাত্রী সংখ্যা (Party Size)' : 'Party Size (Pilgrims)'}
                </label>
                <div className="flex items-center bg-[#080809] border border-slate-800 rounded-xl px-3 py-1.5 justify-between">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, partySize: Math.max(1, formData.partySize - 1) })}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-300 font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white text-sm">
                    {formData.partySize} {isBn ? 'জন' : 'Person(s)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, partySize: formData.partySize + 1 })}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-300 font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Field 5: Special Requirements / Notes */}
            <div>
              <label className="text-xs font-serif font-bold text-slate-200 mb-1.5 block uppercase tracking-wider">
                {isBn ? 'বিশেষ কোনো চাহিদা বা নোট (ঐচ্ছিক)' : 'Brief Special Requirements / Notes'}
              </label>
              <textarea
                rows={2}
                placeholder={isBn ? 'যেমনঃ হুইলচেয়ার সহায়তা, সরাসরি কাবা ভিউ স্যুইট, বাংলাভাষী প্রবীণ মোয়াল্লেম' : 'e.g. Wheelchair assistance, direct Kaaba view suite, senior scholar accompaniment'}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#080809] border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:border-[#d4af37] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold rounded-xl text-xs sm:text-sm tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
            >
              <Crown className="w-4 h-4 text-[#080809]" />
              <span>{isSubmitting ? (isBn ? 'রিজার্ভেশন জমা হচ্ছে...' : 'Transmitting Dossier...') : (isBn ? 'রিজার্ভেশন নিশ্চিত করুন' : 'Reserve Trip & Secure Dossier')}</span>
              <Send className="w-4 h-4 text-[#080809]" />
            </button>

            <p className="text-[10px] text-slate-400 text-center font-light pt-1">
              {isBn 
                ? '🔒 আপনার তথ্য সম্পূর্ণ গোপন রাখা হবে • কোনো অগ্রিম বুকিং ফি নেই' 
                : '🔒 Confidential & Diplomatic Privacy Assured • Zero Upfront Booking Fee'}
            </p>

          </form>
        )}

      </motion.div>
    </div>
  );
}
