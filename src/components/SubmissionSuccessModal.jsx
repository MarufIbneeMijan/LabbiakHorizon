import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Sparkles, MessageSquare, ExternalLink, 
  Home, ShoppingBag, ArrowRight, Compass, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function SubmissionSuccessModal({
  isOpen = false,
  onClose = () => {},
  locale = 'bn',
  type = 'order', // 'order' | 'reservation'
  orderRef = '',
  customerName = '',
  totalBDT = 0,
  waUrl = ''
}) {
  const navigate = useNavigate();
  const isBn = locale === 'bn';
  const isOrder = type === 'order';

  // Trigger celebratory gold confetti explosion whenever opened
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#d4af37', '#e5c158', '#ffd700', '#10b981', '#ffffff']
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Persistent Backdrop - Outside clicks intentionally locked down to prevent auto-close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#080809]/92 backdrop-blur-2xl transition-opacity pointer-events-auto"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#101013] border border-[#d4af37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-hidden z-10 my-auto text-center space-y-6 kiswah-gold-glow"
        >
          {/* Top Close Button (Explicit Click Only) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close confirmation modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Celebratory Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-10 h-10 text-[#d4af37]" />
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {isOrder 
                ? (isBn ? 'অর্ডার সফলভাবে প্রাপ্ত হয়েছে' : 'Order Successfully Received')
                : (isBn ? 'সংরক্ষণ সফলভাবে নিশ্চিত' : 'VIP Reservation Received')}
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight">
              {isBn ? 'জাজাকআল্লাহ খাইরান!' : 'JazakAllah Khair!'}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
              {isOrder
                ? (isBn 
                    ? 'আপনার পবিত্র সফর সরঞ্জাম ও রিলিক্সের অর্ডারটি আমাদের ডেলিভারি টিম রেকর্ড করেছে। দ্রুততম সময়ে ডেলিভারি সম্পন্ন করতে আমাদের প্রতিনিধি আপনার সাথে ফোনে যোগাযোগ করবেন।' 
                    : 'Your order for Shariah-compliant relics and pilgrim essentials has been recorded. Our dispatch concierge will contact you shortly to confirm delivery.')
                : (isBn
                    ? 'আপনার ভিআইপি তীর্থযাত্রা ও রিজার্ভেশনের আবেদন সফলভাবে সম্পন্ন হয়েছে। আমাদের প্রাইভেট ক্লায়েন্ট ডিরেক্টর সরাসরি আপনার সাথে যোগাযোগ করবেন।'
                    : 'Your VIP sacred dossier and reservation inquiry have been received. A dedicated Private Client Director will contact you directly to confirm itinerary details.')}
            </p>
          </div>

          {/* Order Details Reference Box */}
          <div className="bg-[#080809] border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
            {orderRef && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-mono text-[11px]">
                  {isBn ? 'রেফারেন্স আইডি:' : 'Reference ID:'}
                </span>
                <span className="font-mono font-bold text-[#d4af37]">{orderRef}</span>
              </div>
            )}
            {customerName && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">{isBn ? 'গ্রাহকের নাম:' : 'Client Name:'}</span>
                <span className="text-white font-medium">{customerName}</span>
              </div>
            )}
            {Number(totalBDT) > 0 && (
              <div className="flex justify-between items-center pt-1 font-serif text-sm">
                <span className="text-white font-bold">{isBn ? 'সর্বমোট মূল্য:' : 'Total Value:'}</span>
                <span className="text-[#d4af37] font-extrabold text-base">
                  ৳{Number(totalBDT).toLocaleString('en-IN')}{isBn ? '/-' : ''}
                </span>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Connect Button */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isBn ? 'হোয়াটসঅ্যাপে তাৎক্ষণিক কনফার্ম করুন' : 'Confirm Instantly on WhatsApp'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Explicit Navigation Decision Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Go to Home Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-3 px-4 rounded-xl border border-slate-700 hover:border-[#d4af37]/60 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 hover:text-white font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Home className="w-4 h-4 text-[#d4af37]" />
              <span>{isBn ? 'হোম পেজে যান' : 'Go to Home'}</span>
            </button>

            {/* Explore Shop / Explore Other Packages Button */}
            {isOrder ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  navigate('/shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f2a] text-[#080809] hover:brightness-110 font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#080809]" />
                <span>{isBn ? 'আরও কেনাকাটা করুন' : 'Explore Shop'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#080809]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  navigate('/');
                  const pkgElem = document.getElementById('packages');
                  if (pkgElem) {
                    pkgElem.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f2a] text-[#080809] hover:brightness-110 font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#080809]" />
                <span>{isBn ? 'অন্যান্য প্যাকেজ দেখুন' : 'Explore Other Packages'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#080809]" />
              </button>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}