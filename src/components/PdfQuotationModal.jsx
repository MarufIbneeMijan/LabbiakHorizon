import React from 'react';
import { X, Printer, Download, ShieldCheck, Phone, MapPin, CheckCircle2, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PdfQuotationModal({ data, onClose }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080809]/85 backdrop-blur-xl overflow-y-auto font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121214] border border-[#d4af37]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto kiswah-gold-glow"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#050505] p-4 border-b border-[#d4af37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
              LabbaikHorizon Official PDF Quotation Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-kiswah-gold-hover transition-colors"
            >
              <Printer className="w-4 h-4 text-[#080809]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-100 bg-[#121214] print-card">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-[#d4af37]/30 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-serif">🕋</span>
                <div>
                  <h1 className="text-xl font-serif font-bold text-kiswah-gold uppercase tracking-widest">
                    LABBAIK HORIZON
                  </h1>
                  <p className="text-[11px] text-amber-300 font-mono">
                    Ultra-Luxury Kiswah Pilgrimage Concierge • Gulshan-2, Dhaka
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                MoRA Certified: <strong className="text-white">HAAB-1420</strong> | ATAB License: <strong className="text-white">09823</strong>
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <span className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/40 text-amber-300 font-serif font-bold text-[10px] uppercase tracking-widest rounded-full inline-block">
                OFFICIAL QUOTATION
              </span>
              <p className="text-slate-400">Date: {data.date}</p>
              <p className="text-slate-400">Ref: LBH-QT-2026-{Math.floor(1000 + Math.random() * 9000)}</p>
              <p className="text-amber-400 font-medium">Valid for: 7 Days</p>
            </div>
          </div>

          {/* Customer & Trip Overview Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-2xl border border-[#d4af37]/20">
            <div>
              <span className="text-slate-400 block font-medium">Pilgrim Lead Name:</span>
              <span className="font-bold text-white text-sm">{data.leadName || 'Distinguished Pilgrim'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Contact Phone:</span>
              <span className="font-bold text-amber-300 font-mono text-sm">{data.leadPhone || '+880 1700-000000'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Trip Scope & Season:</span>
              <span className="font-bold text-white">{data.tripType} ({data.season})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Flight Carrier & Group:</span>
              <span className="font-bold text-white">{data.airlineType || 'SAUDIA'} • {data.adults} Adults, {data.children} Children, {data.infants} Infants</span>
            </div>
          </div>

          {/* Selected Accommodations & Logistics */}
          <div className="bg-white/[0.01] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest block">
              Sanctuary Accommodations & Logistics Overview
            </span>
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-400 block">Makkah Hotel:</span>
                <span className="font-bold text-white">{data.makkahHotel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Madinah Hotel:</span>
                <span className="font-bold text-white">{data.madinahHotel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Private Fleet Vehicle:</span>
                <span className="font-bold text-white">{data.vehicle}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Suite Occupancy:</span>
                <span className="font-bold text-white">{data.occupancy}</span>
              </div>
            </div>
          </div>

          {/* Selected Add-ons List */}
          <div>
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest block mb-2">
              White-Glove Privileges & Inclusions
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-white/[0.01] p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Saudi e-Visa & Comprehensive Medical Insurance (৳28,000 / person)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Rawdah Sharif Nusuk Priority Permit Assistance</span>
              </div>
              {data.selectedAddons && data.selectedAddons.map((addon, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{addon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Price Breakdown Table */}
          <div className="border border-[#d4af37]/30 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#080809] text-amber-300 font-serif font-bold border-b border-[#d4af37]/30">
                <tr>
                  <th className="p-3">Cost Item</th>
                  <th className="p-3 text-right">Per Person (BDT)</th>
                  <th className="p-3 text-right">Grand Total (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-3 font-medium">Bespoke Sacred Pilgrimage Package Total</td>
                  <td className="p-3 text-right font-bold text-kiswah-gold">৳{data.perPersonBDT.toLocaleString('en-IN')}/-</td>
                  <td className="p-3 text-right font-bold text-kiswah-gold">৳{data.totalGroupBDT.toLocaleString('en-IN')}/-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bank EMI Installment Options */}
          <div className="bg-[#080809] p-4 rounded-xl border border-[#d4af37]/20 text-xs space-y-1">
            <span className="font-serif font-bold text-amber-300 block uppercase tracking-wider">0% Interest Bank EMI Installments</span>
            <p className="text-slate-300">
              6 Months: <strong>৳{Math.round(data.totalGroupBDT / 6).toLocaleString('en-IN')} / mo</strong> | 12 Months: <strong>৳{Math.round(data.totalGroupBDT / 12).toLocaleString('en-IN')} / mo</strong>
            </p>
            <p className="text-[10px] text-slate-400 pt-1">
              Accepted Cards: City Bank Amex, BRAC Bank, Eastern Bank, DBBL, Islami Bank Bangladesh.
            </p>
          </div>

          {/* Footer Signature & Contact */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-4 text-[11px] text-slate-400">
            <div>
              <p className="font-serif font-bold text-white text-sm">LabbaikHorizon Concierge</p>
              <p>Level 6, Horizon Tower, Gulshan-2, Dhaka-1212, Bangladesh</p>
              <p>VIP Hotline: +880 1800-LABBAIK | Email: vip@labbaikhorizon.com</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-36 h-10 border-b border-[#d4af37]/40 mx-auto sm:ml-auto mb-1 flex items-center justify-center font-serif text-amber-300 italic text-xs">
                Private Client Director
              </div>
              <span className="text-[10px]">Authorized Signature & Official Seal</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
