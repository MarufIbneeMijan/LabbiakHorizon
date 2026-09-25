import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, ShieldCheck, Sparkles, Phone, 
  Menu, X, ChevronRight, Crown, MapPin, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { AGENCY_CREDENTIALS } from '../data/mockData';

export default function Navbar({ onOpenConsultation, onNavigateCurator }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioToast, setAudioToast] = useState('');

  // Framer motion scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Ambient Audio Ref (HTML5 Audio with royalty free peaceful audio chime)
  const audioRef = useRef(null);

  useEffect(() => {
    // Audio instance setup
    audioRef.current = new Audio('https://cdn.freesound.org/previews/568/568453_12185202-lq.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      showToast('Ambient soundscape muted');
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        showToast('Ambient soundscape active');
      }).catch((err) => {
        console.log('Audio autoplay blocked or failed:', err);
        showToast('Audio playback enabled');
        setIsPlayingAudio(true);
      });
    }
  };

  const showToast = (msg) => {
    setAudioToast(msg);
    setTimeout(() => {
      setAudioToast('');
    }, 3000);
  };

  const navLinks = [
    { name: 'Royal Suites', href: '#suites' },
    { name: 'Four Pillars', href: '#pillars' },
    { name: 'Concierge Curator', href: '#curator' },
    { name: 'Dignitary Reviews', href: '#testimonials' },
    { name: 'VIP Lounge', href: '#footer' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      
      {/* Top Framer-Motion Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#e5c158] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Status & Accreditation Bar */}
      <div className="bg-[#050505] text-slate-300 text-xs py-2 px-4 border-b border-[#d4af37]/20 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MoRA Certified: <strong className="text-white">HAAB-1420</strong></span>
            </span>
            <span className="hidden sm:inline text-[#d4af37]/40">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Shariah-Compliant Pilgrimage Protocol</span>
            </span>
            <span className="hidden md:inline text-[#d4af37]/40">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-amber-300">
              <Crown className="w-3.5 h-3.5" />
              <span>Worldwide Diplomatic Fast-Track</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a 
              href="tel:+8801800522224" 
              className="flex items-center gap-1.5 text-kiswah-gold hover:opacity-80 transition-opacity"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>VIP Desk: {AGENCY_CREDENTIALS.hotline}</span>
            </a>
            <span className="text-[#d4af37]/40">|</span>
            <button 
              onClick={onOpenConsultation}
              className="text-slate-200 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              Request VIP Briefing
            </button>
          </div>
        </div>
      </div>

      {/* Main Kiswah Header Navigation */}
      <nav className="bg-[#080808]/90 backdrop-blur-xl border-b border-[#d4af37]/20 py-3.5 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo with Golden Ka'aba Icon */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#e5c158] via-[#d4af37] to-[#996515] p-0.5 shadow-xl shadow-[#d4af37]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center text-xl font-serif">
                🕋
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#d4af37] transition-colors">
                  LabbaikHorizon
                </span>
                <span className="bg-[#d4af37]/10 text-[#d4af37] text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded border border-[#d4af37]/30">
                  Concierge
                </span>
              </div>
              <p className="text-[10px] text-[#d4af37]/80 tracking-widest font-mono uppercase">
                Kiswah Ultra-Luxury Pilgrimage
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-[#d4af37] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#d4af37] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Header Action Buttons & Audio Controller */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* AMBIENT AUDIO CONTROLLER WIDGET */}
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] kiswah-gold-glow'
                  : 'bg-white/[0.03] border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isPlayingAudio ? 'Mute Ambient Soundscape' : 'Enable Ambient Audio Soundscape'}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4" />}
              
              {/* Animated Sound Wave Equalizer Indicator */}
              {isPlayingAudio && (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-[#d4af37] animate-equalizer-1 rounded-full" />
                  <span className="w-0.5 bg-[#d4af37] animate-equalizer-2 rounded-full" />
                  <span className="w-0.5 bg-[#d4af37] animate-equalizer-3 rounded-full" />
                </div>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (onNavigateCurator) onNavigateCurator();
                onOpenConsultation();
              }}
              className="px-5 py-2.5 rounded-xl bg-kiswah-gold text-[#080808] font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#d4af37]/20 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Crown className="w-4 h-4 text-[#080808] group-hover:rotate-12 transition-transform" />
              <span>Request VIP Dossier</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle & Audio Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-lg bg-white/[0.04] border border-[#d4af37]/30 text-[#d4af37]"
            >
              {isPlayingAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-[#d4af37]/30 text-[#d4af37] hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Audio Toast Notification */}
        <AnimatePresence>
          {audioToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-[-36px] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#121214] border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-semibold shadow-xl backdrop-blur-md"
            >
              {audioToast}
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#080808] border-b border-[#d4af37]/20 px-4 py-5 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/[0.03] border border-[#d4af37]/20 text-slate-200 hover:text-[#d4af37] font-medium text-xs tracking-wider uppercase"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#d4af37]/60" />
                </a>
              ))}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-3 rounded-xl bg-kiswah-gold text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Request Confidential Dossier</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
