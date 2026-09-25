import React, { useState } from 'react';
import { 
  ShieldCheck, Smartphone, CheckSquare, Square, FileText, 
  MapPin, AlertCircle, Sparkles, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { VISA_CHECKLIST_STEPS, REQUIRED_DOCUMENTS } from '../data/mockData';

export default function VisaGuide() {
  const [activeStepTab, setActiveStepTab] = useState('nusuk'); // nusuk, bio, vaccine
  
  // Interactive Document Checklist state
  const [checkedDocs, setCheckedDocs] = useState(['doc1', 'doc2']);

  const toggleDoc = (docId) => {
    if (checkedDocs.includes(docId)) {
      setCheckedDocs(checkedDocs.filter(id => id !== docId));
    } else {
      setCheckedDocs([...checkedDocs, docId]);
    }
  };

  const progressPercent = Math.round((checkedDocs.length / REQUIRED_DOCUMENTS.length) * 100);

  return (
    <section id="visa-guide" className="py-16 lg:py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bangladeshi Pilgrim Visa Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Saudi Visa & <span className="text-gold-gradient">Nusuk Preparation Guide</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Step-by-step guidance for Bangladeshi citizens on Saudi e-Visa issuance, KSA Bio-enrollment mobile app, Rawdah Nusuk permits, and authorized vaccine centers.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: App & Visa Guide Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Guide Step Tabs */}
            <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
              {[
                { id: 'nusuk', label: '1. Nusuk App Guide' },
                { id: 'bio', label: '2. Saudi Bio App' },
                { id: 'vaccine', label: '3. Vaccine Centers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStepTab(tab.id)}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap cursor-pointer ${
                    activeStepTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Step Content Box */}
            <div className="glass-card p-6 rounded-3xl border border-amber-500/20 space-y-6">
              
              {activeStepTab === 'nusuk' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">Nusuk App Permit Registration</h3>
                      <p className="text-xs text-slate-400">Official Ministry of Hajj & Umrah App</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    The Nusuk App is compulsory for all international pilgrims visiting Saudi Arabia to obtain official permits for Tawaf and praying in the Noble Rawdah Sharif (Riadul Jannah) in Madinah.
                  </p>

                  <div className="space-y-3 pt-2">
                    {VISA_CHECKLIST_STEPS[0].details.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStepTab === 'bio' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">Saudi Visa Bio Enrollment</h3>
                      <p className="text-xs text-slate-400">Mandatory Biometric Self-Capture</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Before visa issuance, Bangladeshi citizens must perform facial biometrics and 10-fingerprint scans using the official "Saudi Visa Bio" smartphone app.
                  </p>

                  <div className="space-y-3 pt-2">
                    {VISA_CHECKLIST_STEPS[1].details.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStepTab === 'vaccine' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">Authorized Vaccine Centers</h3>
                      <p className="text-xs text-slate-400">Meningitis & Polio Vaccination Cards</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Pilgrims departing from Bangladesh must produce a valid ACYW135 Quadrivalent Meningococcal meningitis vaccination certificate issued by authorized government hospitals:
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {VISA_CHECKLIST_STEPS[2].details.map((center, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs font-semibold text-amber-300">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{center}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

          </div>

          {/* RIGHT 5 COLS: Interactive Document Readiness Checklist */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Document Readiness Tool</span>
                  </h3>
                  <p className="text-xs text-slate-400">Check off your files before submission</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                  {progressPercent}% Ready
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-right text-slate-400 font-medium">
                  {checkedDocs.length} of {REQUIRED_DOCUMENTS.length} Documents Verified
                </p>
              </div>

              {/* Interactive Checklist List */}
              <div className="space-y-3">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const isChecked = checkedDocs.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/80 border-amber-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-amber-400">
                        {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold block">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {doc.required ? 'Mandatory Requirement' : 'Recommended'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warning note */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Passports must have at least 2 blank pages and minimum 6 months validity from the date of travel.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
