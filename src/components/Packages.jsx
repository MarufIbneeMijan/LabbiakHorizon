import React, { useState } from 'react';
import { 
  Building2, MapPin, Plane, Star, Clock, CheckCircle2, 
  Sparkles, ArrowRight, Eye, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PACKAGES } from '../data/mockData';
import PackageModal from './PackageModal';

export default function Packages({ externalSearch }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const filters = [
    { id: 'all', label: 'All Packages' },
    { id: 'economy', label: 'Economy Umrah' },
    { id: 'vip', label: '5-Star VIP Umrah' },
    { id: 'ramadan', label: 'Ramadan Special' },
    { id: 'hajj', label: 'Upcoming Hajj' },
  ];

  const filteredPackages = MOCK_PACKAGES.filter((pkg) => {
    if (activeFilter === 'all') return true;
    return pkg.category === activeFilter;
  });

  return (
    <section id="packages" className="py-16 lg:py-24 bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MoRA & HAAB Approved Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Curated Sacred <span className="text-gold-gradient">Pilgrimage Packages</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light mt-2 max-w-xl">
              Transparent, all-inclusive pricing with direct flights, 0m-300m Haram proximity, and expert Bangladeshi Islamic scholar guidance.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-950 rounded-3xl border border-amber-500/20 overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Card Image Banner */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                    {pkg.badge}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pkg.duration}</span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  
                  {/* Title & Duration Split */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{pkg.durationSplit}</p>
                  </div>

                  {/* Hotel Distance Badges */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white">{pkg.makkahHotel.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Makkah: {pkg.makkahHotel.distance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white">{pkg.madinahHotel.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Madinah: {pkg.madinahHotel.distance}
                      </span>
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Plane className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">{pkg.airline}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 text-[11px] font-semibold">{pkg.flightType}</span>
                  </div>

                  {/* Highlights Bullet Inclusions */}
                  <div className="space-y-1.5 pt-1">
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Price & CTA Button */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Package Cost</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-serif font-extrabold text-amber-400">
                        ৳{pkg.priceBDT.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">BDT</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Itinerary</span>
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Package Detail Modal */}
      {selectedPackage && (
        <PackageModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </section>
  );
}
