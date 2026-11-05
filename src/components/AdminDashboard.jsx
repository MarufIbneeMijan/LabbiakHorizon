import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Package, ShoppingBag, Car, 
  ClipboardList, Plus, Trash2, Edit3, Save, X, Check, 
  MessageSquare, ExternalLink, RefreshCw, AlertCircle, 
  Sparkles, Crown, DollarSign, Calendar, Eye, Phone, MapPin, Tag, CheckCircle2, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, packagesAPI, productsAPI, transportAPI, ordersAPI, hotelsAPI } from '../services/api';

export default function AdminDashboard({ isOpen, onClose, locale = 'en' }) {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
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

  const [newRouteModal, setNewRouteModal] = useState(false);
  const [newRouteForm, setNewRouteForm] = useState({
    nameEn: '',
    nameBn: '',
    typeEn: 'Private Chauffeur',
    typeBn: 'প্রাইভেট সফর',
    distanceEn: '100 km',
    basePriceSAR: 600
  });

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
    features_bn: 'ভিআইপি ভিসা প্রসেসিং\nডিরেক্ট ফ্লাইট টিকিট\n৫-স্টার উঠানমুখী হোটেল\nএসি পরিবহন সুবিধা'
  });

  // Product Form State
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
    description_bn: ''
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
      setIsAuthenticated(true);
      setAdminUser(res.user);
      loadAllData();
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await authAPI.login(loginIdentifier, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      setAdminUser(res.data.user);
      loadAllData();
    } else {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
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
  const handleSavePackage = async (e) => {
    e.preventDefault();
    const payload = {
      ...packageForm,
      features_en: packageForm.features_en.split('\n').filter(Boolean),
      features_bn: packageForm.features_bn.split('\n').filter(Boolean),
      priceBDT: Number(packageForm.priceBDT),
      priceUSD: Number(packageForm.priceUSD) || Math.round(Number(packageForm.priceBDT) / 120),
      price_en: `৳ ${Number(packageForm.priceBDT).toLocaleString()} / $${Number(packageForm.priceUSD || Math.round(packageForm.priceBDT / 120))}`,
      price_bn: `৳ ${Number(packageForm.priceBDT).toLocaleString()}/-`
    };

    if (editingPackage) {
      await packagesAPI.update(editingPackage.id, payload);
      showNotification('Package updated successfully!');
    } else {
      await packagesAPI.create(payload);
      showNotification('New package created successfully!');
    }

    setEditingPackage(null);
    const updated = await packagesAPI.getAll('all');
    setPackages(updated);
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to remove this package?')) {
      await packagesAPI.delete(id);
      showNotification('Package deleted.');
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const startEditPackage = (pkg) => {
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
      image: pkg.image || '',
      features_en: Array.isArray(pkg.features_en) ? pkg.features_en.join('\n') : (pkg.features_en || ''),
      features_bn: Array.isArray(pkg.features_bn) ? pkg.features_bn.join('\n') : (pkg.features_bn || '')
    });
    setTimeout(() => {
      packageFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      priceBDT: Number(productForm.priceBDT),
      priceUSD: Number(productForm.priceUSD),
      stock: Number(productForm.stock)
    };

    if (editingProduct) {
      await productsAPI.update(editingProduct.id, payload);
      showNotification('Product updated successfully!');
    } else {
      await productsAPI.create(payload);
      showNotification('New product added to pilgrim store!');
    }

    setEditingProduct(null);
    const updated = await productsAPI.getAll('all');
    setProducts(updated);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this pilgrim store product?')) {
      await productsAPI.delete(id);
      showNotification('Product deleted.');
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    if (newStock < 0) return;
    await productsAPI.update(id, { stock: newStock });
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const startEditProduct = (prod) => {
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
      description_bn: prod.description_bn || ''
    });
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // --- TRANSPORT ACTIONS ---
  const handleUpdateRouteBaseRate = async (routeId, newBaseSAR) => {
    const val = Number(newBaseSAR);
    if (isNaN(val) || val <= 0) return;

    const res = await transportAPI.updateRoute(routeId, { basePriceSAR: val });
    if (res) {
      showNotification(`Route base price updated to ${val} SAR. Tiered VIP markup applied.`);
      const updatedTrans = await transportAPI.get();
      setTransport(updatedTrans);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    await transportAPI.addRoute(newRouteForm);
    setNewRouteModal(false);
    showNotification('New custom transport route added.');
    const updated = await transportAPI.get();
    setTransport(updated);
    setNewRouteForm({
      nameEn: '',
      nameBn: '',
      typeEn: 'Private Chauffeur',
      typeBn: 'প্রাইভেট সফর',
      distanceEn: '100 km',
      basePriceSAR: 600
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

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Delete this luxury hotel property from CMS?')) {
      await hotelsAPI.delete(id);
      showNotification('Hotel property removed.');
      setHotels(hotels.filter(h => h.id !== id));
    }
  };

  const startEditHotel = (htl) => {
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
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await ordersAPI.updateStatus(orderId, newStatus);
    if (res) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`Order ${orderId} marked as ${newStatus}.`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    if (target.status !== 'Completed' && target.status !== 'Dispatched') {
      alert('Security Policy: Only orders with status "Completed" or "Dispatched" can be archived or deleted.');
      return;
    }

    if (window.confirm(`Permanently remove order ${orderId}? This action cannot be reversed.`)) {
      const ok = await ordersAPI.delete(orderId);
      if (ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        showNotification(`Order ${orderId} has been successfully deleted.`);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#080809]/95 backdrop-blur-2xl overflow-y-auto font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-[#121214] border border-[#d4af37]/35 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl relative overflow-hidden kiswah-gold-glow"
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

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign out of Admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] border border-slate-800 text-slate-400 hover:text-white hover:border-[#d4af37]/50 transition-colors cursor-pointer"
              title="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
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

        {/* SCREEN 1: LOGIN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 flex-1 flex flex-col items-center justify-center overflow-y-auto">
            <div className="max-w-md w-full bg-[#0a0a0c] border border-[#d4af37]/35 p-8 rounded-3xl space-y-6 shadow-2xl relative">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">VIP Director Authentication</h2>
                <p className="text-xs text-slate-400">
                  Enter authorized administrator credentials to access the CMS and E-Commerce Manager.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email or Username</label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                    placeholder="admin@labbaikhorizon.com"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Secure Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="bg-white/[0.02] border border-[#d4af37]/15 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
                  <span className="text-[#d4af37] font-semibold block">Default Director Credentials:</span>
                  <p>User: <code className="text-white">admin@labbaikhorizon.com</code> or <code className="text-white">admin</code></p>
                  <p>Pass: <code className="text-white">Labbaik@VIP2026</code> or <code className="text-white">horizon2026</code></p>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate & Enter Dashboard'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* SCREEN 2: MAIN DASHBOARD TABS & CONTENT */
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
                      <span>Fleet & Route Rates ({transport.routes.length} Routes)</span>
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

                        <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Package Type</label>
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

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                              <label className="text-slate-300 font-semibold block mb-1">Price (USD $)</label>
                              <input
                                type="number"
                                value={packageForm.priceUSD}
                                onChange={(e) => setPackageForm({ ...packageForm, priceUSD: Number(e.target.value) })}
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

                            <div className="flex items-center gap-2 pt-6">
                              <input
                                type="checkbox"
                                id="isPopular"
                                checked={packageForm.isPopular}
                                onChange={(e) => setPackageForm({ ...packageForm, isPopular: e.target.checked })}
                                className="w-4 h-4 accent-[#d4af37]"
                              />
                              <label htmlFor="isPopular" className="text-amber-300 font-semibold cursor-pointer">
                                Mark as 'Popular Choice'
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Features Checklist EN (1 per line)</label>
                              <textarea
                                rows={3}
                                value={packageForm.features_en}
                                onChange={(e) => setPackageForm({ ...packageForm, features_en: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none font-sans"
                                placeholder="VIP Visa&#10;Direct Flight&#10;5-Star Hotel"
                              />
                            </div>

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Features Checklist BN (1 per line)</label>
                              <textarea
                                rows={3}
                                value={packageForm.features_bn}
                                onChange={(e) => setPackageForm({ ...packageForm, features_bn: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none font-sans"
                                placeholder="ভিআইপি ভিসা&#10;সরাসরি ফ্লাইট&#10;৫ তারকা হোটেল"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer hover:bg-kiswah-gold-hover"
                            >
                              <Save className="w-4 h-4" />
                              <span>{editingPackage ? 'Save Package Changes' : 'Publish New Package'}</span>
                            </button>
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
                                ৳{pkg.priceBDT?.toLocaleString('en-IN')} <span className="text-xs text-slate-400">(${(pkg.priceUSD || Math.round(pkg.priceBDT / 120)).toLocaleString()} USD)</span>
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
                                onClick={() => startEditPackage(pkg)}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
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
                              <label className="text-slate-300 font-semibold block mb-1">Category</label>
                              <select
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="ihram">Ihram & Towels</option>
                                <option value="zamzam">Zamzam Water</option>
                                <option value="dates">Ajwa Dates & Relics</option>
                                <option value="tasbeeh">Digital Counters & Tasbeeh</option>
                                <option value="rugs">Orthopedic Prayer Rugs</option>
                                <option value="skincare">Halal Skincare & Toiletries</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                              <label className="text-slate-300 font-semibold block mb-1">Price (USD $)</label>
                              <input
                                type="number"
                                value={productForm.priceUSD}
                                onChange={(e) => setProductForm({ ...productForm, priceUSD: Number(e.target.value) })}
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
                              <label className="text-slate-300 font-semibold block mb-1">Product Tag</label>
                              <select
                                value={productForm.tag}
                                onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="Essential">Essential</option>
                                <option value="Best Seller">Best Seller</option>
                                <option value="Luxury">Luxury</option>
                              </select>
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
                                  ৳{prod.priceBDT?.toLocaleString('en-IN')} <span className="text-xs text-slate-400">(${prod.priceUSD} USD)</span>
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
                                onClick={() => startEditProduct(prod)}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
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

                  {/* SUBTAB C: TRANSPORT & FLEET RATES MANAGER */}
                  {cmsSubtab === 'transport' && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0c] border border-slate-800 p-4 rounded-2xl">
                        <div>
                          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#d4af37]" />
                            <span>Benaa Transport Grid & Tiered VIP Markup</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Tiered Markup Formula: <strong className="text-amber-300">+150 SAR</strong> if &gt;1500 SAR, <strong className="text-amber-300">+100 SAR</strong> if 900–1500 SAR, <strong className="text-amber-300">+50 SAR</strong> if &lt;900 SAR.
                          </p>
                        </div>

                        <button
                          onClick={() => setNewRouteModal(true)}
                          className="px-4 py-2 bg-kiswah-gold text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-kiswah-gold-hover"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Custom Route</span>
                        </button>
                      </div>

                      {/* Routes Table */}
                      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0a0a0c]">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#121214] text-amber-300 font-serif font-bold border-b border-slate-800">
                              <tr>
                                <th className="p-3.5">Route Name & Type</th>
                                <th className="p-3.5">Distance</th>
                                <th className="p-3.5">Base Rate (SAR)</th>
                                <th className="p-3.5">Applied Markup</th>
                                <th className="p-3.5">Final Client SAR</th>
                                <th className="p-3.5 text-right">Quick Base Rate Update</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                              {transport.routes.map((route) => {
                                const markupSAR = (route.finalPriceSAR || 0) - (route.basePriceSAR || 0);
                                return (
                                  <tr key={route.id} className="hover:bg-white/[0.01]">
                                    <td className="p-3.5">
                                      <span className="font-semibold text-white block">{route.nameEn}</span>
                                      <span className="text-[11px] text-amber-300 block">{route.nameBn}</span>
                                      <span className="text-[10px] text-slate-500 uppercase">{route.typeEn}</span>
                                    </td>
                                    <td className="p-3.5 font-mono text-slate-400">
                                      {route.distanceEn}
                                    </td>
                                    <td className="p-3.5 font-mono font-bold text-white text-sm">
                                      {route.basePriceSAR} SAR
                                    </td>
                                    <td className="p-3.5">
                                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold border border-amber-500/30">
                                        +{markupSAR} SAR
                                      </span>
                                    </td>
                                    <td className="p-3.5 font-mono font-bold text-kiswah-gold text-sm">
                                      {route.finalPriceSAR} SAR
                                      <span className="block text-[10px] text-slate-400 font-sans">
                                        (~ ৳{Math.round((route.finalPriceSAR || 0) * 33).toLocaleString()} BDT)
                                      </span>
                                    </td>
                                    <td className="p-3.5 text-right">
                                      <div className="inline-flex items-center gap-1.5">
                                        <input
                                          type="number"
                                          defaultValue={route.basePriceSAR}
                                          id={`input-${route.id}`}
                                          className="w-20 bg-[#121214] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:border-[#d4af37]"
                                        />
                                        <button
                                          onClick={() => {
                                            const el = document.getElementById(`input-${route.id}`);
                                            if (el) handleUpdateRouteBaseRate(route.id, el.value);
                                          }}
                                          className="px-2.5 py-1 bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#080809] border border-[#d4af37]/40 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                                        >
                                          Save
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
                              <label className="text-slate-300 font-semibold block mb-1">Holy Sanctuary City *</label>
                              <select
                                value={hotelForm.city}
                                onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="Makkah">Makkah Al-Mukarramah</option>
                                <option value="Madinah">Madinah Al-Munawwarah</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Nightly Rate (USD $)</label>
                              <input
                                type="number"
                                value={hotelForm.nightlyUsd}
                                onChange={(e) => setHotelForm({ ...hotelForm, nightlyUsd: Number(e.target.value) })}
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
                              <label className="text-slate-300 font-semibold block mb-1">Property Image URL</label>
                              <input
                                type="url"
                                value={hotelForm.image}
                                onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                              />
                              {hotelForm.image && (
                                <div className="mt-2 h-16 w-32 rounded-lg overflow-hidden border border-slate-700">
                                  <img src={hotelForm.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              )}
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
                      <div className="flex items-center gap-2">
                        {['all', 'makkah', 'madinah'].map((cityKey) => (
                          <button
                            key={cityKey}
                            onClick={() => setHotelCityFilter(cityKey)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                              hotelCityFilter === cityKey
                                ? 'bg-kiswah-gold text-[#080809] shadow-md'
                                : 'bg-white/[0.03] border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {cityKey === 'all' && `All Hotels (${hotels.length})`}
                            {cityKey === 'makkah' && `Makkah Sanctum (${hotels.filter(h => h.city?.toLowerCase() === 'makkah').length})`}
                            {cityKey === 'madinah' && `Madinah Munawwarah (${hotels.filter(h => h.city?.toLowerCase() === 'madinah').length})`}
                          </button>
                        ))}
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
                                    ৳{Number(htl.nightlyBdt || 0).toLocaleString('en-IN')}{' '}
                                    <span className="text-xs text-slate-400 font-normal">(${htl.nightlyUsd} USD)</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                  onClick={() => startEditHotel(htl)}
                                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteHotel(htl.id)}
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
                          onClick={() => setOrderStatusFilter(st)}
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
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      (${ord.totalUSD?.toLocaleString()} USD)
                                    </span>
                                  </td>

                                  <td className="p-3.5">
                                    <select
                                      value={ord.status}
                                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${
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
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>WhatsApp</span>
                                      </a>

                                      {/* Conditional Order Deletion: Allowed only for Completed or Dispatched */}
                                      {ord.status === 'Completed' || ord.status === 'Dispatched' ? (
                                        <button
                                          onClick={() => handleDeleteOrder(ord.id)}
                                          className="p-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-300 transition-colors cursor-pointer"
                                          title="Archive & delete completed order"
                                          aria-label={`Delete order ${ord.id}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <button
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
        )}

        {/* MODAL: ADD CUSTOM TRANSPORT ROUTE */}
        {newRouteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080809]/80 backdrop-blur-md">
            <div className="bg-[#121214] border border-[#d4af37]/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-serif font-bold text-white text-base">Add Custom Transport Route</h3>
                <button onClick={() => setNewRouteModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRoute} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Route Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={newRouteForm.nameEn}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, nameEn: e.target.value })}
                    placeholder="e.g. Taif Cable Car & Rose Garden Day Tour"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Route Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newRouteForm.nameBn}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, nameBn: e.target.value })}
                    placeholder="যেমনঃ তায়েফ ক্যাবল কার ও গোলাপ বাগান সফর"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Base Price (SAR) *</label>
                    <input
                      type="number"
                      required
                      value={newRouteForm.basePriceSAR}
                      onChange={(e) => setNewRouteForm({ ...newRouteForm, basePriceSAR: Number(e.target.value) })}
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Distance / Duration</label>
                    <input
                      type="text"
                      value={newRouteForm.distanceEn}
                      onChange={(e) => setNewRouteForm({ ...newRouteForm, distanceEn: e.target.value })}
                      placeholder="e.g. 180 km (2.5 hrs)"
                      className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRouteModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-kiswah-gold text-[#080809] font-serif font-bold rounded-xl uppercase tracking-wider"
                  >
                    Create Route
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
