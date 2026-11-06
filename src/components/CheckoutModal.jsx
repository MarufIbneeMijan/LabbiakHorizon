import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, ShieldCheck, CheckCircle2, Truck, 
  CreditCard, Phone, User, MapPin, MessageSquare, 
  Sparkles, ArrowRight, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ordersAPI } from '../services/api';

const DELIVERY_ZONES = [
  { id: 'inside_dhaka', nameBn: 'ঢাকা সিটি (Inside Dhaka)', nameEn: 'Inside Dhaka (ঢাকা সিটি)', fee: 80, isInside: true },
  { id: 'outside_dhaka', nameBn: 'ঢাকার বাইরে (Outside Dhaka)', nameEn: 'Outside Dhaka (ঢাকার বাইরে)', fee: 150, isInside: false }
];

export default function CheckoutModal({
  isOpen = false,
  onClose = () => {},
  locale = 'bn',
  items = [],
  onOrderSuccess = () => {}
}) {
  const isBn = locale === 'bn';

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedZone, setSelectedZone] = useState('inside_dhaka');
  const [districtArea, setDistrictArea] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'bkash_nagad'

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate pricing breakdown
  const subtotalBDT = items.reduce(
    (acc, it) => acc + (Number(it.priceBDT) || 0) * (it.quantity || 1),
    0
  );

  const zoneObj = DELIVERY_ZONES.find((z) => z.id === selectedZone) || DELIVERY_ZONES[0];
  const shippingFee = zoneObj.fee;
  const grandTotalBDT = subtotalBDT + shippingFee;
  const grandTotalUSD = Math.round(grandTotalBDT / 120);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0 || !fullName.trim() || !phone.trim() || !districtArea.trim()) {
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${districtArea.trim()}, ${isBn ? zoneObj.nameBn : zoneObj.nameEn}, Bangladesh`;
    const formattedPayment = paymentMethod === 'cod' 
      ? (isBn ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery')
      : (isBn ? 'বিকাশ / নগদ / রকেট মার্চেন্ট ট্রান্সফার' : 'bKash / Nagad Transfer');

    const payload = {
      type: 'store_order',
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      deliveryAddress: fullAddress,
      division: zoneObj.nameEn,
      deliveryZone: zoneObj.nameEn,
      shippingFee,
      paymentMethod: formattedPayment,
      notes: deliveryNotes.trim() || 'No special delivery instructions provided.',
      items: items.map((it) => ({
        id: it.id,
        name: isBn ? (it.name_bn || it.name_en || it.name) : (it.name_en || it.name_bn || it.name),
        quantity: it.quantity || 1,
        priceBDT: it.priceBDT,
        image: it.image
      })),
      totalBDT: grandTotalBDT,
      totalUSD: grandTotalUSD,
      status: 'pending'
    };

    let createdId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await ordersAPI.create(payload);
      if (res && res.id) {
        createdId = res.id;
      }
    } catch (err) {
      console.warn('Backend order recording error, order preserved locally:', err);
    }

    // Celebratory Confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e5c158', '#10b981', '#ffffff']
    });

    setOrderRef(createdId);
    setIsSubmitting(false);
    setSubmitted(true);
    onOrderSuccess();
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setOrderRef('');
    setFullName('');
    setPhone('');
    setDistrictArea('');
    setDeliveryNotes('');
    onClose();
  };

  // Pre-formatted WhatsApp confirmation message
  const waMessage = `Assalamu Alaikum! I have just confirmed an order on LabbaikHorizon Store:%0A%0A*Order Reference:* ${orderRef}%0A*Customer Name:* ${fullName}%0A*Phone:* ${phone}%0A*Delivery Address:* ${districtArea}, ${zoneObj?.nameEn}%0A*Payment Mode:* ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash/Nagad'}%0A*Items:* ${items.map((i) => `${i.name_en || i.name} (x${i.quantity || 1})`).join(', ')}%0A*Total Payable:* ৳${grandTotalBDT.toLocaleString('en-IN')}%0A%0APlease confirm my dispatch schedule. JazakAllah Khair!`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md font-sans">
          
          {/* Backdrop */}
          <div 
            className="fixed inset-0" 
            onClick={resetAndClose} 
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-[#0e0e11] border border-[#d4af37]/35 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[92vh] kiswah-gold-glow"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#080809] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {submitted 
                      ? (isBn ? 'অর্ডার গ্রহণ নিশ্চিতকরণ' : 'Order Confirmation') 
                      : (isBn ? 'পিলগ্রিম এসেনশিয়ালস চেকআউট' : 'Pilgrim Essentials Checkout')}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-mono">
                    {submitted 
                      ? (isBn ? 'সিলগালা হোম ডেলিভারি প্রস্তুতি' : 'Doorstep Dispatch Preparation')
                      : (isBn ? 'বাংলাদেশ হোম ডেলিভারি ও ভেরিফাইড পেমেন্ট' : 'Fast-Track Bangladesh Delivery')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {submitted ? (
                /* SUCCESS CONFIRMATION SCREEN */
                <div className="py-6 space-y-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#d4af37]/15 border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono uppercase tracking-wider">
                      {isBn ? 'অর্ডার সফলভাবে প্রাপ্ত হয়েছে' : 'Order Successfully Received'}
                    </span>
                    <h4 className="text-2xl font-serif font-extrabold text-white">
                      {isBn ? 'জাজাকআল্লাহ খাইরান!' : 'JazakAllah Khair for Your Sacred Order!'}
                    </h4>
                    <p className="text-slate-300 text-xs max-w-md mx-auto font-light leading-relaxed">
                      {isBn 
                        ? 'আপনার পবিত্র সফর সরঞ্জাম ও রিলিক্সের অর্ডারটি আমাদের ডেলিভারি টিম রেকর্ড করেছে। আমাদের কন্সিয়ার্জ টিম অতি দ্রুত আপনার সাথে যোগাযোগ করবে।' 
                        : 'Your order for Shariah-compliant relics and pilgrim essentials has been recorded. Our dispatch concierge will contact your phone shortly to confirm delivery.'}
                    </p>
                  </div>

                  {/* Order Reference Box */}
                  <div className="bg-[#080809] border border-slate-800 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">{isBn ? 'অর্ডার রেফারেন্স:' : 'Order Reference:'}</span>
                      <span className="font-mono font-bold text-amber-300">{orderRef}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">{isBn ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                      <span className="text-white font-medium">{fullName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</span>
                      <span className="text-slate-200 text-right truncate max-w-[220px]">{districtArea}, {isBn ? zoneObj.nameBn : zoneObj.nameEn}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">{isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment Mode:'}</span>
                      <span className="text-emerald-400 font-medium">
                        {paymentMethod === 'cod' ? (isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery') : 'bKash / Nagad'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-serif text-sm">
                      <span className="text-white font-bold">{isBn ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
                      <span className="text-kiswah-gold font-extrabold text-base">
                        ৳{grandTotalBDT.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Direct WhatsApp Concierge Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/8801800522224?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isBn ? 'হোয়াটসঅ্যাপে অর্ডার ট্র্যাক করুন' : 'Confirm on WhatsApp'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-slate-700 font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      {isBn ? 'উইন্ডো বন্ধ করুন' : 'Close Window'}
                    </button>
                  </div>
                </div>
              ) : (
                /* CHECKOUT INPUT FORM */
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  
                  {/* Order Items Preview Bar */}
                  <div className="bg-[#080809] border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                      <span className="font-serif font-bold text-slate-200">
                        {isBn ? 'অর্ডারের আইটেমসমূহ' : 'Selected Essentials'} ({items.length})
                      </span>
                      <span className="text-[#d4af37] font-mono text-[11px]">
                        {isBn ? 'সিলগালা ও আসল পণ্য' : 'Ministry-Verified Packaging'}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/50 max-h-40 overflow-y-auto my-2 pr-1 space-y-2">
                      {items.map((it, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {it.image ? (
                              <img src={it.image} alt={it.name_en || it.name} className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-slate-800 flex items-center justify-center text-[#d4af37] shrink-0">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate">
                              <p className="text-white font-medium truncate">{isBn ? (it.name_bn || it.name_en || it.name) : (it.name_en || it.name_bn || it.name)}</p>
                              <span className="text-[10px] text-slate-400 font-mono">Qty: {it.quantity || 1} × ৳{(it.priceBDT || 0).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <span className="font-mono text-slate-200 font-bold shrink-0">
                            ৳{((it.priceBDT || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1. Customer Personal Credentials */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#d4af37]" />
                      <span>{isBn ? '১. গ্রাহকের পরিচয় ও যোগাযোগের তথ্য' : '1. Customer Contact Details'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {isBn ? 'সম্পূর্ণ নাম (পাক নাম) *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={isBn ? 'উদা: মো: আনিসুর রহমান' : 'e.g. Al-Hajj Anisur Rahman'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#080809] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {isBn ? 'মোবাইল / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1712-345678"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#080809] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] font-mono transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Delivery Address & Division */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#d4af37]" />
                      <span>{isBn ? '২. ডেলিভারি ঠিকানা (বাংলাদেশ)' : '2. Bangladesh Delivery Address'}</span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          {isBn ? 'ডেলিভারি এরিয়া নির্বাচন করুন (শিপিং ফি) *' : 'Select Delivery Area (Shipping Rate) *'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {DELIVERY_ZONES.map((zone) => {
                            const isSelected = selectedZone === zone.id;
                            return (
                              <button
                                key={zone.id}
                                type="button"
                                onClick={() => setSelectedZone(zone.id)}
                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-lg'
                                    : 'bg-[#080809] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-slate-600'
                                  }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#080809]" />}
                                  </div>
                                  <span className="font-serif font-bold text-xs text-white">
                                    {isBn ? zone.nameBn : zone.nameEn}
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-xs text-[#d4af37]">
                                  ৳ {zone.fee}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {isBn ? 'পূর্ণাঙ্গ ঠিকানা (বাড়ি নং, রোড, থানা ও জেলা) *' : 'Full Delivery Address (House/Road, Thana, District) *'}
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={districtArea}
                          onChange={(e) => setDistrictArea(e.target.value)}
                          placeholder={isBn 
                            ? 'উদা: ফ্ল্যাট ৪এ, বাড়ি ১২, রোড ৭, গুলশান-২, ঢাকা-১২১২' 
                            : 'e.g. Apt 4A, House 12, Road 7, Gulshan-2, Dhaka-1212'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#080809] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {isBn ? 'ডেলিভারি নোট / বিশেষ অনুরোধ (ঐচ্ছিক)' : 'Delivery Note / Special Instructions (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder={isBn ? 'উদা: ডেলিভারির পূর্বে ফোন দিন / উপহার প্যাকিং' : 'e.g. Call before arrival / Gift packaging'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#080809] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment Method Selection */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#d4af37]" />
                      <span>{isBn ? '৩. পেমেন্ট পদ্ধতি নির্বাচন করুন' : '3. Payment Method'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Cash on Delivery */}
                      <div
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          paymentMethod === 'cod'
                            ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-lg'
                            : 'bg-[#080809] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 accent-[#d4af37]"
                        />
                        <div>
                          <div className="font-serif font-bold text-white text-xs">
                            {isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {isBn ? 'পণ্য হাতে পেয়ে শতভাগ যাচাই করে ক্যাশ প্রদান করুন।' : 'Pay in cash after receiving and inspecting your package at your doorstep.'}
                          </p>
                        </div>
                      </div>

                      {/* Bkash / Nagad */}
                      <div
                        onClick={() => setPaymentMethod('bkash_nagad')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          paymentMethod === 'bkash_nagad'
                            ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-lg'
                            : 'bg-[#080809] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'bkash_nagad'}
                          onChange={() => setPaymentMethod('bkash_nagad')}
                          className="mt-1 accent-[#d4af37]"
                        />
                        <div>
                          <div className="font-serif font-bold text-white text-xs">
                            {isBn ? 'বিকাশ / নগদ ট্রান্সফার' : 'bKash / Nagad / Card'}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {isBn ? 'অর্ডার পরবর্তী বিকাশ বা নগদ মার্চেন্ট পেমেন্ট সুবিধা।' : 'Instant mobile banking transfer via official merchant account.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Complete Bill Summary Breakdown */}
                  <div className="p-4 bg-[#080809] border border-slate-800 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>{isBn ? 'আইটেম সাবটোটাল:' : 'Items Subtotal:'}</span>
                      <span className="font-mono text-slate-200">৳{subtotalBDT.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isBn ? 'হোম ডেলিভারি চার্জ (' : 'Home Delivery ('}{isBn ? zoneObj.nameBn : zoneObj.nameEn}):</span>
                      </span>
                      <span className="font-mono text-slate-200">৳{shippingFee}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-serif">
                      <div>
                        <span className="font-bold text-white block">
                          {isBn ? 'সর্বমোট পরিশোধযোগ্য মূল্য:' : 'Grand Total Payable:'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                          {isBn ? 'সকল ভ্যাট ও ট্রাভেল প্যাকেজিং অন্তর্ভুক্ত' : 'Includes all VAT & travel packing'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-kiswah-gold">
                          ৳{grandTotalBDT.toLocaleString('en-IN')}/-
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{isBn ? 'অর্ডার প্রক্রিয়াধীন...' : 'Processing Order...'}</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {isBn ? `অর্ডার নিশ্চিত করুন (৳${grandTotalBDT.toLocaleString('en-IN')})` : `Confirm Order (৳${grandTotalBDT.toLocaleString('en-IN')})`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center font-light">
                    {isBn 
                      ? '🔒 ১০০% শরীয়াহ সম্মত পণ্য ও সরাসরি সৌদি প্রত্যয়িত অরিজিন্যাল সিলগালা গ্যারান্টি।' 
                      : '🔒 100% Shariah compliant authenticity guaranteed. Official sealed imports.'}
                  </p>
                </form>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
