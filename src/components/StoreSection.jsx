import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sparkles, Tag, Check, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Phone, User, MapPin, 
  MessageSquare, Send, CreditCard, Star, RefreshCw, Eye, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { productsAPI, ordersAPI } from '../services/api';
import { DICTIONARY } from '../data/mockData';

export default function StoreSection({ locale = 'en', onAddToCart = null }) {
  const isBn = locale === 'bn';

  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // "See Details" Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Order / Checkout Modal State
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Lock body scroll whenever any modal is open
  useEffect(() => {
    if (selectedDetailProduct || orderingProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDetailProduct, orderingProduct]);

  const categories = [
    { id: 'all', labelEn: 'All Pilgrim Essentials', labelBn: 'সকল পণ্যসমূহ' },
    { id: 'ihram', labelEn: 'Ihram & Towels', labelBn: 'ইহরাম ও তোয়ালে' },
    { id: 'zamzam', labelEn: 'Zamzam Water', labelBn: 'জমজম পানি' },
    { id: 'dates', labelEn: 'Ajwa Dates & Relics', labelBn: 'আজওয়া খেজুর' },
    { id: 'tasbeeh', labelEn: 'Digital Counters', labelBn: 'স্মার্ট তাসবীহ' },
    { id: 'rugs', labelEn: 'Orthopedic Rugs', labelBn: 'মেমোরি ফোম জায়নামাজ' },
    { id: 'skincare', labelEn: 'Halal Skincare', labelBn: 'হালাল স্কিনকেয়ার' }
  ];

  useEffect(() => {
    setShowAllProducts(false);
    loadProducts(activeCategory);
  }, [activeCategory]);

  const loadProducts = async (cat) => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll(cat);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (product, initialQty = 1) => {
    setOrderingProduct(product);
    setOrderQuantity(initialQty);
    setOrderPlaced(false);
    setPlacedOrderId('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderingProduct) return;

    const totalBDT = (orderingProduct.priceBDT || 0) * orderQuantity;
    const totalUSD = Math.round(totalBDT / 120);

    const payload = {
      type: 'store_order',
      customerName,
      customerPhone,
      deliveryAddress,
      notes: orderNotes,
      items: [
        {
          id: orderingProduct.id,
          name: isBn ? (orderingProduct.name_bn || orderingProduct.name_en) : orderingProduct.name_en,
          quantity: orderQuantity,
          priceBDT: orderingProduct.priceBDT
        }
      ],
      totalBDT,
      totalUSD
    };

    const res = await ordersAPI.create(payload);

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#996515', '#ffffff']
    });

    setPlacedOrderId(res?.id || `ORD-${Date.now()}`);
    setOrderPlaced(true);
  };

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
          isBn ? 'সরাসরি ঢাকায় বাসায় সুরক্ষিত কোল্ড-চেইন ডেলিভারি' : 'Direct secure doorstep delivery across Dhaka metropolitan area'
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
        origin: isBn ? 'মদিনাতুল মুনাওয়ারার আল-আলিয়া বাগান' : 'Sacred Groves of Al-Aliyah, Madinah Al-Munawwarah',
        specs: [
          isBn ? '১ কেজি লাক্সারি খোদাই করা কাঠের গিফট বক্স' : '1kg Keepsake handcrafted luxury wooden gift tin',
          isBn ? 'নরম, গাঢ় কালো ও প্রাকৃতিকভাবে সংরক্ষিত খাঁটি আজওয়া' : 'Grade-A jumbo soft, plump, naturally cured Madinah Ajwa',
          isBn ? 'রাসুলুল্লাহ (সাঃ) এর হাদিস মোতাবেক বিষ ও জাদু থেকে সুরক্ষা' : 'Authentic prophetic relic recommended for morning consumption'
        ],
        shariahNote: isBn 
          ? 'রাসুলুল্লাহ (সাঃ) এর পবিত্র সুন্নত মোবারক। সকালবেলা ৭টি আজওয়া ভক্ষণের বরকত।' 
          : 'Prophetic Sunnah: Sourced directly from authenticated Madinah Al-Aliyah date farms.'
      };
    }

    return {
      origin: isBn ? 'পবিত্র হারামাইন শরিফাইন অনুমোদিত' : 'Haramain Approved Pilgrim Gear',
      specs: [
        isBn ? 'দীর্ঘ ভ্রমণের উপযোগী টেকসই ও হালকা উপাদান' : 'Ergonomic, lightweight travel design for Tawaf and Sa’i',
        isBn ? 'পবিত্র কা’বা ও মসজিদে নববীর পবিত্র আবহ' : 'Inspired by sacred Islamic geometric motifs and Kiswah craftsmanship',
        isBn ? 'প্রিমিয়াম গিফট প্যাকেজিং সহ হোম ডেলিভারি' : 'Luxury keepsake packaging with rapid dispatch in Bangladesh'
      ],
      shariahNote: isBn 
        ? 'হালাল ও শরীয়াহ সম্মত উপকরণ। ওমরাহ ও হজের সময় নির্বিঘ্ন ব্যবহারের উপযোগী।' 
        : '100% Halal certified material, ideal for spiritual tranquility during pilgrimage.'
    };
  };

  return (
    <section id="store" className="py-20 lg:py-28 bg-[#0a0a0c] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#d4af37]/35 text-[#d4af37] text-xs font-serif font-bold uppercase tracking-widest">
            <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isBn ? 'পবিত্র তীর্থযাত্রার প্রয়োজনীয় সামগ্রী' : 'Haramain Essentials & Relics'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            {isBn ? 'খাঁটি আজওয়া, জমজম ও' : 'Pilgrim Essentials &'} <span className="text-kiswah-gold">{isBn ? 'প্রিমিয়াম ইহরাম কালেকশন' : 'Sacred Lifestyle Store'}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            {isBn 
              ? 'সৌদি সার্টিফাইড সিলগালা ৫ লিটার জমজম, মদিনার প্রিমিয়াম আলিয়া আজওয়া, ১০০% সুতি মিশরীয় ইহরাম ও আধুনিক ওলেড স্মার্ট কাউন্টার সরাসরি আপনার বাসায়।' 
              : 'Certified ministry-sealed 5L Zamzam, royal Madinah Ajwa dates, seamless Egyptian cotton Ihram, and orthopedic travel prayer rugs delivered to your Dhaka residence.'}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-kiswah-gold text-[#080809] shadow-md font-bold'
                    : 'bg-white/[0.02] border border-slate-800 text-slate-400 hover:text-white hover:border-[#d4af37]/40'
                }`}
              >
                {isBn ? c.labelBn : c.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm">
            Hydrating pilgrim products from LabbaikHorizon E-Commerce API...
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(showAllProducts ? products : products.slice(0, 6)).map((prod) => {
                const name = isBn ? (prod.name_bn || prod.name_en) : (prod.name_en || prod.name_bn);
                const desc = isBn ? (prod.description_bn || prod.description_en) : (prod.description_en || prod.description_bn);
                const inStock = prod.stock > 0;

                return (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -6 }}
                    className="bg-kiswah-card rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37]/65 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group"
                  >
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden bg-slate-950">
                      <img
                        src={prod.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedDetailProduct(prod)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                          {prod.tag || 'Essential'}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-4">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          inStock 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                            : 'bg-red-950/80 text-red-300 border-red-500/40'
                        }`}>
                          {inStock ? (isBn ? `স্টক: ${prod.stock} টি` : `In Stock: ${prod.stock}`) : (isBn ? 'স্টক শেষ' : 'Sold Out')}
                        </span>
                      </div>
                    </div>

                    {/* Product Details Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[#d4af37] font-bold tracking-widest block">
                          {prod.category?.toUpperCase()}
                        </span>
                        <h3 
                          onClick={() => setSelectedDetailProduct(prod)}
                          className="text-lg font-serif font-bold text-white leading-snug hover:text-[#d4af37] transition-colors cursor-pointer"
                        >
                          {name}
                        </h3>
                        {desc && (
                          <p className="text-xs text-slate-400 font-light line-clamp-2">
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Dual Action Buttons Section */}
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                              {isBn ? 'মূল্য' : 'Investment'}
                            </span>
                            <div className="text-xl font-serif font-extrabold text-kiswah-gold">
                              ৳{prod.priceBDT?.toLocaleString('en-IN')}{' '}
                              <span className="text-xs text-slate-400 font-normal">(${prod.priceUSD} USD)</span>
                            </div>
                          </div>
                        </div>

                        {/* Side-by-side: "See Details" + "Add to Cart" */}
                        <div className="grid grid-cols-2 gap-2.5">
                          
                          {/* Clear "See Details" / "বিস্তারিত" Outline Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDetailProduct(prod);
                              setDetailQuantity(1);
                              setIsZoomed(false);
                            }}
                            className="py-2.5 px-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 hover:text-[#d4af37] border border-slate-700 hover:border-[#d4af37]/60"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{isBn ? 'বিস্তারিত' : 'See Details'}</span>
                          </button>

                          {/* "Add to Cart" / "অর্ডার করুন" Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onAddToCart) {
                                onAddToCart(prod, 1);
                              } else {
                                openOrderModal(prod);
                              }
                            }}
                            disabled={!inStock}
                            className={`py-2.5 px-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                              inStock
                                ? 'bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] hover:scale-[1.02]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isBn ? 'অর্ডার করুন' : 'Add to Cart'}</span>
                          </button>

                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Expandable Grid Toggle: "Show More Products" / "Show Less" */}
            {products.length > 6 && (
              <div className="mt-12 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAllProducts((prev) => !prev)}
                  className="px-8 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-[#d4af37]/10 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]"
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {showAllProducts
                      ? (isBn ? 'কম দেখুন' : 'Show Less Products')
                      : (isBn ? `আরও প্রোডাক্ট দেখুন (${products.length - 6}টি বাকি)` : `Show More Products (${products.length - 6} more)`)}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* 1. PRODUCT QUICK VIEW "SEE DETAILS" MODAL (FIXED PORTAL POSITIONING Z-[100]) */}
        <AnimatePresence>
          {selectedDetailProduct && (() => {
            const prod = selectedDetailProduct;
            const name = isBn ? (prod.name_bn || prod.name_en) : (prod.name_en || prod.name_bn);
            const desc = isBn ? (prod.description_bn || prod.description_en) : (prod.description_en || prod.description_bn);
            const specs = getProductSpecs(prod);
            const inStock = prod.stock > 0;
            const liveTotal = (prod.priceBDT || 0) * detailQuantity;

            return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans">
                
                {/* Backdrop Click Dismiss */}
                <div 
                  className="absolute inset-0" 
                  onClick={() => setSelectedDetailProduct(null)} 
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-[#121215] border border-[#d4af37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] z-10 kiswah-gold-glow selection:bg-[#d4af37] selection:text-[#080809]"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedDetailProduct(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800 z-20"
                    aria-label="Close product details"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-6">
                    
                    {/* Image with Interactive Zoom Preview */}
                    <div 
                      className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-zoom-in group"
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      <img
                        src={prod.image}
                        alt={name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isZoomed ? 'scale-150' : 'group-hover:scale-105'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                          {prod.tag || 'Essential'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-[#d4af37]/30 font-mono text-[10px] uppercase tracking-wider">
                          {prod.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="flex items-center gap-1 text-[#d4af37]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{specs.origin}</span>
                        </span>
                        <span className="text-slate-400 text-[10px] font-mono">
                          {isZoomed ? (isBn ? 'স্বাভাবিক দেখতে ক্লিক করুন' : 'Click to unzoom') : (isBn ? 'বড় করে দেখতে ক্লিক করুন' : 'Click to zoom')}
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Pricing */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                          {name}
                        </h3>
                        <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                          inStock 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                            : 'bg-red-950/80 text-red-300 border-red-500/40'
                        }`}>
                          {inStock ? (isBn ? `স্টকে আছে: ${prod.stock} টি` : `In Stock (${prod.stock} units)`) : (isBn ? 'স্টক শেষ' : 'Sold Out')}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-serif font-extrabold text-kiswah-gold">
                          ৳{prod.priceBDT?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          (${prod.priceUSD} USD / unit)
                        </span>
                      </div>

                      {desc && (
                        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pt-1">
                          {desc}
                        </p>
                      )}
                    </div>

                    {/* Specifications List */}
                    <div className="bg-[#080809] p-4 rounded-2xl border border-slate-800 space-y-2.5">
                      <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-wider block">
                        {isBn ? 'পণ্যটির বিশদ বিবরণ ও বৈশিষ্ট্য' : 'Key Specifications & Inclusions'}
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {specs.specs.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Shariah Compliance Verification Note */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-serif font-bold text-emerald-300 uppercase tracking-wide block">
                          {isBn ? '১০০% শরীয়াহ ও হালাল সার্টিফাইড' : '100% Shariah Compliant Verification'}
                        </span>
                        <p className="text-xs text-slate-300 font-light mt-0.5">
                          {specs.shariahNote}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Instant Order CTA */}
                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Counter */}
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
                        <div className="text-right sm:hidden">
                          <span className="text-xs font-serif font-bold text-kiswah-gold">
                            ৳{liveTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Modal CTA Buttons */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="text-right hidden sm:block pr-2">
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">
                            {isBn ? 'মোট বিনিয়োগ' : 'Total'}
                          </span>
                          <span className="text-lg font-serif font-bold text-kiswah-gold">
                            ৳{liveTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const p = selectedDetailProduct;
                            const qty = detailQuantity;
                            setSelectedDetailProduct(null);
                            if (onAddToCart) {
                              onAddToCart(p, qty);
                            } else {
                              openOrderModal(p, qty);
                            }
                          }}
                          disabled={!inStock}
                          className="w-full sm:w-auto px-6 py-3.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{isBn ? 'এখনই অর্ডার করুন' : 'Proceed to Checkout'}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* 2. ORDER / CHECKOUT MODAL (FIXED PORTAL POSITIONING Z-[100]) */}
        <AnimatePresence>
          {orderingProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans">
              
              {/* Backdrop */}
              <div 
                className="absolute inset-0" 
                onClick={() => setOrderingProduct(null)} 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-[#121215] border border-[#d4af37]/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-y-auto max-h-[90vh] z-10 kiswah-gold-glow selection:bg-[#d4af37] selection:text-[#080809]"
              >
                <button
                  type="button"
                  onClick={() => setOrderingProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white cursor-pointer border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                {orderPlaced ? (
                  <div className="text-center space-y-5 py-6">
                    <div className="w-16 h-16 bg-[#d4af37]/15 border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      {isBn ? 'অর্ডার সফলভাবে গৃহীত হয়েছে!' : 'Order Placed Successfully!'}
                    </h3>
                    <div className="bg-[#080809] p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                      Order Ref: <strong className="text-amber-300">{placedOrderId}</strong>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto font-light">
                      {isBn 
                        ? 'জাজাকআল্লাহ খাইরান। আমাদের ডেলিভারি টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে এবং ঢাকায় নিজ বাসায় সিলগালা ডেলিভারি নিশ্চিত করবে।' 
                        : 'JazakAllah Khair. Our dispatch concierge will contact your phone to confirm prompt delivery to your Dhaka address.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOrderingProduct(null)}
                      className="px-8 py-3 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                    >
                      {isBn ? 'উইন্ডো বন্ধ করুন' : 'Close Window'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                    <div className="flex items-center gap-3 border-b border-[#d4af37]/20 pb-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white">
                          {isBn ? (orderingProduct.name_bn || orderingProduct.name_en) : orderingProduct.name_en}
                        </h3>
                        <p className="text-xs text-amber-300 font-mono">
                          ৳{orderingProduct.priceBDT?.toLocaleString('en-IN')} BDT (${orderingProduct.priceUSD} USD) / unit
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Live Total */}
                    <div className="bg-[#080809] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block font-medium">
                          {isBn ? 'পরিমাণ (পিস):' : 'Quantity (Pieces):'}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                            className="w-7 h-7 rounded bg-[#121214] border border-slate-700 text-amber-300 font-bold hover:text-white"
                          >-</button>
                          <span className="font-mono font-bold text-white text-base px-2">{orderQuantity}</span>
                          <button
                            type="button"
                            onClick={() => setOrderQuantity(orderQuantity + 1)}
                            className="w-7 h-7 rounded bg-[#121214] border border-slate-700 text-amber-300 font-bold hover:text-white"
                          >+</button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 block font-medium">
                          {isBn ? 'মোট বিনিয়োগ:' : 'Total Investment:'}
                        </span>
                        <span className="text-lg font-serif font-bold text-kiswah-gold">
                          ৳{((orderingProduct.priceBDT || 0) * orderQuantity).toLocaleString('en-IN')} BDT
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-200 font-semibold mb-1 block">
                        {isBn ? 'পূর্ণ নাম *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Al-Haj Syful Islam Chowdhury"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-semibold mb-1 block">
                        {isBn ? 'ফোন / হোয়াটসঅ্যাপ (+৮৮০) *' : 'Phone / WhatsApp (+880) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01711-XXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-semibold mb-1 block">
                        {isBn ? 'ডেলিভারি ঠিকানা (ঢাকা / বাংলাদেশ) *' : 'Delivery Residence Address (Dhaka / Bangladesh) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. House 14, Road 72, Gulshan-2, Dhaka"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-semibold mb-1 block">
                        {isBn ? 'বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)' : 'Special Packaging / Delivery Instructions (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Please deliver in wooden gift box before Friday"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderingProduct(null)}
                        className="px-4 py-2.5 border border-slate-800 rounded-xl text-slate-400 hover:text-white"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isBn ? 'অর্ডার নিশ্চিত করুন' : 'Confirm & Place Order'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
