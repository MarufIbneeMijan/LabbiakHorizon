import React, { useEffect } from 'react';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, 
  ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({
  isOpen,
  onClose,
  locale = 'bn',
  cartItems = [],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onProceedToCheckout = () => {},
  onExploreStore = () => {}
}) {
  const isBn = locale === 'bn';

  // Prevent background scroll when drawer is open
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

  const totalBDT = cartItems.reduce((acc, item) => acc + (item.priceBDT || 0) * (item.quantity || 1), 0);
  const totalUSD = Math.round(totalBDT / 120);
  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md bg-[#0e0e11] border-l border-[#d4af37]/30 shadow-2xl h-full flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#080809]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {isBn ? 'আপনার শপিং ব্যাগ' : 'Pilgrim Essentials Cart'}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-mono">
                    {totalCount} {isBn ? 'টি আইটেম যুক্ত হয়েছে' : (totalCount === 1 ? 'item selected' : 'items selected')}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-slate-800 flex items-center justify-center text-slate-600">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold text-white">
                      {isBn ? 'আপনার ব্যাগ খালি' : 'Your Bag is Currently Empty'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs font-light">
                      {isBn 
                        ? 'মক্কার জমজম, আলিয়া আজওয়া খেজুর ও প্রিমিয়াম ইহরাম কালেকশন দেখতে আমাদের স্টোরে যান।' 
                        : 'Explore certified 5L Zamzam, royal Madinah Ajwa dates, and luxury Egyptian cotton Ihram.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onExploreStore();
                    }}
                    className="px-6 py-3 rounded-xl bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider hover:bg-kiswah-gold-hover transition-all cursor-pointer shadow-lg"
                  >
                    {isBn ? 'পিলগ্রিম শপ দেখুন' : 'Explore Pilgrim Store'}
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemName = isBn ? (item.name_bn || item.name_en || item.name) : (item.name_en || item.name_bn || item.name);
                  const itemPrice = item.priceBDT || 0;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-slate-800 flex items-center gap-3.5 group hover:border-[#d4af37]/40 transition-colors"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={itemName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-800"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif font-semibold text-white truncate">
                          {itemName}
                        </h4>
                        <div className="text-xs font-serif font-bold text-kiswah-gold mt-0.5">
                          ৳{(itemPrice * (item.quantity || 1)).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-slate-500 font-normal">
                            (৳{itemPrice.toLocaleString('en-IN')} each)
                          </span>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center bg-[#080809] border border-slate-800 rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-white">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            aria-label="Remove item"
                            title={isBn ? 'মুছে ফেলুন' : 'Remove item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer with Summary & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#080809] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{isBn ? 'আইটেম মোট' : 'Subtotal'}</span>
                    <span className="text-slate-200 font-mono">৳{totalBDT.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ঢাকা রেসিডেন্স ডেলিভারি' : 'Dhaka Residence Delivery'}</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">{isBn ? 'ফ্রি VIP সার্ভিস' : 'Free VIP Delivery'}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-white">
                      {isBn ? 'সর্বমোট বিনিয়োগ' : 'Total Investment'}
                    </span>
                    <div className="text-right">
                      <div className="font-serif font-extrabold text-lg text-kiswah-gold">
                        ৳{totalBDT.toLocaleString('en-IN')}/-
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout(cartItems, totalBDT);
                  }}
                  className="w-full py-3.5 rounded-xl bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isBn ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
