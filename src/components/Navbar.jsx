import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Sparkles, Phone, Globe, Menu, X, 
  ChevronRight, Crown, Lock, ShoppingBag, Palette, Check 
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { DICTIONARY } from '../data/mockData';

const THEMES = [
  { id: 'kiswah', nameEn: 'Kiswah Gold', nameBn: 'কিসওয়াহ গোল্ড', icon: '🕋' },
  { id: 'emerald', nameEn: 'Madinah Emerald', nameBn: 'মদিনা এমারেল্ড', icon: '🌿' },
  { id: 'desert', nameEn: 'Desert Sand', nameBn: 'মরু বালুকা', icon: '🏜️' }
];

export default function Navbar({ 
  locale = 'en', 
  onToggleLocale = () => {}, 
  theme = 'kiswah',
  onSelectTheme = () => {},
  onOpenConsultation = () => {}, 
  onNavigateCurator = () => {}, 
  onOpenWizard = () => {},
  onOpenAdmin = () => {},
  cartCount = 0,
  onOpenCart = () => {}
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const dict = DICTIONARY[locale] || DICTIONARY.en;
  const isBn = locale === 'bn';

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Framer motion top scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Exactly 4 primary navigation touchpoints as specified in UX architecture
  const primaryNavLinks = [
    { name: isBn ? 'প্যাকেজ সমূহ' : 'Packages', href: '#packages' },
    { name: isBn ? 'প্রাইভেট ট্রান্সপোর্ট' : 'Transport Fleet', href: '#fleet' },
    { name: isBn ? 'অনলাইন শপ' : 'Pilgrim Essentials', href: '#store' },
    { name: isBn ? 'সাধারণ জিজ্ঞাসা' : 'FAQ', href: '#faq' },
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
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{dict.topBar.mora}</span>
            </span>
            <span className="hidden sm:inline text-[#d4af37]/40">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.topBar.shariah}</span>
            </span>
            <span className="hidden md:inline text-[#d4af37]/40">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-amber-300">
              <Crown className="w-3.5 h-3.5" />
              <span>{dict.topBar.diplomatic}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#080809] transition-colors cursor-pointer"
              title={isBn ? 'অ্যাডমিন পোর্টাল ও সিএমএস' : 'Admin Portal & CMS'}
            >
              <Lock className="w-3 h-3" />
              <span className="font-serif uppercase font-bold text-[10px] tracking-wider">
                {dict.nav?.admin || (isBn ? 'অ্যাডমিন' : 'Admin CMS')}
              </span>
            </button>

            <span className="text-[#d4af37]/40">|</span>

            <a 
              href="tel:+8801800522224" 
              className="flex items-center gap-1.5 text-kiswah-gold hover:opacity-80 transition-opacity"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{dict.topBar.hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Minimalist Header Navigation */}
      <nav className="bg-[#080809]/92 backdrop-blur-xl border-b border-[#d4af37]/20 py-3 sm:py-3.5 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c158] via-[#d4af37] to-[#996515] p-0.5 shadow-xl shadow-[#d4af37]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080809] rounded-[10px] flex items-center justify-center text-lg font-serif">
                🕋
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#d4af37] transition-colors">
                  LabbaikHorizon
                </span>
                <span className="hidden sm:inline-block bg-[#d4af37]/10 text-[#d4af37] text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded border border-[#d4af37]/30">
                  Concierge
                </span>
              </div>
              <p className="text-[10px] text-[#d4af37]/80 tracking-widest font-mono uppercase">
                {isBn ? 'কিসওয়াহ আল্ট্রা-লাক্সারি জিয়ারত' : 'Kiswah Ultra-Luxury Pilgrimage'}
              </p>
            </div>
          </a>

          {/* Desktop Clean Hierarchy: Exactly 4 Primary Touchpoints */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-serif font-bold uppercase tracking-wider">
            {primaryNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-[#d4af37] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#d4af37] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Action Area: Secondary Group + Glowing CTA */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* SECONDARY ACTIONS GROUP */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-2xl border border-slate-800 relative">
              
              {/* Multi-Theme Palette Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-[#d4af37] transition-colors cursor-pointer text-xs font-serif font-medium"
                  title={isBn ? 'কালার থিম পরিবর্তন করুন' : 'Switch Visual Theme'}
                >
                  <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-xs">
                    {THEMES.find((t) => t.id === theme)?.icon}
                  </span>
                </button>

                {themeDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setThemeDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#121215] border border-[#d4af37]/40 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-400 border-b border-slate-800">
                        {isBn ? 'থিম নির্বাচন করুন' : 'Select Theme'}
                      </div>
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTheme(t.id);
                            setThemeDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif transition-colors cursor-pointer ${
                            theme === t.id
                              ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold'
                              : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{t.icon}</span>
                            <span>{isBn ? t.nameBn : t.nameEn}</span>
                          </span>
                          {theme === t.id && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <span className="w-px h-4 bg-slate-800" />

              {/* Language Switcher Toggle */}
              <button
                onClick={onToggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/[0.06] text-[#d4af37] transition-colors cursor-pointer text-xs font-serif font-bold"
                title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{dict.topBar.langSwitch}</span>
              </button>

              <span className="w-px h-4 bg-slate-800" />

              {/* Floating Cart Icon with Dynamic Gold Badge Counter */}
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-xl text-slate-300 hover:text-[#d4af37] hover:bg-white/[0.06] transition-colors cursor-pointer"
                title={isBn ? 'শপিং ব্যাগ দেখুন' : 'View Cart'}
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-kiswah-gold text-[#080809] text-[9px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

            </div>

            {/* GLOWING GOLD CTA BUTTON: "Build Custom Package" / "কাস্টম প্যাকেজ তৈরি করুন" */}
            <button
              onClick={() => {
                const el = document.getElementById('custom-package') || document.getElementById('curator');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onOpenWizard();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#e5c158] text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#080809] group-hover:rotate-12 transition-transform" />
              <span>{isBn ? 'কাস্টম প্যাকেজ তৈরি করুন' : 'Build Custom Package'}</span>
            </button>

          </div>

          {/* Mobile Viewport Controls (Cart + Hamburger) */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Mobile Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative w-11 h-11 rounded-xl bg-white/[0.04] border border-[#d4af37]/30 text-slate-300 flex items-center justify-center cursor-pointer"
              aria-label="Open mobile cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-kiswah-gold text-[#080809] text-[9px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger (44x44px target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 rounded-xl bg-slate-900 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

      </nav>

      {/* MOBILE RESPONSIVE DRAWER OVERLAY (Framer-Motion Slide-In) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[96px] z-50 lg:hidden overflow-hidden flex flex-col">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#080809]/80 backdrop-blur-xl"
            />

            {/* Menu Drawer Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-[#0b0b0e] border-b border-[#d4af37]/30 px-5 py-6 shadow-2xl flex flex-col gap-4 z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Primary 4 Touchpoints */}
              <div className="flex flex-col gap-2.5">
                {primaryNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-slate-800 text-slate-200 hover:text-[#d4af37] hover:border-[#d4af37]/40 font-serif font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                  </a>
                ))}
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-serif uppercase tracking-wider px-1">
                  {isBn ? 'কালার থিম নির্বাচন করুন' : 'Select Visual Theme'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                      }}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        theme === t.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                          : 'bg-white/[0.03] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{t.icon}</span>
                      <span className="text-[10px] font-serif leading-tight">
                        {isBn ? t.nameBn : t.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    onToggleLocale();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-slate-800 text-slate-300 text-xs font-serif font-bold cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-[#d4af37]" />
                  <span>{dict.topBar.langSwitch}</span>
                </button>
              </div>

              {/* Cart Drawer Launcher */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-[#d4af37]/30 text-white font-serif font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>{isBn ? 'শপিং ব্যাগ' : 'Shopping Cart'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-kiswah-gold text-[#080809] font-mono font-extrabold text-[11px]">
                  {cartCount} {isBn ? 'আইটেম' : 'items'}
                </span>
              </button>

              {/* Build Custom Package CTA */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById('custom-package') || document.getElementById('curator');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onOpenWizard();
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#e5c158] text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-[#080809]" />
                <span>{isBn ? 'কাস্টম প্যাকেজ তৈরি করুন' : 'Build Custom Package'}</span>
              </button>

              {/* Admin Portal Quick Link */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#d4af37] font-mono cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-[#d4af37]" />
                  <span>{dict.nav?.admin || (isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Control Center')}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
