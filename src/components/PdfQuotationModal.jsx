import React from 'react';
import { X, Printer, Download, ShieldCheck, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PdfQuotationModal({ data, onClose }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-300">Instant PDF Quotation Preview</span>
            <span className="text-xs text-slate-400 font-medium">Ref: NAH-QT-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:from-amber-400 hover:to-amber-500 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-100 bg-slate-900 print-card">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-amber-500/20 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif">🕋</span>
                <div>
                  <h1 className="text-xl font-serif font-bold text-amber-400 uppercase tracking-tight">
                    Noor Al Haramain Travels & Tours
                  </h1>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Dhaka, Bangladesh • Government Approved Hajj & Umrah Agency
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                MoRA Reg No: <strong className="text-white">HAAB-1420</strong> | ATAB License: <strong className="text-white">09823</strong>
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="px-3 py-1 bg-emerald-950 border border-amber-500/30 text-amber-300 font-bold rounded-full inline-block mb-1">
                OFFICIAL QUOTATION
              </span>
              <p className="text-slate-400">Date: {data.date}</p>
              <p className="text-slate-400">Valid for: 7 Days</p>
            </div>
          </div>

          {/* Customer & Trip Overview Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">Trip Category & Season</span>
              <span className="font-bold text-amber-300 text-sm">{data.season}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Departure Airport & Airline</span>
              <span className="font-bold text-white text-sm">{data.departureCity} • {data.airlineType === 'direct' ? 'Direct Flight' : 'Transit'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Passanger Group</span>
              <span className="font-bold text-white">{data.adults} Adults, {data.children} Children, {data.infants} Infants ({data.occupancy})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Selected Makkah Hotel</span>
              <span className="font-bold text-white">{data.makkahHotel}</span>
            </div>
          </div>

          {/* Selected Add-ons List */}
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Selected Inclusions & Add-ons
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Saudi e-Visa & Comprehensive Medical Insurance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Rawdah Sharif Nusuk Permit Assistance</span>
              </div>
              {data.selectedAddons && data.selectedAddons.map((addon, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{addon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-amber-300 border-b border-slate-800 font-bold">
                <tr>
                  <th className="p-3">Cost Item</th>
                  <th className="p-3 text-right">Per Person (BDT)</th>
                  <th className="p-3 text-right">Total Group (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-3">All-Inclusive Sacred Pilgrimage Package</td>
                  <td className="p-3 text-right font-bold text-amber-400">৳{data.perPersonBDT.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-bold text-amber-400">৳{data.totalGroupBDT.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-950/60 font-semibold">
                  <td className="p-3 text-slate-400">Equivalent USD Estimate</td>
                  <td className="p-3 text-right text-emerald-300">${data.perPersonUSD} USD</td>
                  <td className="p-3 text-right text-emerald-300">${data.totalGroupUSD} USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 0% EMI Installment Note */}
          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/80 text-xs space-y-1">
            <span className="font-bold text-amber-300 block">Bank EMI Installment Options Available:</span>
            <p className="text-slate-300">
              6 Months EMI: <strong>৳{data.emi6Months.toLocaleString('en-IN')} / month</strong> | 12 Months EMI: <strong>৳{data.emi12Months.toLocaleString('en-IN')} / month</strong>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Accepted Banks: City Bank (Amex), BRAC Bank, Islami Bank Bangladesh, DBBL, EBL.
            </p>
          </div>

          {/* Footer Signature & Contact */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-4 text-[11px] text-slate-400">
            <div>
              <p className="font-bold text-white">Noor Al Haramain Travels & Tours Dhaka</p>
              <p>Corporate HQ: Baitul Mukarram Commercial Complex (6th Floor), Motijheel, Dhaka-1000</p>
              <p>Hotline: +880 1700-000000 | Email: info@nooralharamain.com.bd</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-32 h-10 border-b border-amber-400/40 mx-auto sm:ml-auto mb-1 flex items-center justify-center font-serif text-amber-400 italic text-xs">
                Authorized Officer
              </div>
              <span>Authorized Signature & Seal</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
