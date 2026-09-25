import React, { useState } from 'react';
import { 
  Compass, MapPin, Plane, Building2, Train, 
  Sparkles, CheckCircle2, ChevronRight, Moon 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  const journeySteps = [
    {
      step: '01',
      phase: 'Ihram & Sacred Entrance',
      days: 'Day 1',
      location: 'Dhaka Airport (DAC) -> Miqat -> Makkah',
      icon: 'Plane',
      title: 'Departure from Dhaka & First Umrah Performance',
      description: 'Board your direct flight from Hazrat Shahjalal International Airport (DAC). Put on Ihram prior to reaching Miqat (Yalamlam/Qarn al-Manazil). Upon arrival at King Abdulaziz Airport Jeddah, private transfers bring you to your Clock Tower hotel for immediate scholar-guided Umrah performance at the Holy Kaaba.',
      highlights: ['Recitation of Talbiyah', 'Guided Tawaf & Sa\'i', 'Halq / Taqsir (Trimming Hair)']
    },
    {
      step: '02',
      phase: 'Makkah Ibadah & Ziyarah',
      days: 'Days 2 - 7',
      location: 'Masjid al-Haram & Historical Sites',
      icon: 'Building2',
      title: 'Tahajjud, Daily Tawaf & Historical Excursions',
      description: 'Focus on 5 daily prayers in Masjid al-Haram, Tahajjud prayers, and voluntary Tawaf. Participate in our comprehensive guided Ziyarah tour covering Jabal al-Nour (Cave of Hira), Cave of Thawr, Mina, Mount Arafat (Jabal al-Rahmah), and Muzdalifah.',
      highlights: ['Cave of Hira Viewpoint', 'Arafat & Mina Excursion', 'Taif Mountain Excursion (Optional)']
    },
    {
      step: '03',
      phase: 'Bullet Train Experience',
      days: 'Day 8',
      location: 'Haramain Express: Makkah -> Madinah',
      icon: 'Train',
      title: 'Scenic High-Speed Journey to Madinah Al-Munawwarah',
      description: 'Experience the state-of-the-art Haramain High-Speed Bullet Train traveling at 300 km/h across the desert to Madinah in just 2 hours. Check into your Markaziah hotel just steps away from Al-Masjid an-Nabawi.',
      highlights: ['First-Class Bullet Train Pass', 'Comfortable AC Journey', 'Arrival in Prophet\'s City']
    },
    {
      step: '04',
      phase: 'Madinah Peace & Return',
      days: 'Days 9 - 14',
      location: 'Al-Masjid an-Nabawi & Historical Ziyarah',
      icon: 'Moon',
      title: 'Rawdah Sharif Salam & Departure back to Dhaka',
      description: 'Perform Salam at the sacred Rawdah Sharif (Riadul Jannah) with guaranteed Nusuk App appointment. Visit Masjid Quba (where 2 Rakat prayer equals 1 Umrah reward), Mount Uhud battlefield, and Masjid al-Qiblatayn before your departure flight back to Dhaka.',
      highlights: ['Guaranteed Rawdah Permit', 'Masjid Quba 2 Rakat Reward', 'Direct Departure back to DAC']
    }
  ];

  return (
    <section id="journey" className="py-16 lg:py-24 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Step-by-Step Pilgrim Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            The Sacred Flow of Your <span className="text-gold-gradient">Pilgrimage</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            From stepping into Ihram at Shahjalal Airport Dhaka to standing in front of the Holy Rawdah in Madinah, here is your guided itinerary.
          </p>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeySteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedMilestone(idx)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedMilestone === idx
                  ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-amber-400 shadow-2xl gold-glow'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-extrabold text-amber-400">
                    {step.step}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-[11px] font-bold text-emerald-300">
                    {step.days}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    {step.phase}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{step.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Milestone Active Spotlight Box */}
        <motion.div
          key={selectedMilestone}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-8 glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs">
                Milestone Phase {journeySteps[selectedMilestone].step} ({journeySteps[selectedMilestone].days})
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                {journeySteps[selectedMilestone].location}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">
              {journeySteps[selectedMilestone].title}
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {journeySteps[selectedMilestone].description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-emerald-900/80 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Sacred Highlights Included:
            </h4>
            <div className="space-y-2 text-xs text-slate-200">
              {journeySteps[selectedMilestone].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
