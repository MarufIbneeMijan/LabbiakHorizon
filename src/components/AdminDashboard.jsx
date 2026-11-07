import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, LogOut, Package, ShoppingBag, Car, 
  ClipboardList, Plus, Trash2, Edit3, Save, X, Check, 
  MessageSquare, ExternalLink, RefreshCw, AlertCircle, 
  Sparkles, Crown, DollarSign, Calendar, Eye, Phone, MapPin, Tag, CheckCircle2, Building2,
  Plane, Luggage, RotateCcw, ArrowRight, Users, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, packagesAPI, productsAPI, transportAPI, ordersAPI, hotelsAPI } from '../services/api';
import AdminLogin from './AdminLogin';

const DEFAULT_ITINERARY_TEMPLATE = [
  { day: 'Day 1', day_bn: 'দিন ১', title: 'Dhaka Departure & Royal Jeddah Arrival', title_bn: 'ঢাকা ত্যাগ ও জেদ্দা রাজকীয় আগমন', desc: 'VIP flight from DAC to JED, private chauffeur transfer to Makkah 5-star hotel.', desc_bn: 'ঢাকা থেকে বিমানে জেদ্দা পৌঁছানো এবং প্রাইভেট চফারে মক্কা ৫-স্টার হোটেলে স্থানান্তর।' },
  { day: 'Day 2', day_bn: 'দিন ২', title: 'Guided Umrah under Senior Scholar Direction', title_bn: 'মোয়াল্লিমের নেতৃত্বে পবিত্র উমরাহ পালন', desc: 'Performing peaceful Umrah rites with dedicated scholar guidance.', desc_bn: 'অভিজ্ঞ আলেমের নির্দেশনায় তাওয়াফ, সাঈ ও হালাল সঠিকভাবে সুন্নাহ মোতাবেক সম্পন্ন করা।' },
  { day: 'Day 3–5', day_bn: 'দিন ৩–৫', title: 'Makkah Sacred Ziyarah & Prayers', title_bn: 'মক্কার ঐতিহাসিক জিয়ারত ও ইবাদত', desc: 'Excursion to Cave Hira, Thawr, Mina, and unhurried courtyard prayers.', desc_bn: 'জাবালে নূর, জাবালে সওর ও আরাফাত পরিদর্শন। হারামে নফল ইবাদতের পর্যাপ্ত সময়।' },
  { day: 'Day 6', day_bn: 'দিন ৬', title: 'Haramain High-Speed Train to Madinah', title_bn: 'হারামাইন বুলেট ট্রেনে মদিনা যাত্রা', desc: 'First-Class high-speed bullet train transfer to Madinah Al-Munawwarah.', desc_bn: 'বুলেট ট্রেনের ফার্স্ট ক্লাস কেবিনে আরামদায়কভাবে মদিনায় গমন।' },
  { day: 'Day 7–8', day_bn: 'দিন ৭–৮', title: "Rawdah Sharif Ziyarah & Prophet's Mosque", title_bn: 'রওজা শরিফ জিয়ারত ও মসজিদে নববী', desc: "Priority entry to Rawdah Sharif and spiritual solace in the Prophet's Mosque.", desc_bn: 'নুসুক অ্যাপ পারমিটে রিয়াদুল জান্নাতে সালাত ও রাসুলুল্লাহ (সাঃ)-এর রওজায় সালাম পেশ।' },
  { day: 'Day 9–10', day_bn: 'দিন ৯–১০', title: 'Madinah Ziyarah & Homeward Return', title_bn: 'মদিনা জিয়ারত ও ঢাকায় প্রত্যাবর্তন', desc: 'Visiting Quba Mosque and Mount Uhud before direct flight return to Dhaka.', desc_bn: 'মসজিদে কুবা ও উহুদ প্রান্তর পরিদর্শন শেষে ঢাকায় সম্মানজনক প্রত্যাবর্তন।' }
];

const DEFAULT_INCLUSIONS_TEMPLATE = [
  { title: 'VIP Visa & Priority Rawdah Permit', title_bn: 'ভিআইপি ভিসা ও নুসুক অগ্রাধিকার রওজা পারমিট', desc: 'Ministry-verified visa with fast-track Nusuk Rawdah reservation.' },
  { title: '1-on-1 Senior Scholar Moallim', title_bn: 'ব্যক্তিগত অভিজ্ঞ আলেম মোয়াল্লিম গাইড', desc: 'Experienced Bengali scholar escorting every ritual and tawaf.' },
  { title: 'Private AC Fleet & Bullet Train 1st Class', title_bn: 'প্রাইভেট এসি পরিবহন ও বুলেট ট্রেন ফার্স্ট ক্লাস', desc: 'Airport transfers and intercity travel in luxury vehicles.' },
  { title: '5L Zamzam & Dates to Dhaka Home', title_bn: 'ঢাকায় বাসায় ৫ লিটার জমজম ও খেজুর ডেলিভারি', desc: 'Sealed official Zamzam delivered to your doorstep in Dhaka.' },
  { title: 'CIP Airport Fast-Track Protocol', title_bn: 'সিআইপি ফাস্ট-ট্র্যাক এয়ারপোর্ট প্রোটোকল', desc: 'Expedited customs and lounge access at Dhaka & Jeddah airports.' }
];

export default function AdminDashboard({ isOpen = true, onClose, locale = 'en', adminUser: propAdminUser, onLogout }) {
  const navigate = useNavigate();
  if (isOpen === false) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true' && Boolean(localStorage.getItem('horizon_admin_token'));
  });
  const [adminUser, setAdminUser] = useState(propAdminUser || null);
  const [loginIdentifier, setLoginIdentifier] = useState('admin@labbaikhorizon.com');
  const [loginPassword, setLoginPassword] = useState('Labbaik@VIP2026');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'cms' | 'orders'
  const [activeTab, setActiveTab] = useState('cms');
  // CMS Subtab: 'packages' | 'products' | 'transport'
  const [cmsSubtab, setCmsSubtab] = useState('packages');

  // Data States
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [transport, setTransport] = useState({ routes: [], vehicles: [] });
  const [orders, setOrders] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelCityFilter, setHotelCityFilter] = useState('all'); // 'all' | 'makkah' | 'madinah'
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals & Form States
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingHotel, setEditingHotel] = useState(null);

  // Form DOM Refs for Smooth Auto-Scroll on Edit
  const packageFormRef = useRef(null);
  const productFormRef = useRef(null);
  const hotelFormRef = useRef(null);

  // Transport Route Modal State
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeForm, setRouteForm] = useState({
    nameEn: '',
    nameBn: '',
    vehicleType: 'GMC Yukon VIP',
    priceBDT: 52000,
    distanceEn: '95 km (approx. 60 mins)'
  });

  // Dedicated Fleet & Vehicle Management State
  const [transportView, setTransportView] = useState('vehicles'); // 'vehicles' | 'routes'
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newVehicleFeature, setNewVehicleFeature] = useState('');
  const [vehicleForm, setVehicleForm] = useState({
    nameEn: '',
    nameBn: '',
    category: 'VIP Chauffeur SUV',
    passengers: 7,
    luggage: 5,
    features: ['24/7 Dedicated Chauffeur', 'Flight Tracking & Cold Zamzam', 'Free High-Speed Wi-Fi', 'Luxury Leather Interior'],
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    badgeEn: 'VIP Benchmark'
  });

  // Dynamic Categories State
  const DEFAULT_CATEGORIES = [
    { id: 'ihram', labelEn: 'Ihram & Attire', labelBn: 'ইহরাম ও পোশাক' },
    { id: 'zamzam', labelEn: 'Zamzam Water', labelBn: 'জমজম পানি' },
    { id: 'dates', labelEn: 'Ajwa Dates & Relics', labelBn: 'আজওয়া খেজুর ও হাদিয়া' },
    { id: 'tasbeeh', labelEn: 'Digital Counters & Dua', labelBn: 'স্মার্ট তাসবীহ ও কাউন্টার' },
    { id: 'rugs', labelEn: 'Orthopedic Rugs & Footwear', labelBn: 'মেমোরি ফোম জায়নামাজ ও জুতো' },
    { id: 'skincare', labelEn: 'Halal Personal Care', labelBn: 'হালাল স্কিনকেয়ার ও কিট' }
  ];

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('horizon_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...DEFAULT_CATEGORIES];
          parsed.forEach((c) => {
            if (!merged.some((m) => m.id === c.id)) merged.push(c);
          });
          return merged;
        }
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatBn, setNewCatBn] = useState('');

  // Dynamic Tags State
  const DEFAULT_TAGS = ['Essential', 'Best Seller', 'Luxury', 'New Arrival', 'Limited Stock'];
  const [tags, setTags] = useState(() => {
    try {
      const saved = localStorage.getItem('horizon_custom_tags');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_TAGS, ...parsed]));
        }
      }
    } catch {}
    return DEFAULT_TAGS;
  });

  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Dynamic Cities State
  const DEFAULT_CITIES = ['Makkah', 'Madinah'];
  const [cities, setCities] = useState(() => {
    try {
      const saved = localStorage.getItem('horizon_custom_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_CITIES, ...parsed]));
        }
      }
    } catch {}
    return DEFAULT_CITIES;
  });

  const [isCreatingCity, setIsCreatingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  // Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    name: '',
    nameBn: '',
    city: 'Makkah',
    dist: '0m - Courtyard Direct',
    distBn: '০ মিটার - সরাসরি হারাম চত্বর',
    stars: 5,
    starRating: '5-Star VIP',
    nightlyBdt: 120000,
    nightlyUsd: 1000,
    features: "Direct Haram Courtyard Access\nLive Kaaba Audio Feed in Suite\n24/7 Dedicated Private Butler\nRoyal Buffet Dining",
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
  });

  // Package Form State
  const [packageForm, setPackageForm] = useState({
    type: 'umrah',
    title_en: '',
    title_bn: '',
    badge_en: 'VIP Sanctum',
    badge_bn: 'ভিআইপি স্যাঙ্কটাম',
    priceBDT: 185000,
    priceUSD: 1540,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
    features_en: 'VIP Visa Processing\nDirect Flight Ticket\n5-Star Courtyard Hotel\nAC Transport Service',
    features_bn: 'ভিআইপি ভিসা প্রসেসিং\nডিরেক্ট ফ্লাইট টিকিট\n৫-স্টার উঠানমুখী হোটেল\nএসি পরিবহন সুবিধা',
    selectedHotelIds: [],
    flightTier: 'Direct Flight - Saudia / Biman VIP',
    flightLuggage: '2x 23kg Check-in (46kg) + 7kg Cabin Baggage + 5L Zamzam',
    flightRoute: 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)',
    flightAircraft: 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
    itinerary: DEFAULT_ITINERARY_TEMPLATE,
    inclusions: DEFAULT_INCLUSIONS_TEMPLATE
  });

  // Product Form State with dynamic specifications (up to 4 bullet points)
  const [productForm, setProductForm] = useState({
    name_en: '',
    name_bn: '',
    priceBDT: 3500,
    priceUSD: 30,
    category: 'ihram',
    tag: 'Essential',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    description_en: '',
    description_bn: '',
    specifications: [
      '100% Egyptian Long-Staple Combed Cotton',
      'Shariah Compliant Unstitched Weave',
      'Ultra-absorbent & Hypoallergenic',
      'Includes Secure Travel Belt'
    ]
  });

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Check auth on load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await authAPI.verify();
    if (res.success) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      setAdminUser(res.user);
      loadAllData();
    } else {
      localStorage.removeItem('isAdminAuthenticated');
      setIsAuthenticated(false);
      setIsLoading(false);
      if (onLogout) onLogout();
    }
  };

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLoggingIn(true);
    setLoginError('');

    const res = await authAPI.login(loginIdentifier, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      setAdminUser(res.data?.user || res.user);
      loadAllData();
    } else {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  const handleLogout = (e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    authAPI.logout();
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    setAdminUser(null);
    if (onLogout) {
      onLogout();
    }
  };

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [pkgs, prods, trans, ords, htls] = await Promise.all([
        packagesAPI.getAll('all'),
        productsAPI.getAll('all'),
        transportAPI.get(),
        ordersAPI.getAll(),
        hotelsAPI.getAll('all')
      ]);
      setPackages(pkgs);
      setProducts(prods);
      setTransport(trans);
      setOrders(ords);
      setHotels(htls);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PACKAGE ACTIONS ---
  const resetPackageForm = () => {
    setPackageForm({
      type: 'umrah',
      title_en: '',
      title_bn: '',
      badge_en: 'VIP Sanctum',
      badge_bn: 'ভিআইপি স্যাঙ্কটাম',
      priceBDT: 185000,
      priceUSD: 1540,
      isPopular: false,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
      features_en: 'VIP Visa Processing\nDirect Flight Ticket\n5-Star Courtyard Hotel\nAC Transport Service',
      features_bn: 'ভিআইপি ভিসা প্রসেসিং\nডিরেক্ট ফ্লাইট টিকিট\n৫-স্টার উঠানমুখী হোটেল\nএসি পরিবহন সুবিধা',
      selectedHotelIds: [],
      flightTier: 'Direct Flight - Saudia / Biman VIP',
      flightLuggage: '2x 23kg Check-in (46kg) + 7kg Cabin Baggage + 5L Zamzam',
      flightRoute: 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)',
      flightAircraft: 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
      itinerary: DEFAULT_ITINERARY_TEMPLATE,
      inclusions: DEFAULT_INCLUSIONS_TEMPLATE
    });
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    const payload = {
      ...packageForm,
      features_en: typeof packageForm.features_en === 'string' 
        ? packageForm.features_en.split('\n').filter(Boolean) 
        : packageForm.features_en,
      features_bn: typeof packageForm.features_bn === 'string' 
        ? packageForm.features_bn.split('\n').filter(Boolean) 
        : packageForm.features_bn,
      priceBDT: Number(packageForm.priceBDT),
      priceUSD: Number(packageForm.priceUSD) || Math.round(Number(packageForm.priceBDT) / 120),
      price_en: `৳ ${Number(packageForm.priceBDT).toLocaleString()}`,
      price_bn: `৳ ${Number(packageForm.priceBDT).toLocaleString()}/-`,
      selectedHotelIds: packageForm.selectedHotelIds || [],
      flightTier: packageForm.flightTier,
      flightLuggage: packageForm.flightLuggage,
      flightRoute: packageForm.flightRoute,
      flightAircraft: packageForm.flightAircraft,
      itinerary: packageForm.itinerary || [],
      inclusions: packageForm.inclusions || []
    };

    if (editingPackage) {
      await packagesAPI.update(editingPackage.id, payload);
      showNotification('Package updated successfully with full details & hotel directory binding!');
    } else {
      await packagesAPI.create(payload);
      showNotification('New package created successfully with full custom details!');
    }

    setEditingPackage(null);
    resetPackageForm();
    const updated = await packagesAPI.getAll('all');
    setPackages(updated);
  };

  const handleDeletePackage = async (id, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.confirm('Are you sure you want to remove this package?')) {
      await packagesAPI.delete(id);
      showNotification('Package deleted.');
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const startEditPackage = (pkg, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setEditingPackage(pkg);
    setPackageForm({
      type: pkg.type || 'umrah',
      title_en: pkg.title_en || '',
      title_bn: pkg.title_bn || '',
      badge_en: pkg.badge_en || 'VIP Sanctum',
      badge_bn: pkg.badge_bn || 'ভিআইপি স্যাঙ্কটাম',
      priceBDT: pkg.priceBDT || 185000,
      priceUSD: pkg.priceUSD || 1540,
      isPopular: Boolean(pkg.isPopular),
      image: pkg.image || 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
      features_en: Array.isArray(pkg.features_en) ? pkg.features_en.join('\n') : (pkg.features_en || ''),
      features_bn: Array.isArray(pkg.features_bn) ? pkg.features_bn.join('\n') : (pkg.features_bn || ''),
      selectedHotelIds: Array.isArray(pkg.selectedHotelIds) ? pkg.selectedHotelIds : [],
      flightTier: pkg.flightTier || 'Direct Flight - Saudia / Biman VIP',
      flightLuggage: pkg.flightLuggage || '2x 23kg Check-in (46kg) + 7kg Cabin Baggage + 5L Zamzam',
      flightRoute: pkg.flightRoute || 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)',
      flightAircraft: pkg.flightAircraft || 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
      itinerary: Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 ? pkg.itinerary : DEFAULT_ITINERARY_TEMPLATE,
      inclusions: Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? pkg.inclusions : DEFAULT_INCLUSIONS_TEMPLATE
    });
    setTimeout(() => {
      packageFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Toggle hotel selection in package
  const toggleHotelSelection = (hotelId) => {
    setPackageForm((prev) => {
      const currentList = prev.selectedHotelIds || [];
      const exists = currentList.includes(hotelId);
      return {
        ...prev,
        selectedHotelIds: exists
          ? currentList.filter((id) => id !== hotelId)
          : [...currentList, hotelId]
      };
    });
  };

  // Add Itinerary Day
  const handleAddItineraryDay = () => {
    setPackageForm((prev) => {
      const currentList = prev.itinerary || [];
      const nextDayNum = currentList.length + 1;
      const newDay = {
        day: `Day ${nextDayNum}`,
        day_bn: `দিন ${nextDayNum}`,
        title: '',
        title_bn: '',
        desc: '',
        desc_bn: ''
      };
      return {
        ...prev,
        itinerary: [...currentList, newDay]
      };
    });
  };

  // Update Itinerary Day
  const handleUpdateItineraryDay = (index, field, value) => {
    setPackageForm((prev) => {
      const updated = [...(prev.itinerary || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  // Delete Itinerary Day
  const handleDeleteItineraryDay = (index) => {
    setPackageForm((prev) => ({
      ...prev,
      itinerary: (prev.itinerary || []).filter((_, i) => i !== index)
    }));
  };

  // Add Custom Inclusion
  const handleAddInclusion = (title = '', title_bn = '', desc = '', desc_bn = '') => {
    setPackageForm((prev) => ({
      ...prev,
      inclusions: [
        ...(prev.inclusions || []),
        {
          title: title || 'New White-Glove Privilege',
          title_bn: title_bn || 'নতুন ভিআইপি সুবিধা',
          desc: desc || 'Dedicated privilege ensuring spiritual comfort and peace of mind.',
          desc_bn: desc_bn || 'আপনার পবিত্র সফরে পরম প্রশান্তি ও স্বাচ্ছন্দ্য নিশ্চিতকরণ সুবিধা।'
        }
      ]
    }));
  };

  // Update Inclusion
  const handleUpdateInclusion = (index, field, value) => {
    setPackageForm((prev) => {
      const updated = [...(prev.inclusions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, inclusions: updated };
    });
  };

  // Delete Inclusion
  const handleDeleteInclusion = (index) => {
    setPackageForm((prev) => ({
      ...prev,
      inclusions: (prev.inclusions || []).filter((_, i) => i !== index)
    }));
  };

  // --- DYNAMIC CMS CREATION HANDLERS ---
  const handleCreateCategory = () => {
    if (!newCatEn.trim()) return;
    const slug = newCatEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = {
      id: slug || `cat-${Date.now()}`,
      labelEn: newCatEn.trim(),
      labelBn: newCatBn.trim() || newCatEn.trim()
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    try {
      localStorage.setItem('horizon_custom_categories', JSON.stringify(updated));
    } catch {}
    setProductForm((prev) => ({ ...prev, category: newCat.id }));
    setNewCatEn('');
    setNewCatBn('');
    setIsCreatingCategory(false);
    showNotification(`New category "${newCat.labelEn}" created successfully!`);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const clean = newTagName.trim();
    if (!tags.includes(clean)) {
      const updated = [...tags, clean];
      setTags(updated);
      try {
        localStorage.setItem('horizon_custom_tags', JSON.stringify(updated));
      } catch {}
    }
    setProductForm((prev) => ({ ...prev, tag: clean }));
    setNewTagName('');
    setIsCreatingTag(false);
    showNotification(`New tag "${clean}" created successfully!`);
  };

  const handleCreateCity = () => {
    if (!newCityName.trim()) return;
    const clean = newCityName.trim();
    if (!cities.includes(clean)) {
      const updated = [...cities, clean];
      setCities(updated);
      try {
        localStorage.setItem('horizon_custom_cities', JSON.stringify(updated));
      } catch {}
    }
    setHotelForm((prev) => ({ ...prev, city: clean }));
    setNewCityName('');
    setIsCreatingCity(false);
    showNotification(`New city "${clean}" added to directory!`);
  };

  // --- PRODUCT ACTIONS ---
  const handleAddSpecification = () => {
    if ((productForm.specifications || []).length >= 4) return;
    setProductForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), '']
    }));
  };

  const handleUpdateSpecification = (idx, value) => {
    setProductForm((prev) => {
      const specs = [...(prev.specifications || [])];
      specs[idx] = value;
      return { ...prev, specifications: specs };
    });
  };

  const handleRemoveSpecification = (idx) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      priceBDT: Number(productForm.priceBDT),
      priceUSD: Number(productForm.priceUSD) || Math.round(Number(productForm.priceBDT) / 120),
      stock: Number(productForm.stock),
      specifications: (productForm.specifications || []).filter(s => s && s.trim())
    };

    if (editingProduct) {
      await productsAPI.update(editingProduct.id, payload);
      showNotification('Product updated successfully!');
    } else {
      await productsAPI.create(payload);
      showNotification('New product added to pilgrim store!');
    }

    setEditingProduct(null);
    setProductForm({
      name_en: '',
      name_bn: '',
      priceBDT: 3500,
      priceUSD: 30,
      category: 'ihram',
      tag: 'Essential',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
      description_en: '',
      description_bn: '',
      specifications: []
    });
    const updated = await productsAPI.getAll('all');
    setProducts(updated);
  };

  const handleDeleteProduct = async (id, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.confirm('Delete this pilgrim store product?')) {
      await productsAPI.delete(id);
      showNotification('Product deleted.');
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleUpdateStock = async (id, newStock, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (newStock < 0) return;
    await productsAPI.update(id, { stock: newStock });
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const startEditProduct = (prod, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setEditingProduct(prod);
    setProductForm({
      name_en: prod.name_en || '',
      name_bn: prod.name_bn || '',
      priceBDT: prod.priceBDT || 3500,
      priceUSD: prod.priceUSD || 30,
      category: prod.category || 'essential',
      tag: prod.tag || 'Essential',
      stock: prod.stock !== undefined ? prod.stock : 50,
      image: prod.image || '',
      description_en: prod.description_en || '',
      description_bn: prod.description_bn || '',
      specifications: Array.isArray(prod.specifications) && prod.specifications.length > 0
        ? [...prod.specifications]
        : (Array.isArray(prod.specs) ? [...prod.specs] : [])
    });
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // --- STREAMLINED TRANSPORT ACTIONS ---
  const openAddRouteModal = () => {
    setEditingRoute(null);
    setRouteForm({
      nameEn: '',
      nameBn: '',
      vehicleType: 'GMC Yukon VIP',
      priceBDT: 45000,
      distanceEn: '95 km (approx. 60 mins)'
    });
    setRouteModalOpen(true);
  };

  const startEditRoute = (r, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setEditingRoute(r);
    setRouteForm({
      nameEn: r.nameEn || '',
      nameBn: r.nameBn || '',
      vehicleType: r.vehicleType || r.typeEn || 'GMC Yukon VIP',
      priceBDT: r.priceBDT !== undefined ? r.priceBDT : Math.round((r.finalPriceSAR || 1600) * 33),
      distanceEn: r.distanceEn || ''
    });
    setRouteModalOpen(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    const payload = {
      nameEn: routeForm.nameEn.trim(),
      nameBn: routeForm.nameBn.trim() || routeForm.nameEn.trim(),
      vehicleType: routeForm.vehicleType.trim(),
      priceBDT: Number(routeForm.priceBDT),
      distanceEn: routeForm.distanceEn.trim() || 'Express Transfer',
      basePriceSAR: Math.round(Number(routeForm.priceBDT) / 33)
    };

    if (editingRoute) {
      await transportAPI.updateRoute(editingRoute.id, payload);
      showNotification('Transport route updated successfully.');
    } else {
      await transportAPI.addRoute(payload);
      showNotification('New transport route added.');
    }
    setRouteModalOpen(false);
    setEditingRoute(null);
    const updated = await transportAPI.get();
    setTransport(updated);
  };

  const handleDeleteRoute = async (routeId, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.confirm('Delete this transport route?')) {
      await transportAPI.deleteRoute(routeId);
      showNotification('Transport route deleted.');
      const updated = await transportAPI.get();
      setTransport(updated);
    }
  };

  // --- VEHICLE ACTIONS ---
  const openAddVehicleModal = () => {
    setEditingVehicle(null);
    setVehicleForm({
      nameEn: '',
      nameBn: '',
      category: 'VIP Chauffeur SUV',
      passengers: 7,
      luggage: 5,
      features: ['24/7 Dedicated Chauffeur', 'Flight Tracking & Cold Zamzam', 'Free High-Speed Wi-Fi', 'Luxury Leather Interior'],
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      status: 'active',
      badgeEn: 'VIP Benchmark'
    });
    setNewVehicleFeature('');
    setVehicleModalOpen(true);
  };

  const startEditVehicle = (veh, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setEditingVehicle(veh);
    setVehicleForm({
      nameEn: veh.nameEn || veh.name || '',
      nameBn: veh.nameBn || veh.name || '',
      category: veh.category || veh.categoryEn || 'VIP Chauffeur SUV',
      passengers: veh.passengers || 4,
      luggage: veh.luggage || 4,
      features: Array.isArray(veh.featuresEn) && veh.featuresEn.length > 0 
        ? [...veh.featuresEn] 
        : (Array.isArray(veh.features) ? [...veh.features] : ['24/7 Dedicated Chauffeur', 'Free Wi-Fi']),
      imageUrl: veh.imageUrl || veh.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      status: veh.status || 'active',
      badgeEn: veh.badgeEn || veh.badge || 'VIP Fleet'
    });
    setNewVehicleFeature('');
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (!vehicleForm.nameEn.trim()) {
      alert('Please enter a vehicle name in English.');
      return;
    }

    const payload = {
      nameEn: vehicleForm.nameEn.trim(),
      nameBn: vehicleForm.nameBn.trim() || vehicleForm.nameEn.trim(),
      name: vehicleForm.nameEn.trim(),
      category: vehicleForm.category,
      categoryEn: vehicleForm.category,
      categoryBn: vehicleForm.category,
      passengers: Number(vehicleForm.passengers) || 4,
      luggage: Number(vehicleForm.luggage) || 4,
      featuresEn: vehicleForm.features,
      featuresBn: vehicleForm.features,
      features: vehicleForm.features,
      image: vehicleForm.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      imageUrl: vehicleForm.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      status: vehicleForm.status,
      badgeEn: vehicleForm.badgeEn || 'VIP Fleet',
      badgeBn: 'ভিআইপি ফ্লিট'
    };

    if (editingVehicle) {
      await transportAPI.updateVehicle(editingVehicle.id, payload);
      showNotification('Vehicle profile updated successfully.');
    } else {
      await transportAPI.addVehicle(payload);
      showNotification('New VIP fleet vehicle added.');
    }

    setVehicleModalOpen(false);
    setEditingVehicle(null);
    const updated = await transportAPI.get();
    setTransport(updated);
  };

  const handleDeleteVehicle = async (vehId, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.confirm('Are you sure you want to delete this vehicle from your VIP fleet?')) {
      await transportAPI.deleteVehicle(vehId);
      showNotification('Vehicle removed from fleet.');
      const updated = await transportAPI.get();
      setTransport(updated);
    }
  };

  const handleToggleVehicleStatus = async (veh, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const newStatus = veh.status === 'maintenance' ? 'active' : 'maintenance';
    await transportAPI.updateVehicle(veh.id, { status: newStatus });
    showNotification(`Vehicle status changed to: ${newStatus.toUpperCase()}`);
    const updated = await transportAPI.get();
    setTransport(updated);
  };

  const handleAddVehicleFeature = () => {
    if (!newVehicleFeature.trim()) return;
    if (vehicleForm.features.length >= 8) {
      alert('Maximum 8 features allowed.');
      return;
    }
    setVehicleForm({
      ...vehicleForm,
      features: [...vehicleForm.features, newVehicleFeature.trim()]
    });
    setNewVehicleFeature('');
  };

  const handleRemoveVehicleFeature = (indexToRemove) => {
    setVehicleForm({
      ...vehicleForm,
      features: vehicleForm.features.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // --- HOTEL ACTIONS ---
  const handleSaveHotel = async (e) => {
    e.preventDefault();
    const payload = {
      ...hotelForm,
      nightlyBdt: Number(hotelForm.nightlyBdt),
      nightlyUsd: Number(hotelForm.nightlyUsd) || Math.round(Number(hotelForm.nightlyBdt) / 120),
      stars: Number(hotelForm.stars) || 5,
      features: typeof hotelForm.features === 'string' 
        ? hotelForm.features.split('\n').filter(Boolean) 
        : hotelForm.features
    };

    if (editingHotel) {
      await hotelsAPI.update(editingHotel.id, payload);
      showNotification('Hotel property updated successfully!');
    } else {
      await hotelsAPI.create(payload);
      showNotification('New luxury hotel property added to CMS!');
    }

    setEditingHotel(null);
    setHotelForm({
      name: '',
      nameBn: '',
      city: 'Makkah',
      dist: '0m - Courtyard Direct',
      distBn: '০ মিটার - সরাসরি হারাম চত্বর',
      stars: 5,
      starRating: '5-Star VIP',
      nightlyBdt: 120000,
      nightlyUsd: 1000,
      features: "Direct Haram Courtyard Access\nLive Kaaba Audio Feed in Suite\n24/7 Dedicated Private Butler\nRoyal Buffet Dining",
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    });
    const updated = await hotelsAPI.getAll('all');
    setHotels(updated);
  };

  const handleDeleteHotel = async (id, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.confirm('Delete this luxury hotel property from CMS?')) {
      await hotelsAPI.delete(id);
      showNotification('Hotel property removed.');
      setHotels(hotels.filter(h => h.id !== id));
    }
  };

  const startEditHotel = (htl, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setEditingHotel(htl);
    setHotelForm({
      name: htl.name || '',
      nameBn: htl.nameBn || '',
      city: htl.city || 'Makkah',
      dist: htl.dist || '0m - Courtyard Direct',
      distBn: htl.distBn || '',
      stars: htl.stars || 5,
      starRating: htl.starRating || '5-Star VIP',
      nightlyBdt: htl.nightlyBdt || 120000,
      nightlyUsd: htl.nightlyUsd || 1000,
      features: Array.isArray(htl.features) ? htl.features.join('\n') : (htl.features || ''),
      image: htl.image || ''
    });
    setTimeout(() => {
      hotelFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderId, newStatus, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    // 1. Optimistic state update in place - instantly update without reloading or redirecting
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // 2. Immediate localStorage persistence
    try {
      const stored = localStorage.getItem('horizon_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        localStorage.setItem('horizon_orders', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Local orders cache update error:', err);
    }

    // 3. Subtle non-intrusive feedback
    showNotification(`Order ${orderId} status updated to "${newStatus}" successfully!`);

    // 4. Background API sync (isolated, never triggers reload/redirect)
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
    } catch (err) {
      console.warn('API order status update failed (local state kept):', err);
    }
  };

  const handleDeleteOrder = async (orderId, e = null) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    if (target.status !== 'Completed' && target.status !== 'Dispatched') {
      alert('Security Policy: Only orders with status "Completed" or "Dispatched" can be archived or deleted.');
      return;
    }

    if (window.confirm(`Permanently remove order ${orderId}? This action cannot be reversed.`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      try {
        const stored = localStorage.getItem('horizon_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.filter(o => o.id !== orderId);
          localStorage.setItem('horizon_orders', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Local orders cache delete error:', err);
      }
      showNotification(`Order ${orderId} has been successfully deleted.`);
      try {
        await ordersAPI.delete(orderId);
      } catch (err) {
        console.warn('API delete order failed:', err);
      }
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const query = orderSearchQuery.toLowerCase();
    const matchesSearch = !query || 
      o.id.toLowerCase().includes(query) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.customerPhone && o.customerPhone.includes(query));
    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(u) => {
          setIsAuthenticated(true);
          setAdminUser(u);
          loadAllData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080809] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      <div className="w-full flex-1 flex flex-col p-2 sm:p-4 lg:p-6 max-w-[1750px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#121214] border border-[#d4af37]/35 rounded-3xl w-full flex-1 flex flex-col shadow-2xl relative overflow-hidden kiswah-gold-glow"
        >
          {/* Glow accents */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-[#996515]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* TOP STATUS BAR */}
          <div className="bg-[#080809] border-b border-[#d4af37]/25 p-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-xl text-[#d4af37]">
                🕋
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-lg text-white">LabbaikHorizon Control Center</h1>
                  <span className="text-[10px] bg-[#d4af37]/15 text-[#d4af37] font-mono font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                    CMS & E-COMMERCE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  MoRA HAAB-1420 • Al Ahsaniya Transport Grids • Unified Data Hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-slate-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Director: <strong className="text-white">{adminUser?.name || 'Administrator'}</strong></span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  else navigate('/');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-slate-800 text-slate-300 hover:text-white hover:border-[#d4af37]/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Return to Public Website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Public Website</span>
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign out of Admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {/* NOTIFICATION TOAST */}
          <AnimatePresence>
            {actionSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs py-2 px-6 flex items-center justify-center gap-2 z-30 font-medium shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN DASHBOARD TABS & CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TABS HEADER */}
            <div className="bg-[#0a0a0c] border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('cms')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'cms'
                      ? 'bg-kiswah-gold text-[#080809] shadow-lg'
                      : 'bg-white/[0.03] border border-slate-800 text-slate-300 hover:text-white hover:border-[#d4af37]/40'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Tab 1: Store & Package Manager (CMS)</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-kiswah-gold text-[#080809] shadow-lg'
                      : 'bg-white/[0.03] border border-slate-800 text-slate-300 hover:text-white hover:border-[#d4af37]/40'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Tab 2: Orders & Customer Enquiries</span>
                  {orders.filter(o => o.status === 'Pending').length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center">
                      {orders.filter(o => o.status === 'Pending').length}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={loadAllData}
                className="px-3 py-2 rounded-xl bg-white/[0.03] border border-slate-800 text-slate-300 hover:text-white hover:border-[#d4af37] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refresh API Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            </div>

            {/* TAB CONTENT VIEW */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">

              {/* TAB 1: CMS (PACKAGES, PRODUCTS, TRANSPORT) */}
              {activeTab === 'cms' && (
                <div className="space-y-6">
                  
                  {/* CMS Subtab Switcher */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
                    <button
                      onClick={() => setCmsSubtab('packages')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        cmsSubtab === 'packages'
                          ? 'bg-[#d4af37]/20 border border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Hajj & Umrah Packages ({packages.length})</span>
                    </button>

                    <button
                      onClick={() => setCmsSubtab('products')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        cmsSubtab === 'products'
                          ? 'bg-[#d4af37]/20 border border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>E-Commerce Store Products ({products.length})</span>
                    </button>

                    <button
                      onClick={() => setCmsSubtab('transport')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        cmsSubtab === 'transport'
                          ? 'bg-[#d4af37]/20 border border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Fleet & Transport ({transport.vehicles?.length || 0} Vehicles • {transport.routes?.length || 0} Routes)</span>
                    </button>

                    <button
                      onClick={() => setCmsSubtab('hotels')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        cmsSubtab === 'hotels'
                          ? 'bg-[#d4af37]/20 border border-[#d4af37] text-amber-300'
                          : 'bg-white/[0.02] border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Luxury Hotels ({hotels.length} Properties)</span>
                    </button>
                  </div>

                  {/* SUBTAB A: PACKAGES MANAGER */}
                  {cmsSubtab === 'packages' && (
                    <div className="space-y-6">
                      
                      {/* Package Create/Edit Form Container */}
                      <div 
                        ref={packageFormRef}
                        className={`bg-[#0a0a0c] border rounded-2xl p-6 space-y-4 transition-all duration-300 ${
                          editingPackage 
                            ? 'border-[#d4af37] ring-2 ring-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)]' 
                            : 'border-[#d4af37]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#d4af37]" />
                            <span>{editingPackage ? 'Edit Existing Package' : 'Create New Hajj / Umrah Package'}</span>
                          </h3>
                          {editingPackage && (
                            <button
                              onClick={() => {
                                setEditingPackage(null);
                                setPackageForm({
                                  type: 'umrah',
                                  title_en: '',
                                  title_bn: '',
                                  badge_en: 'VIP Sanctum',
                                  badge_bn: 'ভিআইপি স্যাঙ্কটাম',
                                  priceBDT: 185000,
                                  priceUSD: 1540,
                                  isPopular: false,
                                  image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
                                  features_en: '',
                                  features_bn: ''
                                });
                              }}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <form onSubmit={handleSavePackage} className="space-y-6 text-xs">
                          
                          {/* PANEL 1: CORE PACKAGE ATTRIBUTES */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                              <Package className="w-4 h-4 text-[#d4af37]" />
                              <h4 className="text-sm font-serif font-bold text-white">1. Core Package Details & Pricing</h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Package Type *</label>
                                <select
                                  value={packageForm.type}
                                  onChange={(e) => setPackageForm({ ...packageForm, type: e.target.value })}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                >
                                  <option value="umrah">VIP Umrah Package</option>
                                  <option value="hajj">Royal Hajj Package</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Title (English) *</label>
                                <input
                                  type="text"
                                  required
                                  value={packageForm.title_en}
                                  onChange={(e) => setPackageForm({ ...packageForm, title_en: e.target.value })}
                                  placeholder="e.g. VIP Clock Tower Royal Suite"
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Title (বাংলা) *</label>
                                <input
                                  type="text"
                                  required
                                  value={packageForm.title_bn}
                                  onChange={(e) => setPackageForm({ ...packageForm, title_bn: e.target.value })}
                                  placeholder="যেমনঃ ভিআইপি ক্লক টাওয়ার স্যুইট"
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Price (BDT ৳) *</label>
                                <input
                                  type="number"
                                  required
                                  value={packageForm.priceBDT}
                                  onChange={(e) => setPackageForm({ 
                                    ...packageForm, 
                                    priceBDT: Number(e.target.value),
                                    priceUSD: Math.round(Number(e.target.value) / 120)
                                  })}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Badge (EN)</label>
                                <input
                                  type="text"
                                  value={packageForm.badge_en}
                                  onChange={(e) => setPackageForm({ ...packageForm, badge_en: e.target.value })}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Badge (বাংলা)</label>
                                <input
                                  type="text"
                                  value={packageForm.badge_bn}
                                  onChange={(e) => setPackageForm({ ...packageForm, badge_bn: e.target.value })}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                              <div className="sm:col-span-8">
                                <label className="text-slate-300 font-semibold block mb-1">ইমেজ লাইভ লিঙ্ক (Image Direct URL)</label>
                                <input
                                  type="url"
                                  value={packageForm.image}
                                  onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                                  placeholder="https://i.ibb.co/example/image.png"
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div className="sm:col-span-4 flex items-center gap-3 pt-2 sm:pt-5">
                                <div className="h-14 w-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
                                  {packageForm.image ? (
                                    <img
                                      src={packageForm.image}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <span className="text-[9px] text-slate-500 font-mono text-center px-1">No Image</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="isPopular"
                                    checked={packageForm.isPopular}
                                    onChange={(e) => setPackageForm({ ...packageForm, isPopular: e.target.checked })}
                                    className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                                  />
                                  <label htmlFor="isPopular" className="text-amber-300 font-semibold text-xs cursor-pointer">
                                    Popular
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* PANEL 2: HOTEL DIRECTORY MULTI-SELECT SELECTION */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#121214] border border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div>
                                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-[#d4af37]" />
                                  <span>2. Hotel Directory Binding (Makkah & Madinah)</span>
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Select hotels directly from your Hotel Management directory for the package "Hotel Proximity & Stars" tab.
                                </p>
                              </div>
                              <span className="text-xs font-mono font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 shrink-0">
                                {packageForm.selectedHotelIds?.length || 0} Hotels Linked
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Makkah Hotels Group */}
                              <div className="space-y-2.5">
                                <span className="text-xs font-serif font-bold text-[#d4af37] flex items-center gap-1.5">
                                  <span>🕋</span>
                                  <span>Makkah Al-Mukarramah Directory</span>
                                </span>
                                {hotels.filter((h) => (h.city || '').toLowerCase() === 'makkah').length === 0 ? (
                                  <div className="p-3 rounded-xl bg-white/[0.01] border border-slate-800 text-[11px] text-slate-500 italic">
                                    No Makkah hotels in directory. Register properties in the "Luxury Hotels" tab.
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {hotels
                                      .filter((h) => (h.city || '').toLowerCase() === 'makkah')
                                      .map((h) => {
                                        const isSelected = (packageForm.selectedHotelIds || []).includes(h.id);
                                        return (
                                          <div
                                            key={h.id}
                                            onClick={() => toggleHotelSelection(h.id)}
                                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                                              isSelected
                                                ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-md'
                                                : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => {}}
                                              className="mt-0.5 accent-[#d4af37] pointer-events-none"
                                            />
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between">
                                                <span className="font-serif font-bold text-white truncate">{h.name}</span>
                                                <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0 ml-1">
                                                  {h.stars || 5}★
                                                </span>
                                              </div>
                                              <div className="text-[11px] text-emerald-400 truncate mt-0.5">
                                                {h.dist || '0m Direct Courtyard'}
                                              </div>
                                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                ৳{h.nightlyBdt?.toLocaleString()} / night
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>

                              {/* Madinah Hotels Group */}
                              <div className="space-y-2.5">
                                <span className="text-xs font-serif font-bold text-emerald-400 flex items-center gap-1.5">
                                  <span>🕌</span>
                                  <span>Madinah Al-Munawwarah Directory</span>
                                </span>
                                {hotels.filter((h) => (h.city || '').toLowerCase() === 'madinah').length === 0 ? (
                                  <div className="p-3 rounded-xl bg-white/[0.01] border border-slate-800 text-[11px] text-slate-500 italic">
                                    No Madinah hotels in directory. Register properties in the "Luxury Hotels" tab.
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {hotels
                                      .filter((h) => (h.city || '').toLowerCase() === 'madinah')
                                      .map((h) => {
                                        const isSelected = (packageForm.selectedHotelIds || []).includes(h.id);
                                        return (
                                          <div
                                            key={h.id}
                                            onClick={() => toggleHotelSelection(h.id)}
                                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                                              isSelected
                                                ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-md'
                                                : 'bg-white/[0.02] border-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => {}}
                                              className="mt-0.5 accent-[#d4af37] pointer-events-none"
                                            />
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between">
                                                <span className="font-serif font-bold text-white truncate">{h.name}</span>
                                                <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0 ml-1">
                                                  {h.stars || 5}★
                                                </span>
                                              </div>
                                              <div className="text-[11px] text-emerald-400 truncate mt-0.5">
                                                {h.dist || '0m Courtyard'}
                                              </div>
                                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                ৳{h.nightlyBdt?.toLocaleString()} / night
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* PANEL 3: FLIGHT DETAILS & LUGGAGE ALLOWANCE */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#121214] border border-slate-800 space-y-4">
                            <div className="border-b border-slate-800 pb-2">
                              <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                                <Plane className="w-4 h-4 text-[#d4af37]" />
                                <span>3. Flight Details & Baggage Allowances</span>
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Configure flight carrier tier, route, aircraft model, and luggage specifications shown in package details.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Flight Tier / Carrier *</label>
                                <input
                                  type="text"
                                  value={packageForm.flightTier}
                                  onChange={(e) => setPackageForm({ ...packageForm, flightTier: e.target.value })}
                                  placeholder="e.g. Direct Flight - Saudia / Biman VIP"
                                  className="w-full bg-[#18181c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Baggage / Luggage Allowance *</label>
                                <input
                                  type="text"
                                  value={packageForm.flightLuggage}
                                  onChange={(e) => setPackageForm({ ...packageForm, flightLuggage: e.target.value })}
                                  placeholder="e.g. 2x 23kg Check-in (46kg) + 7kg Cabin + 5L Zamzam"
                                  className="w-full bg-[#18181c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Flight Route</label>
                                <input
                                  type="text"
                                  value={packageForm.flightRoute}
                                  onChange={(e) => setPackageForm({ ...packageForm, flightRoute: e.target.value })}
                                  placeholder="e.g. Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)"
                                  className="w-full bg-[#18181c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Aircraft Model</label>
                                <input
                                  type="text"
                                  value={packageForm.flightAircraft}
                                  onChange={(e) => setPackageForm({ ...packageForm, flightAircraft: e.target.value })}
                                  placeholder="e.g. Boeing 787-9 Dreamliner / Boeing 777-300ER"
                                  className="w-full bg-[#18181c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* PANEL 4: DYNAMIC DAY-BY-DAY JOURNEY ITINERARY BUILDER */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#121214] border border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div>
                                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                                  <span>4. Dynamic Day-by-Day Journey Itinerary Builder ({packageForm.itinerary?.length || 0} Days)</span>
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Add, modify, or remove days for the journey itinerary tab. Supports full English and Bengali titles and descriptions.
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPackageForm((prev) => ({ ...prev, itinerary: DEFAULT_ITINERARY_TEMPLATE }))}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-slate-800 text-xs font-serif font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                                  title="Reset to 10-day template"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>Load Template</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={handleAddItineraryDay}
                                  className="px-3.5 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#080809] border border-[#d4af37]/40 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Day</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                              {(packageForm.itinerary || []).map((step, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-[#18181c] border border-slate-800 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Day Tag:</span>
                                      <input
                                        type="text"
                                        value={step.day}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'day', e.target.value)}
                                        placeholder="Day 1"
                                        className="w-24 bg-[#121214] border border-slate-800 rounded-lg px-2 py-1 text-white font-mono font-bold text-xs focus:border-[#d4af37]"
                                      />
                                      <input
                                        type="text"
                                        value={step.day_bn || ''}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'day_bn', e.target.value)}
                                        placeholder="দিন ১"
                                        className="w-24 bg-[#121214] border border-slate-800 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold text-xs focus:border-[#d4af37]"
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteItineraryDay(idx)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                                      title="Remove this day"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] text-slate-400 block mb-1">Day Title (English)</label>
                                      <input
                                        type="text"
                                        value={step.title}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'title', e.target.value)}
                                        placeholder="e.g. Dhaka Departure & Royal Jeddah Arrival"
                                        className="w-full bg-[#121214] border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium text-xs focus:border-[#d4af37]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] text-slate-400 block mb-1">Day Title (বাংলা)</label>
                                      <input
                                        type="text"
                                        value={step.title_bn || ''}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'title_bn', e.target.value)}
                                        placeholder="যেমনঃ ঢাকা ত্যাগ ও জেদ্দা রাজকীয় আগমন"
                                        className="w-full bg-[#121214] border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium text-xs focus:border-[#d4af37]"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] text-slate-400 block mb-1">Description (English)</label>
                                      <textarea
                                        rows={2}
                                        value={step.desc}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'desc', e.target.value)}
                                        placeholder="Detailed description of itinerary activities, prayers, and transfers..."
                                        className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:border-[#d4af37]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] text-slate-400 block mb-1">Description (বাংলা)</label>
                                      <textarea
                                        rows={2}
                                        value={step.desc_bn || ''}
                                        onChange={(e) => handleUpdateItineraryDay(idx, 'desc_bn', e.target.value)}
                                        placeholder="দিনটির কার্যক্রম, ইবাদত ও সফর বিবরণ..."
                                        className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:border-[#d4af37]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* PANEL 5: WHITE-GLOVE INCLUSIONS & AMENITIES CHECKLIST */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#121214] border border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div>
                                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                                  <span>5. White-Glove Inclusions & Privileges ({packageForm.inclusions?.length || 0})</span>
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Custom inclusions shown in the "Included Amenities" breakdown modal.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddInclusion()}
                                className="px-3.5 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#080809] border border-[#d4af37]/40 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Inclusion</span>
                              </button>
                            </div>

                            {/* Quick Add Suggestions Chips */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Quick Suggestions:</span>
                              {[
                                { title: 'VIP Rawdah Priority Permit', title_bn: 'নুসুক ভিআইপি রওজা পারমিট', desc: 'Guaranteed fast-track Rawdah Sharif reservation.' },
                                { title: '1-on-1 Senior Scholar Moallim', title_bn: '১-অন-১ অভিজ্ঞ আলেম মোয়াল্লিম গাইড', desc: 'Dedicated Bengali scholar guide throughout rituals.' },
                                { title: '5L Zamzam Home Delivery in Dhaka', title_bn: 'ঢাকায় বাসায় ৫ লিটার জমজম ডেলিভারি', desc: 'Official sealed Zamzam delivered to your residence.' },
                                { title: 'CIP Airport Fast-Track Immigration', title_bn: 'সিআইপি বিমানবন্দর ফাস্ট-ট্র্যাক ইমিগ্রেশন', desc: 'Diplomatic line clearance and CIP lounge access.' },
                                { title: 'Private GMC Yukon Chauffeur', title_bn: 'প্রাইভেট জিএমসি ইউকন শফার কার', desc: 'Luxury private SUV for airport and intercity transfers.' },
                                { title: '24/7 Dedicated Butler Service', title_bn: '২৪/৭ ডেডিকেটেড বাটলার ও রুম সার্ভিস', desc: 'Round-the-clock room dining and private hospitality.' }
                              ].map((chip, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleAddInclusion(chip.title, chip.title_bn, chip.desc)}
                                  className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#d4af37] border border-slate-800 text-[10px] font-medium transition-colors cursor-pointer"
                                >
                                  + {chip.title}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                              {(packageForm.inclusions || []).map((inc, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-[#18181c] border border-slate-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-[#d4af37]">Privilege #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteInclusion(idx)}
                                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                      title="Remove inclusion"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={inc.title}
                                      onChange={(e) => handleUpdateInclusion(idx, 'title', e.target.value)}
                                      placeholder="Privilege Title (English)"
                                      className="w-full bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:border-[#d4af37]"
                                    />
                                    <input
                                      type="text"
                                      value={inc.title_bn || ''}
                                      onChange={(e) => handleUpdateInclusion(idx, 'title_bn', e.target.value)}
                                      placeholder="সুবিধার শিরোনাম (বাংলা)"
                                      className="w-full bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:border-[#d4af37]"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={inc.desc}
                                      onChange={(e) => handleUpdateInclusion(idx, 'desc', e.target.value)}
                                      placeholder="Description (English)"
                                      className="w-full bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:border-[#d4af37]"
                                    />
                                    <input
                                      type="text"
                                      value={inc.desc_bn || ''}
                                      onChange={(e) => handleUpdateInclusion(idx, 'desc_bn', e.target.value)}
                                      placeholder="বিবরণ (বাংলা)"
                                      className="w-full bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:border-[#d4af37]"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Front Card Highlights (Checklist) */}
                            <div className="pt-3 border-t border-slate-800/80 space-y-2">
                              <span className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                                Front Card Checklist Highlights (Shown on Homepage Card)
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-slate-400 block mb-1">Checklist EN (1 bullet per line)</label>
                                  <textarea
                                    rows={3}
                                    value={packageForm.features_en}
                                    onChange={(e) => setPackageForm({ ...packageForm, features_en: e.target.value })}
                                    className="w-full bg-[#18181c] border border-slate-800 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none font-sans"
                                    placeholder="VIP Visa&#10;Direct Flight&#10;5-Star Hotel"
                                  />
                                </div>

                                <div>
                                  <label className="text-slate-400 block mb-1">Checklist BN (1 bullet per line)</label>
                                  <textarea
                                    rows={3}
                                    value={packageForm.features_bn}
                                    onChange={(e) => setPackageForm({ ...packageForm, features_bn: e.target.value })}
                                    className="w-full bg-[#18181c] border border-slate-800 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none font-sans"
                                    placeholder="ভিআইপি ভিসা&#10;সরাসরি ফ্লাইট&#10;৫ তারকা হোটেল"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                            {editingPackage && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPackage(null);
                                  resetPackageForm();
                                }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-serif font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-colors cursor-pointer"
                              >
                                Cancel Editing
                              </button>
                            )}

                            <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                              <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-kiswah-gold text-[#080809] font-serif font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover hover:scale-[1.01] transition-all"
                              >
                                <Save className="w-4 h-4" />
                                <span>{editingPackage ? 'Save Package Changes' : 'Publish New Package'}</span>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* Package Cards List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-[#0a0a0c] border border-slate-800 hover:border-[#d4af37]/50 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xl"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase font-bold">
                                  {pkg.type.toUpperCase()} • {pkg.badge_en}
                                </span>
                                {pkg.isPopular && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                                    Popular
                                  </span>
                                )}
                              </div>

                              <h4 className="font-serif font-bold text-base text-white">{pkg.title_en}</h4>
                              <p className="text-xs text-amber-300 font-medium">{pkg.title_bn}</p>

                              <div className="text-lg font-serif font-bold text-kiswah-gold">
                                ৳{pkg.priceBDT?.toLocaleString('en-IN')}
                              </div>

                              <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                                {Array.isArray(pkg.features_en) && pkg.features_en.slice(0, 3).map((f, i) => (
                                  <div key={i} className="flex items-center gap-1.5 truncate">
                                    <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                                    <span className="truncate">{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  startEditPackage(pkg, e);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeletePackage(pkg.id, e);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* SUBTAB B: STORE PRODUCTS MANAGER */}
                  {cmsSubtab === 'products' && (
                    <div className="space-y-6">
                      
                      {/* Product Form Container */}
                      <div 
                        ref={productFormRef}
                        className={`bg-[#0a0a0c] border rounded-2xl p-6 space-y-4 transition-all duration-300 ${
                          editingProduct 
                            ? 'border-[#d4af37] ring-2 ring-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)]' 
                            : 'border-[#d4af37]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                            <span>{editingProduct ? 'Edit Store Product' : 'Add New Pilgrim Essential Product'}</span>
                          </h3>
                          {editingProduct && (
                            <button
                              onClick={() => {
                                setEditingProduct(null);
                                setProductForm({
                                  name_en: '',
                                  name_bn: '',
                                  priceBDT: 3500,
                                  priceUSD: 30,
                                  category: 'ihram',
                                  tag: 'Essential',
                                  stock: 50,
                                  image: '',
                                  description_en: '',
                                  description_bn: ''
                                });
                              }}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Product Name (EN) *</label>
                              <input
                                type="text"
                                required
                                value={productForm.name_en}
                                onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                                placeholder="e.g. Certified 5L Zamzam Water"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Product Name (বাংলা) *</label>
                              <input
                                type="text"
                                required
                                value={productForm.name_bn}
                                onChange={(e) => setProductForm({ ...productForm, name_bn: e.target.value })}
                                placeholder="যেমনঃ সার্টিফাইড ৫ লিটার জমজম পানি"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-slate-300 font-semibold block">Category *</label>
                                <button
                                  type="button"
                                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                  className="text-[11px] text-[#d4af37] hover:underline font-medium cursor-pointer"
                                >
                                  {isCreatingCategory ? 'বাতিল' : '+ নতুন ক্যাটাগরি'}
                                </button>
                              </div>

                              {!isCreatingCategory ? (
                                <select
                                  value={productForm.category}
                                  onChange={(e) => {
                                    if (e.target.value === '__new__') {
                                      setIsCreatingCategory(true);
                                    } else {
                                      setProductForm({ ...productForm, category: e.target.value });
                                    }
                                  }}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.labelEn} {c.labelBn ? `(${c.labelBn})` : ''}
                                    </option>
                                  ))}
                                  <option value="__new__" className="text-amber-300 font-bold bg-[#1a1a1f]">
                                    + নতুন ক্যাটাগরি যোগ করুন (Add New Category)...
                                  </option>
                                </select>
                              ) : (
                                <div className="p-3 bg-[#0a0a0c] border border-[#d4af37]/40 rounded-xl space-y-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={newCatEn}
                                      onChange={(e) => setNewCatEn(e.target.value)}
                                      placeholder="Category Name (EN)"
                                      className="bg-[#121214] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                    />
                                    <input
                                      type="text"
                                      value={newCatBn}
                                      onChange={(e) => setNewCatBn(e.target.value)}
                                      placeholder="ক্যাটাগরি নাম (বাংলা)"
                                      className="bg-[#121214] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingCategory(false)}
                                      className="px-2.5 py-1 text-slate-400 hover:text-white text-[11px] cursor-pointer"
                                    >
                                      বাতিল
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCreateCategory}
                                      className="px-3 py-1 bg-kiswah-gold text-[#080809] font-serif font-bold text-[11px] rounded-lg cursor-pointer"
                                    >
                                      যোগ করুন
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Price (BDT ৳) *</label>
                              <input
                                type="number"
                                required
                                value={productForm.priceBDT}
                                onChange={(e) => setProductForm({ 
                                  ...productForm, 
                                  priceBDT: Number(e.target.value),
                                  priceUSD: Math.round(Number(e.target.value) / 120)
                                })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Stock Level Quantity</label>
                              <input
                                type="number"
                                min={0}
                                value={productForm.stock}
                                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-slate-300 font-semibold block">Product Tag</label>
                                <button
                                  type="button"
                                  onClick={() => setIsCreatingTag(!isCreatingTag)}
                                  className="text-[11px] text-[#d4af37] hover:underline font-medium cursor-pointer"
                                >
                                  {isCreatingTag ? 'বাতিল' : '+ নতুন ট্যাগ'}
                                </button>
                              </div>

                              {!isCreatingTag ? (
                                <select
                                  value={productForm.tag}
                                  onChange={(e) => {
                                    if (e.target.value === '__new__') {
                                      setIsCreatingTag(true);
                                    } else {
                                      setProductForm({ ...productForm, tag: e.target.value });
                                    }
                                  }}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                >
                                  {tags.map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  ))}
                                  <option value="__new__" className="text-amber-300 font-bold bg-[#1a1a1f]">
                                    + নতুন ট্যাগ যোগ করুন (Add New Tag)...
                                  </option>
                                </select>
                              ) : (
                                <div className="p-3 bg-[#0a0a0c] border border-[#d4af37]/40 rounded-xl space-y-2">
                                  <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="New Tag Name (e.g. Luxury, Best Deal)"
                                    className="w-full bg-[#121214] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingTag(false)}
                                      className="px-2.5 py-1 text-slate-400 hover:text-white text-[11px] cursor-pointer"
                                    >
                                      বাতিল
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCreateTag}
                                      className="px-3 py-1 bg-kiswah-gold text-[#080809] font-serif font-bold text-[11px] rounded-lg cursor-pointer"
                                    >
                                      যোগ করুন
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-9">
                              <label className="text-slate-300 font-semibold block mb-1">ইমেজ লাইভ লিঙ্ক (Image Direct URL)</label>
                              <input
                                type="url"
                                value={productForm.image}
                                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                placeholder="https://i.ibb.co/example/image.png"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3 flex items-center gap-3 pt-2 sm:pt-5">
                              <div className="h-14 w-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
                                {productForm.image ? (
                                  <img
                                    src={productForm.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                ) : (
                                  <span className="text-[9px] text-slate-500 font-mono text-center px-1">No Image</span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">লাইভ প্রিভিউ</span>
                            </div>
                          </div>

                          {/* DYNAMIC SPECIFICATIONS & SHARIAH CERTIFICATION BUILDER (MAX 4) */}
                          <div className="p-4 rounded-2xl bg-[#121214] border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div>
                                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                                  <span>পণ্যটির বিশদ বিবরণ ও শরীয়াহ সনদ (Dynamic Specifications & Certification)</span>
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Add up to 4 distinct specification bullet points displayed inside the customer-facing Product Details modal.
                                </p>
                              </div>
                              <span className="text-[11px] font-mono text-amber-300 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 shrink-0">
                                {(productForm.specifications || []).length} / 4
                              </span>
                            </div>

                            <div className="space-y-2 pt-1">
                              {(productForm.specifications || []).map((spec, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="text-amber-400 font-mono font-bold text-xs w-6 shrink-0 text-center">
                                    #{idx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={spec}
                                    onChange={(e) => handleUpdateSpecification(idx, e.target.value)}
                                    placeholder={`e.g. Specification Point #${idx + 1} (e.g. 100% Egyptian Cotton / Shariah Compliant)`}
                                    className="flex-1 bg-[#0a0a0c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecification(idx)}
                                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-500/30 cursor-pointer transition-colors shrink-0"
                                    title="Delete specification"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {(productForm.specifications || []).length < 4 && (
                                <button
                                  type="button"
                                  onClick={handleAddSpecification}
                                  className="mt-2 px-3.5 py-1.5 bg-white/[0.04] hover:bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] rounded-xl font-serif text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ বৈশিষ্ট্য যোগ করুন (Add Specification) - ({4 - (productForm.specifications || []).length} slots remaining)</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                            >
                              <Save className="w-4 h-4" />
                              <span>{editingProduct ? 'Save Product Details' : 'Publish Product to Store'}</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Products Inventory Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-[#0a0a0c] border border-slate-800 hover:border-[#d4af37]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase font-bold">
                                  {prod.category}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 font-semibold border border-slate-700">
                                  {prod.tag}
                                </span>
                              </div>

                              <h4 className="font-serif font-bold text-sm text-white">{prod.name_en}</h4>
                              <p className="text-xs text-amber-300">{prod.name_bn}</p>

                              <div className="flex items-baseline justify-between pt-1">
                                <span className="text-base font-serif font-bold text-kiswah-gold">
                                  ৳{prod.priceBDT?.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {/* Stock Controller */}
                              <div className="bg-[#121214] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">Available Stock:</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUpdateStock(prod.id, (prod.stock || 0) - 1)}
                                    className="w-6 h-6 rounded bg-[#080809] border border-slate-700 text-amber-300 font-bold hover:text-white"
                                  >-</button>
                                  <span className="font-mono font-bold text-white px-1.5">{prod.stock || 0}</span>
                                  <button
                                    onClick={() => handleUpdateStock(prod.id, (prod.stock || 0) + 5)}
                                    className="w-6 h-6 rounded bg-[#080809] border border-slate-700 text-amber-300 font-bold hover:text-white"
                                  >+</button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  startEditProduct(prod, e);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteProduct(prod.id, e);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* SUBTAB C: TRANSPORT & FLEET ROUTES & VEHICLES MANAGER */}
                  {cmsSubtab === 'transport' && (
                    <div className="space-y-6">
                      
                      {/* Section Header with Segmented Navigation (Vehicles vs Routes) */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0c] border border-slate-800 p-4 sm:p-5 rounded-2xl">
                        <div>
                          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#d4af37]" />
                            <span>প্রাইভেট ট্রান্সপোর্ট ও ভিআইপি ফ্লিট কন্ট্রোল (Private Transport & VIP Fleet CMS)</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 font-light">
                            {transportView === 'vehicles'
                              ? 'Manage luxury vehicle models, passenger capacity, luggage allowance, live image links, and operational maintenance status.'
                              : 'Manage transport routes, luxury fleet allocations, and direct BDT pricing for airport transfers, intercity journeys, and ziyarah excursions.'}
                          </p>
                        </div>

                        {/* Segment Toggle & Add Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center bg-[#080809] border border-slate-800 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => setTransportView('vehicles')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                transportView === 'vehicles'
                                  ? 'bg-kiswah-gold text-[#080809] shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <Car className="w-3.5 h-3.5" />
                              <span>ফ্লিট ও যানবাহন ({transport.vehicles?.length || 0})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTransportView('routes')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                transportView === 'routes'
                                  ? 'bg-kiswah-gold text-[#080809] shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>ট্রান্সপোর্ট রুট ({transport.routes?.length || 0})</span>
                            </button>
                          </div>

                          {transportView === 'vehicles' ? (
                            <button
                              type="button"
                              onClick={openAddVehicleModal}
                              className="px-4 py-2.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                            >
                              <Plus className="w-4 h-4" />
                              <span>+ নতুন যানবাহন যোগ করুন / Add Vehicle</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={openAddRouteModal}
                              className="px-4 py-2.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                            >
                              <Plus className="w-4 h-4" />
                              <span>+ নতুন রুট যোগ করুন / Add Route</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* VIEW 1: FLEET & VEHICLES MANAGEMENT (CARDS GRID) */}
                      {transportView === 'vehicles' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                            <span className="font-mono">
                              Total Registered Vehicles: <strong className="text-[#d4af37]">{transport.vehicles?.length || 0}</strong>
                            </span>
                            <span className="text-[11px] text-slate-500 italic">
                              Live updates seamlessly bind to public Transport Showcase and Route dropdowns.
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(transport.vehicles || []).map((veh) => {
                              const isMaint = veh.status === 'maintenance';
                              const vehImg = veh.imageUrl || veh.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                              const features = (Array.isArray(veh.featuresEn) && veh.featuresEn.length > 0)
                                ? veh.featuresEn
                                : (Array.isArray(veh.features) ? veh.features : []);

                              return (
                                <div
                                  key={veh.id}
                                  className="bg-[#0a0a0c] border border-slate-800 hover:border-[#d4af37]/60 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl overflow-hidden group transition-all"
                                >
                                  <div className="space-y-3">
                                    {/* Image with Badges */}
                                    <div className="h-44 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800/80">
                                      <img
                                        src={vehImg}
                                        alt={veh.nameEn || veh.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                      {/* Top Badges */}
                                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                                        <span className="px-2.5 py-1 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase shadow-md">
                                          {veh.category || veh.categoryEn || 'VIP Vehicle'}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleToggleVehicleStatus(veh, e);
                                          }}
                                          title="Click to toggle status"
                                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                            isMaint
                                              ? 'bg-amber-950 text-amber-300 border-amber-500/50 hover:bg-amber-900'
                                              : 'bg-emerald-950 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                                          }`}
                                        >
                                          {isMaint ? 'Maintenance' : 'Active'}
                                        </button>
                                      </div>

                                      {/* Bottom Capacity Pills */}
                                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                                        <span className="flex items-center gap-1.5 bg-black/75 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 font-mono">
                                          <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                                          <span>{veh.passengers} Guests</span>
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-black/75 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 font-mono">
                                          <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
                                          <span>{veh.luggage} Luggage</span>
                                        </span>
                                      </div>
                                    </div>

                                    {/* Vehicle Name */}
                                    <div>
                                      <h4 className="font-serif font-bold text-base text-white leading-snug">
                                        {veh.nameEn || veh.name}
                                      </h4>
                                      {veh.nameBn && (
                                        <p className="text-xs text-amber-300 font-sans mt-0.5">{veh.nameBn}</p>
                                      )}
                                    </div>

                                    {/* Features Checklist */}
                                    <div className="space-y-1 pt-1 border-t border-slate-800/80">
                                      <span className="text-[10px] font-serif font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        Amenities:
                                      </span>
                                      <div className="space-y-1 text-[11px] text-slate-300">
                                        {features.slice(0, 4).map((f, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-slate-300">
                                            <CheckCircle2 className="w-3 h-3 text-[#d4af37] shrink-0" />
                                            <span className="truncate">{f}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleVehicleStatus(veh, e);
                                      }}
                                      className={`text-[11px] font-mono px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                                        isMaint 
                                          ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40' 
                                          : 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                                      }`}
                                    >
                                      {isMaint ? 'Mark Active' : 'Mark Maintenance'}
                                    </button>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          startEditVehicle(veh, e);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#d4af37] text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteVehicle(veh.id, e);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: TRANSPORT ROUTES & RATES (TABLE VIEW) */}
                      {transportView === 'routes' && (
                        <div className="space-y-4">
                          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0a0a0c] shadow-2xl">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-[#121214] text-amber-300 font-serif font-bold border-b border-slate-800">
                                  <tr>
                                    <th className="p-3.5">রুট ও গন্তব্য (Route Name)</th>
                                    <th className="p-3.5">যানবাহন / ফ্লিট (Assigned Fleet)</th>
                                    <th className="p-3.5">মূল্য (Price in BDT ৳)</th>
                                    <th className="p-3.5">দূরত্ব / সময়কাল (Distance)</th>
                                    <th className="p-3.5 text-right">অ্যাকশন (Actions)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300">
                                  {transport.routes.map((route) => {
                                    const priceBDT = route.priceBDT !== undefined ? route.priceBDT : Math.round((route.finalPriceSAR || 1600) * 33);
                                    return (
                                      <tr key={route.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3.5">
                                          <span className="font-semibold text-white text-sm block">{route.nameEn}</span>
                                          <span className="text-xs text-amber-300 block font-sans">{route.nameBn}</span>
                                        </td>
                                        <td className="p-3.5">
                                          <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 text-xs font-mono font-bold uppercase inline-block">
                                            {route.vehicleType || route.typeEn || 'GMC Yukon VIP'}
                                          </span>
                                        </td>
                                        <td className="p-3.5">
                                          <span className="font-serif font-bold text-kiswah-gold text-base block">
                                            ৳{Number(priceBDT).toLocaleString('en-IN')}/-
                                          </span>
                                        </td>
                                        <td className="p-3.5 font-mono text-slate-400">
                                          {route.distanceEn || 'Express Route'}
                                        </td>
                                        <td className="p-3.5 text-right">
                                          <div className="inline-flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                startEditRoute(route, e);
                                              }}
                                              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-[#d4af37] border border-slate-700 hover:border-[#d4af37]/50 rounded-xl font-serif text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                              <span>Edit</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteRoute(route.id, e);
                                              }}
                                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-500/30 rounded-xl font-serif text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                              <span>Delete</span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* SUBTAB D: HOTEL MANAGEMENT MODULE */}
                  {cmsSubtab === 'hotels' && (
                    <div className="space-y-6">
                      
                      {/* Hotel Form (Create / Edit) */}
                      <div 
                        ref={hotelFormRef}
                        className={`bg-[#0a0a0c] border rounded-2xl p-6 space-y-4 transition-all duration-300 ${
                          editingHotel 
                            ? 'border-[#d4af37] ring-2 ring-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)]' 
                            : 'border-[#d4af37]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#d4af37]" />
                            <span>{editingHotel ? 'Edit Luxury Hotel Property' : 'Register New Luxury Hotel (Makkah / Madinah)'}</span>
                          </h3>
                          {editingHotel && (
                            <button
                              onClick={() => {
                                setEditingHotel(null);
                                setHotelForm({
                                  name: '',
                                  nameBn: '',
                                  city: 'Makkah',
                                  dist: '0m - Courtyard Direct',
                                  distBn: '০ মিটার - সরাসরি হারাম চত্বর',
                                  stars: 5,
                                  starRating: '5-Star VIP',
                                  nightlyBdt: 120000,
                                  nightlyUsd: 1000,
                                  features: "Direct Haram Courtyard Access\nLive Kaaba Audio Feed in Suite\n24/7 Dedicated Private Butler\nRoyal Buffet Dining",
                                  image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
                                });
                              }}
                              className="text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <form onSubmit={handleSaveHotel} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Property Name (English) *</label>
                              <input
                                type="text"
                                required
                                value={hotelForm.name}
                                onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                                placeholder="e.g. Raffles Makkah Palace"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Property Name (বাংলা) *</label>
                              <input
                                type="text"
                                required
                                value={hotelForm.nameBn}
                                onChange={(e) => setHotelForm({ ...hotelForm, nameBn: e.target.value })}
                                placeholder="যেমনঃ র‍্যাফেলস মক্কা প্যালেস"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-slate-300 font-semibold block">Holy Sanctuary City *</label>
                                <button
                                  type="button"
                                  onClick={() => setIsCreatingCity(!isCreatingCity)}
                                  className="text-[11px] text-[#d4af37] hover:underline font-medium cursor-pointer"
                                >
                                  {isCreatingCity ? 'বাতিল' : '+ নতুন শহর'}
                                </button>
                              </div>

                              {!isCreatingCity ? (
                                <select
                                  value={hotelForm.city}
                                  onChange={(e) => {
                                    if (e.target.value === '__new__') {
                                      setIsCreatingCity(true);
                                    } else {
                                      setHotelForm({ ...hotelForm, city: e.target.value });
                                    }
                                  }}
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                >
                                  {cities.map((ct) => (
                                    <option key={ct} value={ct}>
                                      {ct === 'Makkah' ? 'Makkah Al-Mukarramah' : ct === 'Madinah' ? 'Madinah Al-Munawwarah' : ct}
                                    </option>
                                  ))}
                                  <option value="__new__" className="text-amber-300 font-bold bg-[#1a1a1f]">
                                    + নতুন শহর যোগ করুন (Add New City)...
                                  </option>
                                </select>
                              ) : (
                                <div className="p-3 bg-[#0a0a0c] border border-[#d4af37]/40 rounded-xl space-y-2">
                                  <input
                                    type="text"
                                    value={newCityName}
                                    onChange={(e) => setNewCityName(e.target.value)}
                                    placeholder="New City Name (e.g. Jeddah, Taif)"
                                    className="w-full bg-[#121214] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingCity(false)}
                                      className="px-2.5 py-1 text-slate-400 hover:text-white text-[11px] cursor-pointer"
                                    >
                                      বাতিল
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCreateCity}
                                      className="px-3 py-1 bg-kiswah-gold text-[#080809] font-serif font-bold text-[11px] rounded-lg cursor-pointer"
                                    >
                                      যোগ করুন
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Distance from Courtyard *</label>
                              <input
                                type="text"
                                required
                                value={hotelForm.dist}
                                onChange={(e) => setHotelForm({ ...hotelForm, dist: e.target.value })}
                                placeholder="e.g. 0m - Courtyard Direct"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Star Tier Rating</label>
                              <select
                                value={hotelForm.starRating}
                                onChange={(e) => setHotelForm({ ...hotelForm, starRating: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="5-Star VIP">5-Star VIP</option>
                                <option value="4-Star Executive">4-Star Executive</option>
                                <option value="3-Star Standard">3-Star Standard</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Nightly Rate (BDT ৳) *</label>
                              <input
                                type="number"
                                required
                                value={hotelForm.nightlyBdt}
                                onChange={(e) => setHotelForm({ 
                                  ...hotelForm, 
                                  nightlyBdt: Number(e.target.value),
                                  nightlyUsd: Math.round(Number(e.target.value) / 120)
                                })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Key Inclusions & Features (One per line) *</label>
                              <textarea
                                rows={3}
                                required
                                value={hotelForm.features}
                                onChange={(e) => setHotelForm({ ...hotelForm, features: e.target.value })}
                                placeholder="Panoramic Kaaba View&#10;Private 24-hr Dedicated Butler&#10;Live Haram Audio Feed in Suite&#10;Gourmet Buffet Dining"
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">ইমেজ লাইভ লিঙ্ক (Image Direct URL)</label>
                              <div className="flex items-start gap-3">
                                <input
                                  type="url"
                                  value={hotelForm.image}
                                  onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
                                  placeholder="https://i.ibb.co/example/image.png"
                                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                                <div className="h-16 w-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
                                  {hotelForm.image ? (
                                    <img
                                      src={hotelForm.image}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <span className="text-[9px] text-slate-500 font-mono text-center px-1">No Image</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                            >
                              <Save className="w-4 h-4" />
                              <span>{editingHotel ? 'Update Hotel Property' : 'Save & Publish Hotel'}</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* City Filter Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {['all', ...cities.map(c => c.toLowerCase())].map((cityKey) => {
                          const count = cityKey === 'all' 
                            ? hotels.length 
                            : hotels.filter(h => h.city?.toLowerCase() === cityKey).length;
                          const label = cityKey === 'all' 
                            ? `All Hotels (${count})` 
                            : `${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)} (${count})`;

                          return (
                            <button
                              key={cityKey}
                              onClick={() => setHotelCityFilter(cityKey)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                                hotelCityFilter === cityKey
                                  ? 'bg-kiswah-gold text-[#080809] shadow-md font-bold'
                                  : 'bg-white/[0.03] border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hotel Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotels
                          .filter(h => hotelCityFilter === 'all' || h.city?.toLowerCase() === hotelCityFilter.toLowerCase())
                          .map((htl) => (
                            <div
                              key={htl.id}
                              className="bg-[#0a0a0c] border border-slate-800 hover:border-[#d4af37]/50 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl overflow-hidden group"
                            >
                              <div className="space-y-3">
                                {htl.image && (
                                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                                    <img src={htl.image} alt={htl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-full bg-kiswah-gold text-[#080809] font-serif font-extrabold text-[10px] uppercase">
                                        {htl.city}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-[#d4af37]/30 text-[10px] font-mono">
                                        {htl.starRating || `${htl.stars}-Star`}
                                      </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300">
                                      📍 {htl.dist}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-serif font-bold text-base text-white">{htl.name}</h4>
                                  {htl.nameBn && <p className="text-xs text-amber-300 font-medium">{htl.nameBn}</p>}
                                </div>

                                <div className="space-y-1 text-[11px] text-slate-300">
                                  {(Array.isArray(htl.features) ? htl.features : []).slice(0, 3).map((f, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-slate-400">
                                      <CheckCircle2 className="w-3 h-3 text-[#d4af37] shrink-0" />
                                      <span className="truncate">{f}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                                  <span className="text-[10px] text-slate-400 uppercase font-mono">Nightly Rate:</span>
                                  <span className="text-base font-serif font-bold text-kiswah-gold">
                                    ৳{Number(htl.nightlyBdt || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    startEditHotel(htl, e);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteHotel(htl.id, e);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: ORDERS & CUSTOMER MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  {/* Orders Filter & Search Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0c] border border-slate-800 p-4 rounded-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {['All', 'Pending', 'Processing', 'Dispatched', 'Completed'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOrderStatusFilter(st);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            orderStatusFilter === st
                              ? 'bg-kiswah-gold text-[#080809] shadow-md'
                              : 'bg-white/[0.03] border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st} ({st === 'All' ? orders.length : orders.filter(o => o.status === st).length})
                        </button>
                      ))}
                    </div>

                    <div className="w-full sm:w-64">
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search name, phone, order ID..."
                        className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0a0a0c]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#121214] text-amber-300 font-serif font-bold border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Reference ID & Type</th>
                            <th className="p-3.5">Customer Contact</th>
                            <th className="p-3.5">Requested Items / Package</th>
                            <th className="p-3.5">Total Valuation</th>
                            <th className="p-3.5">Status Updater</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500">
                                No customer orders or VIP dossiers match your criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((ord) => {
                              const cleanPhone = (ord.customerPhone || '').replace(/[^0-9]/g, '');
                              const waMessage = encodeURIComponent(
                                `Assalamu Alaikum ${ord.customerName}. Regarding your LabbaikHorizon inquiry (Ref: ${ord.id}): Our Private Client Desk is at your service.`
                              );

                              return (
                                <tr key={ord.id} className="hover:bg-white/[0.01]">
                                  <td className="p-3.5">
                                    <span className="font-mono font-bold text-white block">{ord.id}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                                      ord.type === 'vip_dossier' 
                                        ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30' 
                                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                      {ord.type === 'vip_dossier' ? 'VIP DOSSIER' : 'STORE PURCHASE'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 block mt-1">
                                      {new Date(ord.createdAt).toLocaleDateString()}
                                    </span>
                                  </td>

                                  <td className="p-3.5">
                                    <span className="font-semibold text-white block">{ord.customerName}</span>
                                    <span className="text-amber-300 font-mono text-[11px] block">{ord.customerPhone}</span>
                                    {ord.deliveryAddress && (
                                      <span className="text-slate-300 text-[10px] block mt-1 flex items-start gap-1">
                                        <MapPin className="w-3 h-3 text-[#d4af37] shrink-0 mt-0.5" />
                                        <span className="truncate max-w-[200px]" title={ord.deliveryAddress}>{ord.deliveryAddress}</span>
                                      </span>
                                    )}
                                    {ord.paymentMethod && (
                                      <span className="text-emerald-400 font-mono text-[10px] block mt-0.5">
                                        Pay: {ord.paymentMethod} {ord.shippingFee ? `(+৳${ord.shippingFee})` : ''}
                                      </span>
                                    )}
                                    {ord.customerEmail && <span className="text-slate-400 text-[10px] block">{ord.customerEmail}</span>}
                                  </td>

                                  <td className="p-3.5">
                                    <div className="space-y-1">
                                      {Array.isArray(ord.items) && ord.items.map((it, idx) => (
                                        <div key={idx} className="text-slate-300 font-medium">
                                          • {it.name} <span className="text-amber-300 font-mono">(x{it.quantity || 1})</span>
                                        </div>
                                      ))}
                                      {ord.notes && (
                                        <p className="text-[10px] text-slate-400 italic">Notes: "{ord.notes}"</p>
                                      )}
                                    </div>
                                  </td>

                                  <td className="p-3.5">
                                    <span className="font-serif font-bold text-kiswah-gold text-sm block">
                                      ৳{ord.totalBDT?.toLocaleString('en-IN')}
                                    </span>
                                  </td>

                                  <td className="p-3.5">
                                    <select
                                      value={ord.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleUpdateOrderStatus(ord.id, e.target.value, e);
                                      }}
                                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all ${
                                        ord.status === 'Completed'
                                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                                          : ord.status === 'Dispatched'
                                          ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                                          : ord.status === 'Processing'
                                          ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                                          : 'bg-amber-950 text-amber-300 border-amber-500/50'
                                      }`}
                                    >
                                      <option value="Pending">Pending Review</option>
                                      <option value="Processing">Processing Dossier</option>
                                      <option value="Dispatched">Dispatched / Escort Assigned</option>
                                      <option value="Completed">Completed Journey</option>
                                    </select>
                                  </td>

                                  <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <a
                                        href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>WhatsApp</span>
                                      </a>

                                      {/* Conditional Order Deletion: Allowed only for Completed or Dispatched */}
                                      {ord.status === 'Completed' || ord.status === 'Dispatched' ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteOrder(ord.id, e);
                                          }}
                                          className="p-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-300 transition-colors cursor-pointer"
                                          title="Archive & delete completed order"
                                          aria-label={`Delete order ${ord.id}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled
                                          className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-600 opacity-40 cursor-not-allowed"
                                          title="Only Completed or Dispatched orders can be archived or deleted"
                                          aria-label="Delete restricted"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        {/* MODAL: ADD / EDIT STREAMLINED TRANSPORT ROUTE */}
        {routeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#121214] border border-[#d4af37]/40 p-6 sm:p-7 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    {editingRoute ? 'Edit Transport Route' : '+ নতুন রুট যোগ করুন (Add New Transport Route)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter route name, assigned vehicle type/fleet, and direct final BDT price.
                  </p>
                </div>
                <button 
                  onClick={() => { setRouteModalOpen(false); setEditingRoute(null); }} 
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveRoute(e);
                }} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Route Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.nameEn}
                    onChange={(e) => setRouteForm({ ...routeForm, nameEn: e.target.value })}
                    placeholder="e.g. Jeddah Airport to Makkah Hotel"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Route Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.nameBn}
                    onChange={(e) => setRouteForm({ ...routeForm, nameBn: e.target.value })}
                    placeholder="যেমনঃ জেদ্দা বিমানবন্দর থেকে মক্কা হোটেল"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold block">Vehicle Type / Assigned Fleet *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setRouteModalOpen(false);
                          setTransportView('vehicles');
                          openAddVehicleModal();
                        }}
                        className="text-[10px] text-[#d4af37] hover:underline cursor-pointer"
                      >
                        + নতুন গাড়ি
                      </button>
                    </div>
                    <select
                      value={routeForm.vehicleType}
                      onChange={(e) => setRouteForm({ ...routeForm, vehicleType: e.target.value })}
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Select Registered Fleet --</option>
                      {(transport.vehicles || []).map((veh) => (
                        <option key={veh.id} value={veh.nameEn || veh.name}>
                          {veh.nameEn || veh.name} ({veh.category || veh.categoryEn || 'VIP'} - {veh.passengers} Seats)
                        </option>
                      ))}
                      <option value="GMC Yukon Denali / Suburban (VIP SUV)">GMC Yukon Denali / Suburban (VIP SUV)</option>
                      <option value="Mercedes-Benz Maybach / S-Class">Mercedes-Benz Maybach / S-Class</option>
                      <option value="Toyota HiAce VIP Commuter">Toyota HiAce VIP Commuter</option>
                      <option value="VIP Luxury Coach">VIP Luxury Coach (49 Seats)</option>
                      <option value="Haramain High-Speed Rail">Haramain High-Speed Rail (Business Class)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Price in BDT (৳) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={routeForm.priceBDT}
                      onChange={(e) => setRouteForm({ ...routeForm, priceBDT: Number(e.target.value) })}
                      placeholder="e.g. 52000"
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Distance & Estimated Travel Time</label>
                  <input
                    type="text"
                    value={routeForm.distanceEn}
                    onChange={(e) => setRouteForm({ ...routeForm, distanceEn: e.target.value })}
                    placeholder="e.g. 95 km (approx. 60 mins)"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setRouteModalOpen(false); setEditingRoute(null); }}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveRoute(e);
                    }}
                    className="px-5 py-2 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-102"
                  >
                    {editingRoute ? 'Save Route Changes' : '+ Save & Publish Route'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT VIP FLEET VEHICLE */}
        {vehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#121214] border border-[#d4af37]/40 p-6 sm:p-7 rounded-3xl max-w-xl w-full space-y-5 shadow-2xl my-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">
                      {editingVehicle ? 'Edit VIP Vehicle Profile' : '+ নতুন যানবাহন যোগ করুন (Add New VIP Vehicle)'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure vehicle name, seating specs, luggage capacity, and live photo link.
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => { setVehicleModalOpen(false); setEditingVehicle(null); }} 
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveVehicle(e);
                }} 
                className="space-y-4 text-xs"
              >
                {/* 1. Vehicle Name (English & Bengali) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Vehicle Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.nameEn}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, nameEn: e.target.value })}
                      placeholder="e.g. GMC Yukon XL 2026 / Suburban"
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Vehicle Name (বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.nameBn}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, nameBn: e.target.value })}
                      placeholder="যেমনঃ জিএমসি ইউকন এক্সএল ২০২৬ (ভিআইপি)"
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Category / Class & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Vehicle Category / Class *
                    </label>
                    <select
                      value={vehicleForm.category}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="VIP Chauffeur SUV">VIP Chauffeur SUV (GMC / Escalade)</option>
                      <option value="Executive Luxury Sedan">Executive Luxury Sedan (Maybach / S-Class)</option>
                      <option value="Family VIP Van">Family VIP Van (Toyota HiAce / Granvia)</option>
                      <option value="High-Capacity Minibus">High-Capacity Minibus (Hyundai H1 / Staria)</option>
                      <option value="Luxury Delegation Coaster">Luxury Delegation Coaster (14-23 Seats)</option>
                      <option value="Executive 49-Seat Coach">Executive 49-Seat Coach (VIP Delegation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Fleet Operational Status *
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setVehicleForm({ ...vehicleForm, status: 'active' })}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          vehicleForm.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950/50'
                            : 'bg-[#0a0a0c] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active (সচল)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVehicleForm({ ...vehicleForm, status: 'maintenance' })}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          vehicleForm.status === 'maintenance'
                            ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-md shadow-amber-950/50'
                            : 'bg-[#0a0a0c] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Maintenance (সার্ভিসিং)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Passenger & Luggage Capacities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Passenger Capacity (Persons) *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        required
                        min={1}
                        max={60}
                        value={vehicleForm.passengers}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, passengers: Number(e.target.value) })}
                        placeholder="e.g. 7"
                        className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Luggage Capacity (Large Bags) *
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        required
                        min={0}
                        max={60}
                        value={vehicleForm.luggage}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, luggage: Number(e.target.value) })}
                        placeholder="e.g. 5"
                        className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Live Image URL Input Field with Real-Time Thumbnail Preview */}
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    গাড়ির ইমেজ লাইভ লিঙ্ক (Vehicle Image Direct URL) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      required
                      value={vehicleForm.imageUrl}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or direct image link"
                      className="flex-1 bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-[#d4af37] focus:outline-none"
                    />
                    
                    {/* Real-time thumbnail preview box */}
                    <div className="w-20 h-14 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0 relative flex items-center justify-center group shadow-md">
                      {vehicleForm.imageUrl ? (
                        <img
                          src={vehicleForm.imageUrl}
                          alt="Vehicle Thumbnail Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                      ) : (
                        <div className="text-center p-1">
                          <Car className="w-4 h-4 text-slate-500 mx-auto" />
                          <span className="text-[9px] text-slate-500 block">No Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Supported: Imgur, Cloudinary, Unsplash, or direct CDN URL. Real-time preview renders on the right.
                  </span>
                </div>

                {/* 5. Features / Amenities Dynamic Tag Input */}
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Features & Luxury Amenities (সুবিধাসমূহ - সর্বোচ্চ ৮টি)
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={newVehicleFeature}
                      onChange={(e) => setNewVehicleFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVehicleFeature();
                        }
                      }}
                      placeholder="e.g. Leather Seats, Free High-Speed WiFi, Zamzam Chilled Box..."
                      className="flex-1 bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddVehicleFeature}
                      className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-[#d4af37] hover:text-[#080809] border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Active Feature Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {vehicleForm.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 text-amber-300 text-[11px]"
                      >
                        <Check className="w-3 h-3 text-[#d4af37]" />
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVehicleFeature(idx)}
                          className="hover:text-red-400 cursor-pointer ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setVehicleModalOpen(false); setEditingVehicle(null); }}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveVehicle(e);
                    }}
                    className="px-5 py-2 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-102"
                  >
                    {editingVehicle ? 'Save Vehicle Profile' : '+ Save & Register Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </motion.div>
      </div>
    </div>
  );
}
