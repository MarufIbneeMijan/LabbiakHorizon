import React from 'react';
import { Crown, ShieldCheck, MapPin, Phone, Mail, Clock, MessageSquare, Lock } from 'lucide-react';
import { DICTIONARY, AGENCY_CREDENTIALS } from '../data/mockData';

export default function Footer({ locale, onOpenConsultation, onOpenAdmin = () => {} }) {
  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const whatsappUrl = "https://wa.me/8801800522224?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20request%20a%20confidential%20VIP%20dossier%20from%20LabbaikHorizon.";

  return (
    <footer id="footer" className="bg-[#050505] border-t border-[#d4af37]/20 text-slate-300 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Gulshan Lounge Feature Banner */}
        <div className="bg-kiswah-card p-8 sm:p-10 rounded-3xl border border-[#d4af37]/30 kiswah-gold-glow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>{dict.footer.loungeBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
              {dict.footer.loungeTitle}
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
              {dict.footer.loungeSub}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold pt-1">
              <Clock className="w-4 h-4" />
              <span>{dict.footer.loungeHours}</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={onOpenConsultation}
              className="w-full py-4 px-6 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold rounded-2xl text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 text-[#080809]" />
              <span>{dict.footer.bookMeetingBtn}</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-white/[0.04] hover:bg-white/[0.08] border border-[#d4af37]/30 text-amber-300 font-serif font-semibold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#d4af37]" />
              <span>{dict.footer.whatsappBtn}</span>
            </a>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] to-[#996515] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#080809] rounded-[10px] flex items-center justify-center text-xl font-serif">
                  🕋
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wider">LABBAIK HORIZON</h3>
                <p className="text-[10px] text-[#d4af37] uppercase font-mono tracking-widest">
                  {locale === 'bn' ? AGENCY_CREDENTIALS.taglineBn : AGENCY_CREDENTIALS.taglineEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-md">
              {locale === 'bn' 
                ? 'লাব্বাইকহরাইজন কিসওয়াহ অনুপ্রেরণায় অতি-অভিজাত হজ ও ওমরাহ কনসিয়ার্জ। প্রভিংশিয়াল স্যুইট, প্রাইভেট বুলেট ট্রেন ফার্স্ট ক্লাস ও প্রবীণ স্কলারের মাধ্যমে নিরবচ্ছিন্ন আধ্যাত্মিক সেবা।' 
                : 'LabbaikHorizon is the premier Kiswah-inspired pilgrimage concierge. Serving high-net-worth families with presidential suites, private bullet train carriages, and discreet 24/7 scholar chaperones.'
              }
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 text-[#d4af37] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>MoRA: {AGENCY_CREDENTIALS.moraReg}</span>
              </span>
              <span className="text-[#d4af37]/40">•</span>
              <span>ATAB: {AGENCY_CREDENTIALS.atabReg}</span>
            </div>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              {dict.footer.addressTitle}
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 bg-white/[0.02] p-3 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{locale === 'bn' ? AGENCY_CREDENTIALS.addressBn : AGENCY_CREDENTIALS.addressEn}</span>
              </div>

              <a href="tel:+8801800522224" className="flex items-center gap-2.5 bg-white/[0.02] p-3 rounded-xl border border-slate-800 hover:border-[#d4af37] transition-colors text-amber-300 font-bold">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>24/7 VIP Hotline: {AGENCY_CREDENTIALS.hotline}</span>
              </a>

              <a href="mailto:vip@labbaikhorizon.com" className="flex items-center gap-2.5 bg-white/[0.02] p-3 rounded-xl border border-slate-800 hover:border-[#d4af37] transition-colors text-slate-300">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>{AGENCY_CREDENTIALS.email}</span>
              </a>
            </div>
          </div>

          {/* Direct Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              {dict.footer.privilegesTitle}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">• {locale === 'bn' ? 'কাবা শরিফ ভিউ পেন্টহাউস' : "Panoramic Ka'aba Penthouse"}</li>
              <li className="hover:text-white transition-colors cursor-pointer">• {locale === 'bn' ? 'বুলেট ট্রেন ভিআইপি ফার্স্ট ক্লাস' : 'Bullet Train First-Class Carriage'}</li>
              <li className="hover:text-white transition-colors cursor-pointer">• {locale === 'bn' ? 'ডিপ্লোমেটিক সিআইপি ফাস্ট-ট্র্যাক' : 'Diplomatic CIP Fast-Track (DAC)'}</li>
              <li className="hover:text-white transition-colors cursor-pointer">• {locale === 'bn' ? '১-অন-১ প্রবীণ আলেম স্কলার' : '1-on-1 Senior Scholar Escort'}</li>
              <li className="hover:text-white transition-colors cursor-pointer">• {locale === 'bn' ? 'জমজম ও আজওয়া খেজুর ডেলিভারি' : 'Sacred Zamzam & Ajwa Delivery'}</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {dict.footer.rights}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span>{locale === 'bn' ? 'গুলশান-২, ঢাকা' : 'Gulshan-2, Dhaka'}</span>
            <span>•</span>
            <span>MoRA Certified HAAB-1420</span>
            <span>•</span>
            <span>100% Shariah Compliant</span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#d4af37]" />
              <span>{locale === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Control Center'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* FLOATING ACTION BUTTON (BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* WhatsApp VIP Channel Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 kiswah-gold-glow"
          title="Connect with Private Client Director"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-serif font-bold transition-all duration-300">
            {dict.footer.whatsappBtn}
          </span>
        </a>

        {/* Request VIP Briefing Button */}
        <button
          onClick={onOpenConsultation}
          className="p-4 rounded-full bg-kiswah-gold text-[#080809] shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 kiswah-gold-glow cursor-pointer"
          title="Request VIP Briefing"
        >
          <Crown className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-serif font-bold transition-all duration-300 uppercase tracking-wider">
            {dict.footer.bookMeetingBtn}
          </span>
        </button>
      </div>

    </footer>
  );
}
