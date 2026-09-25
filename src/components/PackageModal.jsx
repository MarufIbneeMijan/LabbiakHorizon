import React, { useState } from 'react';
import { 
  X, Calendar, MapPin, Plane, CheckCircle2, Star, Clock, 
  Send, ShieldCheck, Sparkles, Building2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PackageModal({ pkg, onClose }) {
  const [activeTab, setActiveTab] = useState('itinerary'); // itinerary, details, booking
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    departureCity: 'Dhaka (DAC)',
    travelDate: '',
    passengers: '2',
    notes: ''
  });

  if (!pkg) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#047857']
    });
    setBookingSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto"
      >
        {/* Modal Header Banner */}
        <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 border border-amber-500/40 text-amber-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] uppercase font-extrabold tracking-wider mb-2 inline-block">
                {pkg.badge || 'Featured Package'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                {pkg.title}
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                {pkg.duration} • {pkg.durationSplit}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
              <span className="text-2xl font-serif font-extrabold text-amber-400">
                ৳{pkg.priceBDT.toLocaleString('en-IN')} <span className="text-xs text-slate-300 font-normal">BDT / person</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-2 shrink-0 overflow-x-auto">
          {[
            { id: 'itinerary', label: 'Day-by-Day Itinerary' },
            { id: 'details', label: 'Hotels & Inclusions' },
            { id: 'booking', label: 'Book / Reserve Seat' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: DAY BY DAY ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                Full Pilgrimage Day-by-Day Schedule
              </h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-800/50">
                {pkg.itinerary && pkg.itinerary.map((item, idx) => (
                  <div key={idx} className="relative pl-9 text-xs sm:text-sm">
                    <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-950 border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </div>
                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-white mb-1">
                        <span>{item.title}</span>
                        <span className="text-xs text-amber-400 font-semibold">{item.day}</span>
                      </div>
                      <p className="text-slate-300 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HOTELS & INCLUSIONS */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-xs sm:text-sm">
              
              {/* Hotel Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Makkah */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>Makkah Hotel</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{pkg.makkahHotel.name}</h5>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(pkg.makkahHotel.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-xs text-slate-400 ml-1 font-medium">{pkg.makkahHotel.stars}-Star</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Distance: {pkg.makkahHotel.distance}</span>
                  </div>
                </div>

                {/* Madinah */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>Madinah Hotel</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{pkg.madinahHotel.name}</h5>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(pkg.madinahHotel.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-xs text-slate-400 ml-1 font-medium">{pkg.madinahHotel.stars}-Star</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Distance: {pkg.madinahHotel.distance}</span>
                  </div>
                </div>
              </div>

              {/* Airline details */}
              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{pkg.airline}</h5>
                    <p className="text-xs text-slate-300">{pkg.flightType}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 text-xs font-semibold">
                  Luggage: 2x23kg + 5L Zamzam
                </span>
              </div>

              {/* Included Services list */}
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                  Comprehensive Package Inclusions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pkg.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-200 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BOOKING INQUIRY FORM */}
          {activeTab === 'booking' && (
            <div className="space-y-4">
              {bookingSubmitted ? (
                <div className="bg-emerald-950/80 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white">Booking Request Received!</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    JazakAllah Khair! Our senior Dhaka Hajj consultant will contact you via phone (+880) within 30 minutes to confirm seat availability & visa requirements.
                  </p>
                  <button
                    onClick={() => setBookingSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Direct seat reservation with Noor Al Haramain Travels & Tours Dhaka. Zero booking fees.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Al-Haj Tanvir Hossain"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">Mobile Number (+880) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="01711-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">Preferred Departure City</label>
                      <select
                        value={formData.departureCity}
                        onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Dhaka (DAC)">Dhaka (DAC)</option>
                        <option value="Chittagong (CGP)">Chittagong (CGP)</option>
                        <option value="Sylhet (ZYL)">Sylhet (ZYL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">Number of Passengers</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.passengers}
                        onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">Special Demands / Notes</label>
                    <textarea
                      rows="3"
                      placeholder="Wheelchair requirements, specific hotel preference, senior citizen care..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Booking Reservation</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
