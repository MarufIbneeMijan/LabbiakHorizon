import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sparkles, Tag, Check, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Phone, User, MapPin, 
  MessageSquare, Send, CreditCard, Star, RefreshCw, Eye, 
  Plus, Minus, Search, Filter, Share2, ArrowLeft, ExternalLink,
  ChevronRight, Award, Compass, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ShopPage({
  locale = 'bn',
  onToggleLocale = () => {},
  theme = 'kiswah',
  onSelectTheme = () => {},
  cartItems = [],
  cartCount = 0,
  onOpenCart = () => {},
  onAddToCart = () => {},
  onBuyNow = () => {},
  onOpenConsultation = () => {}
}) {
  const isBn = locale === 'bn';
  const isAdmin = typeof window !== 'undefined' && Boolean(localStorage.getItem('horizon_admin_token'));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'price-low' | 'price-high' | 'name'
  const [copiedLink, setCopiedLink] = useState(false);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const DEFAULT_CATEGORIES = [
    { id: 'all', labelEn: 'All Pilgrim Essentials', labelBn: 'সকল পণ্যসমূহ', icon: '🕋' },
    { id: 'ihram', labelEn: 'Ihram & Attire', labelBn: 'ইহরাম ও পোশাক', icon: '🥻' },
    { id: 'zamzam', labelEn: 'Zamzam Water', labelBn: 'জমজম পানি', icon: '💧' },
    { id: 'dates', labelEn: 'Ajwa Dates & Relics', labelBn: 'আজওয়া খেজুর ও হাদিয়া', icon: '🌴' },
    { id: 'tasbeeh', labelEn: 'Digital Counters & Dua', labelBn: 'স্মার্ট তাসবীহ ও কাউন্টার', icon: '📿' },
    { id: 'rugs', labelEn: 'Orthopedic Rugs & Footwear', labelBn: 'মেমোরি ফোম জায়নামাজ ও জুতো', icon: '🕌' },
    { id: 'skincare', labelEn: 'Halal Personal Care', labelBn: 'হালাল স্কিনকেয়ার ও কিট', icon: '🧴' }
  ];

  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('horizon_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...DEFAULT_CATEGORIES];
          parsed.forEach((c) => {
            if (!merged.some((m) => m.id === c.id)) {
              merged.push({ ...c, icon: c.icon || '✨' });
            }
          });
          setCategoriesList(merged);
        }
      }
    } catch {}
  }, []);

  // Load products on mount
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll('all');
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load shop catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // URL Query Parameters support for social media ads (e.g. /shop?product=prod-ihram-egyptian or /shop?category=ihram)
  useEffect(() => {
    if (products.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const prodParam = urlParams.get('product');
    const catParam = urlParams.get('category');

    if (catParam) {
      setActiveCategory(catParam);
    }

    if (prodParam) {
      const found = products.find((p) => p.id === prodParam);
      if (found) {
        setSelectedProduct(found);
        setDetailQuantity(1);
      }
    }
  }, [products]);

  // Lock body scroll when detail modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  // Copy ad shareable link
  const handleCopyAdLink = (productId = null) => {
    const url = new URL(window.location.origin + '/shop');
    if (productId) {
      url.searchParams.set('product', productId);
    } else if (activeCategory !== 'all') {
      url.searchParams.set('category', activeCategory);
    }

    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    // Category match
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    if (!catMatch) return false;

    // Search query match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameEn = (p.name_en || '').toLowerCase();
    const nameBn = (p.name_bn || '').toLowerCase();
    const descEn = (p.description_en || '').toLowerCase();
    const descBn = (p.description_bn || '').toLowerCase();
    return nameEn.includes(q) || nameBn.includes(q) || descEn.includes(q) || descBn.includes(q);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return (a.priceBDT || 0) - (b.priceBDT || 0);
    }
    if (sortBy === 'price-high') {
      return (b.priceBDT || 0) - (a.priceBDT || 0);
    }
    if (sortBy === 'name') {
      const nameA = isBn ? (a.name_bn || a.name_en) : (a.name_en || a.name_bn);
      const nameB = isBn ? (b.name_bn || b.name_en) : (b.name_en || b.name_bn);
      return nameA.localeCompare(nameB);
    }
    // Default popularity: stock availability and tag
    return (b.stock || 0) - (a.stock || 0);
  });

  // Specifications builder
  const getProductSpecs = (prod) => {
    const isIhram = prod.category === 'ihram' || prod.id?.includes('ihram');
    const isZamzam = prod.category === 'zamzam' || prod.id?.includes('zamzam');
    const isDates = prod.category === 'dates' || prod.id?.includes('ajwa');
    const isTasbeeh = prod.category === 'tasbeeh' || prod.id?.includes('tasbeeh');

    if (isZamzam) {
      return {
        origin: isBn ? 'মক্কার পবিত্র কুদাই প্ল্যান্ট, সৌদি আরব' : 'Sacred Kudai Well Bottling, Makkah, KSA',
        specs: [
          isBn ? 'সৌদি পরিবেশ ও পানি মন্ত্রণালয় অনুমোদিত সিলগালা' : 'Saudi Ministry of Environment & Water certified seal',
          isBn ? '৫ লিটার এয়ারলাইন্স ও কাস্টমস স্ট্যান্ডার্ড ট্রাভেল বক্স' : '5-Liter standard GACA-compliant leakproof travel packaging',
          isBn ? 'সরাসরি ঢাকায় বাসায় সুরক্ষিত ডেলিভারি' : 'Direct secure doorstep delivery across Bangladesh'
        ],
        shariahNote: isBn 
          ? '১০০% খাঁটি ও আসল জমজম পানি। হজ ও ওমরাহ যাত্রীদের জন্য বরকতময় শেফা।' 
          : '100% authentic unadulterated Zamzam water with sacred medicinal and spiritual virtues.'
      };
    }

    if (isIhram) {
      return {
        origin: isBn ? '১০০% মিসরীয় খাঁটি চিরুনি-সুতি (Egyptian Combed Cotton)' : '100% Egyptian Long-Staple Combed Cotton',
        specs: [
          isBn ? 'সেলাইবিহীন ২-পিস পুরুষদের প্রিমিয়াম ইহরাম সেট' : 'Seamless 2-piece gentlemen Ihram towel set (120x220cm)',
          isBn ? 'উচ্চ ঘাম শোষণকারী ও অত্যন্ত আরামদায়ক টেক্সচার' : 'Ultra-absorbent, hypoallergenic, and heat-wicking texture',
          isBn ? 'ফ্রি ট্রাভেল বেল্ট ও গোপনীয় জিপারযুক্ত মানিব্যাগ পাউচ' : 'Includes secure anti-theft Ihram travel belt & buckle pouch'
        ],
        shariahNote: isBn 
          ? 'শরীয়াহ সম্মত সম্পূর্ণ সেলাইবিহীন ও সুগন্ধিমুক্ত উপাদান। হজের সকল আরকানের উপযুক্ত।' 
          : '100% Shariah-compliant unstitched weave suitable for Ihram state during Hajj and Umrah.'
      };
    }

    if (isDates) {
      return {
        origin: isBn ? 'মদিনা মুনাওয়ারার আল-আলিয়া বাগান, সৌদি আরব' : 'Al-Aliyah Groves, Madinah Al-Munawwarah, KSA',
        specs: [
          isBn ? 'হাদিস বর্ণিত আলিয়ার নরম, কালো ও বরকতময় আজওয়া' : 'Hadith-referenced soft, dark, genuine Al-Aliyah Ajwa harvest',
          isBn ? '১ কেজি লাক্সারি এয়ার-টাইট কাষ্ঠের সুদৃশ্য উপহার বক্স' : '1kg luxury airtight wooden gift keepsake tin',
          isBn ? 'প্রাকৃতিক মিষ্টি ও পুষ্টিগুণ অটুট রাখতে কোল্ড-প্যাকড' : 'Cold-packed preserving natural nectar sweetness and minerals'
        ],
        shariahNote: isBn 
          ? 'রাসূলুল্লাহ (সাঃ) এর সুন্নাহসম্মত সর্বোত্তম মদিনার আজওয়া খেজুর।' 
          : 'Sunnah-recommended sacred harvest with authentic Madinah geographical provenance.'
      };
    }

    return {
      origin: isBn ? 'সৌদি প্রত্যয়িত অরিজিন্যাল কালেকশন' : 'Saudi Ministry-Verified Official Import',
      specs: [
        isBn ? '১০০% প্রিমিয়াম কোয়ালিটি এবং ট্রাভেল ফ্রেন্ডলি' : '100% premium grade, durable and pilgrimage-ready',
        isBn ? 'হজ ও ওমরাহ সফরের উপযোগী বিশেষ নকশা' : 'Specifically designed for intense spiritual and physical rites',
        isBn ? 'ঢাকায় নিজস্ব স্টক থেকে দ্রুততম হোম ডেলিভারি' : 'Ready stock in Dhaka for fast nationwide doorstep delivery'
      ],
      shariahNote: isBn 
        ? 'হজ ও ওমরাহর যাবতীয় আহকাম ও শরীয়াহ বিধিমালার শতভাগ অনুসারী।' 
        : 'Formulated and inspected strictly in accordance with Islamic Shariah travel standards.'
    };
  };

  return (
    <div className="min-h-screen theme-bg-root bg-[#080809] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      
      {/* Navigation Header */}
      <Navbar
        locale={locale}
        onToggleLocale={onToggleLocale}
        theme={theme}
        onSelectTheme={onSelectTheme}
        onOpenConsultation={onOpenConsultation}
        onNavigateCurator={() => { window.location.href = '/#curator'; }}
        onOpenWizard={() => { window.location.href = '/#packages'; }}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />

      {/* Main Shop Container */}
      <main className="flex-1 pb-24">
        
        {/* SHOP HERO BANNER */}
        <div className="relative py-14 sm:py-20 bg-gradient-to-b from-[#121215] via-[#0b0b0e] to-[#080809] border-b border-slate-800/80 overflow-hidden">
          
          {/* Ambient Lighting Blobs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/8 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
              <a href="/" className="hover:text-[#d4af37] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isBn ? 'মূল পাতায় ফিরুন' : 'Home'}</span>
              </a>
              <span>/</span>
              <span className="text-[#d4af37]">{isBn ? 'অনলাইন শপ' : 'Pilgrim Essentials Store'}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className={`${isAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#d4af37]/40 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{isBn ? 'সৌদি প্রত্যয়িত শরীয়াহ সম্মত হজ সরঞ্জাম' : 'Direct Saudi Imports & Shariah-Certified Equipment'}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
                  {isBn ? 'পবিত্র হজ ও ওমরাহ' : 'Pilgrim Essentials &'} <br className="hidden sm:block" />
                  <span className="text-kiswah-gold">{isBn ? 'প্রিমিয়াম সরঞ্জাম কালেকশন' : 'Shariah-Compliant Equipment'}</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                  {isBn 
                    ? 'মক্কার কুদাই প্ল্যান্টের সিলগালা ৫ লিটার জমজম, মিসরীয় কম্বড সুতির সেলাইবিহীন ইহরাম, মদিনার আলিয়া আজওয়া খেজুর ও মেমোরি ফোম জায়নামাজ সহ সকল প্রয়োজনীয় সরঞ্জাম সারা বাংলাদেশে হোম ডেলিভারি।' 
                    : 'Authentic Ministry-sealed Zamzam water, premium unstitched Egyptian combed cotton Ihrams, royal Madinah Al-Aliyah Ajwa dates, and orthopedic memory foam prayer rugs delivered directly to your doorstep across Bangladesh.'}
                </p>

                {/* Trust Badges Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{isBn ? '১০০% শরীয়াহ সম্মত' : '100% Shariah Compliant'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-slate-800">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isBn ? 'মক্কার সিলগালা জমজম' : 'Sealed Kudai Zamzam'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery Available'}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Ad Sharing Card (Admin Only) */}
              {isAdmin && (
                <div className="lg:col-span-4">
                  <div className="bg-[#121215]/90 border border-[#d4af37]/30 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase text-[#d4af37] font-bold tracking-wider flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" />
                        {isBn ? 'সোশ্যাল মিডিয়া এড ক্যাম্পেইন লিংক' : 'Social Media Ad Link'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Facebook • Insta • TikTok</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {isBn 
                        ? 'বিজ্ঞাপন ও সোশ্যাল শেয়ারের জন্য এই পেজের লিঙ্ক বা নির্দিষ্ট প্রোডাক্টের লিঙ্ক কপি করুন।' 
                        : 'Share direct URL in Meta Ads, Instagram bio, or TikTok campaigns to drive instant conversions.'}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleCopyAdLink()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">{isBn ? 'লিংক কপি সম্পন্ন!' : 'Link Copied to Clipboard!'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>{isBn ? 'বিজ্ঞাপন লিংক কপি করুন' : 'Copy Campaign Direct URL'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* CONTROLS TOOLBAR: CATEGORIES, SEARCH, SORT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-serif font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-kiswah-gold text-[#080809] font-bold shadow-lg shadow-[#d4af37]/20 scale-102'
                      : 'bg-white/[0.03] text-slate-300 border border-slate-800 hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="bg-[#121215] border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'পণ্য খুঁজুন, উদা: জমজম, ইহরাম, আজওয়া...' : 'Search essentials, e.g. Zamzam, Ihram, Ajwa...'}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#080809] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Sort Selection */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs">
              <span className="text-slate-400 font-mono">
                {sortedProducts.length} {isBn ? 'টি পণ্য পাওয়া গেছে' : (sortedProducts.length === 1 ? 'item found' : 'items found')}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden sm:inline">{isBn ? 'বাছাই:' : 'Sort by:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#080809] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="popularity">{isBn ? 'সর্বাধিক জনপ্রিয়' : 'Popularity / Featured'}</option>
                  <option value="price-low">{isBn ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                  <option value="price-high">{isBn ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                  <option value="name">{isBn ? 'নাম অনুযায়ী' : 'Name (A to Z)'}</option>
                </select>
              </div>
            </div>

          </div>

          {/* PRODUCT CARDS GRID */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin mx-auto" />
              <p className="text-slate-400 text-xs font-mono">
                {isBn ? 'পণ্য তালিকা লোড হচ্ছে...' : 'Loading verified pilgrim catalog from API...'}
              </p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#121215] border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-white">
                {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No Matching Essentials Found'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'অন্য কোনো ক্যাটাগরি বা ভিন্ন কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন।' : 'Try selecting another category pill or clearing your search query.'}
              </p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="px-5 py-2.5 bg-white/[0.05] border border-slate-700 text-slate-200 text-xs rounded-xl hover:bg-white/[0.1] font-serif"
              >
                {isBn ? 'সকল পণ্য দেখুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {sortedProducts.map((prod) => {
                const name = isBn ? (prod.name_bn || prod.name_en) : (prod.name_en || prod.name_bn);
                const desc = isBn ? (prod.description_bn || prod.description_en) : (prod.description_en || prod.description_bn);
                const inStock = (prod.stock || 0) > 0;

                return (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -5 }}
                    className="bg-kiswah-card rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/65 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group"
                  >
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={prod.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setDetailQuantity(1);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/30 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                          {prod.tag || 'Essential'}
                        </span>
                      </div>

                      {/* Share link button on image (Admin Only) */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyAdLink(prod.id);
                            }}
                            title={isBn ? 'এড লিংক কপি করুন' : 'Copy Direct Ad URL'}
                            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Stock availability badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          inStock 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                            : 'bg-red-950/80 text-red-300 border-red-500/40'
                        }`}>
                          {inStock ? (isBn ? `স্টক: ${prod.stock}` : `In Stock: ${prod.stock}`) : (isBn ? 'স্টক শেষ' : 'Sold Out')}
                        </span>
                      </div>
                    </div>

                    {/* Product Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-[#d4af37] font-bold tracking-widest block">
                          {prod.category?.toUpperCase()}
                        </span>
                        <h3
                          onClick={() => {
                            setSelectedProduct(prod);
                            setDetailQuantity(1);
                          }}
                          className="text-base font-serif font-bold text-white leading-snug hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-2"
                        >
                          {name}
                        </h3>
                        {desc && (
                          <p className="text-xs text-slate-400 font-light line-clamp-2">
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Pricing & Dual Action Buttons */}
                      <div className="pt-3 border-t border-slate-800 space-y-3">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                            {isBn ? 'মূল্য' : 'Price'}
                          </span>
                          <div className="text-lg font-serif font-extrabold text-kiswah-gold">
                            ৳{prod.priceBDT?.toLocaleString('en-IN')}{isBn ? '/-' : ''}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* "See Details" */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setDetailQuantity(1);
                            }}
                            className="py-2.5 px-2 rounded-xl font-serif font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 hover:text-[#d4af37] border border-slate-700 hover:border-[#d4af37]/60"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{isBn ? 'বিস্তারিত' : 'Details'}</span>
                          </button>

                          {/* "Add to Bag" / "Buy Now" */}
                          <button
                            type="button"
                            onClick={() => onAddToCart(prod, 1)}
                            disabled={!inStock}
                            className={`py-2.5 px-2 rounded-xl font-serif font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md ${
                              inStock
                                ? 'bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] hover:scale-[1.02]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isBn ? 'অর্ডার' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      {/* PRODUCT QUICK VIEW "SEE DETAILS" MODAL (STANDARDIZED WITH PACKAGE DETAILS MODAL) */}
      <AnimatePresence>
        {selectedProduct && (() => {
          const prod = selectedProduct;
          const name = isBn ? (prod.name_bn || prod.name_en) : (prod.name_en || prod.name_bn);
          const desc = isBn ? (prod.description_bn || prod.description_en) : (prod.description_en || prod.description_bn);
          const inStock = (prod.stock || 0) > 0;
          const liveTotal = (prod.priceBDT || 0) * detailQuantity;
          const specs = getProductSpecs(prod);

          return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
              
              {/* Modal Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#080809]/85 backdrop-blur-2xl transition-opacity" 
                onClick={() => setSelectedProduct(null)} 
              />

              {/* Standardized Glassmorphic Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative bg-[#101013] border border-[#d4af37]/40 rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[85vh] backdrop-blur-xl"
              >
                {/* Standardized Header Banner (h-48 sm:h-56 shrink-0) */}
                <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden bg-slate-950">
                  <img
                    src={prod.image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-[#101013]/60 to-transparent" />

                  {/* Top Bar with Badges and 44x44 Close Button (top-4 right-4 z-20) */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                        {prod.tag || 'Essential'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-[#d4af37]/30 font-mono text-[10px] uppercase tracking-wider">
                        {prod.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="w-11 h-11 rounded-full bg-[#080809]/80 hover:bg-[#d4af37] text-slate-300 hover:text-[#080809] border border-[#d4af37]/40 flex items-center justify-center transition-all cursor-pointer shadow-xl"
                      aria-label="Close product modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title in Header */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
                      {name}
                    </h3>
                  </div>
                </div>

                {/* Scrollable Content Body */}
                <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
                  
                  {/* Price and Stock Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                        {isBn ? 'মূল্য' : 'Price'}
                      </span>
                      <div className="text-2xl font-serif font-extrabold text-[#d4af37]">
                        ৳{Number(prod.priceBDT || 0).toLocaleString('en-IN')}{isBn ? '/-' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-[#d4af37] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className={`text-xs font-mono px-3.5 py-1.5 rounded-full border ${
                        inStock 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                          : 'bg-red-950/80 text-red-300 border-red-500/40'
                      }`}>
                        {inStock ? (isBn ? `স্টকে আছে: ${prod.stock} টি` : `In Stock: ${prod.stock} units`) : (isBn ? 'স্টক শেষ' : 'Sold Out')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {desc && (
                    <div className="space-y-1">
                      <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                        {isBn ? 'পণ্যের বর্ণনা' : 'Description'}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  )}

                  {/* Specifications & Shariah Compliance Checklist */}
                  <div className="p-4 bg-[#080809] border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                      <span>{isBn ? 'বৈশিষ্ট্য ও শরীয়াহ সনদ' : 'Specifications & Shariah Certification'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {((Array.isArray(prod.specifications) && prod.specifications.length > 0) ? prod.specifications : specs.specs).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span className="font-light">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-light italic">
                      {specs.shariahNote}
                    </div>
                  </div>

                </div>

                {/* Fixed Bottom Action Bar */}
                <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0c0c0e] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs text-slate-400 font-medium">
                      {isBn ? 'পরিমাণ:' : 'Quantity:'}
                    </span>
                    <div className="flex items-center bg-[#080809] border border-slate-700 rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                        className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-white text-sm px-3">{detailQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(detailQuantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal and Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="text-right pr-2">
                      <span className="text-[10px] text-slate-400 uppercase block font-mono">
                        {isBn ? 'মোট বিনিয়োগ' : 'Total'}
                      </span>
                      <span className="text-lg font-serif font-bold text-[#d4af37]">
                        ৳{liveTotal.toLocaleString('en-IN')}{isBn ? '/-' : ''}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(prod, detailQuantity);
                        setSelectedProduct(null);
                      }}
                      disabled={!inStock}
                      className="px-4 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-slate-700 font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                      <span>{isBn ? 'ব্যাগে যোগ' : 'Add to Bag'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const p = prod;
                        const qty = detailQuantity;
                        setSelectedProduct(null);
                        onBuyNow(p, qty);
                      }}
                      disabled={!inStock}
                      className={`px-5 py-3.5 rounded-xl font-serif font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                        inStock
                          ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f2a] text-[#080809] hover:brightness-110 shadow-[#d4af37]/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isBn ? 'এখনই কিনুন' : 'Buy Now'}</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Global Footer */}
      <Footer
        locale={locale}
        onOpenConsultation={onOpenConsultation}
      />

    </div>
  );
}
