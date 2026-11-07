// src/services/api.js
// Cloud API Service for LabbaikHorizon with JSONBin.io Cloud Synchronization

import { PACKAGES_DATA, FLEET_ROUTES, FLEET_VEHICLES, applyTieredMarkup } from '../data/mockData';
import initialDb from '../../server/data/db.json';

// --- 1. CONFIGURE JSONBIN.IO CLOUD SYNCHRONIZATION ---
// Read environment variables using Vite syntax
const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID || '';
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || '';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Check if JSONBin cloud synchronization credentials are provided
export function isCloudConfigured() {
  return Boolean(BIN_ID && API_KEY);
}

// Helper: Standard JSONBin.io v3 Request Headers
function getJsonBinHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (API_KEY) {
    headers['X-Master-Key'] = API_KEY;
    headers['X-Access-Key'] = API_KEY;
  }
  return headers;
}

// Fallback Hotels Catalog for Offline / Initialization
export const FALLBACK_HOTELS = (initialDb && initialDb.hotels && initialDb.hotels.length > 0)
  ? initialDb.hotels
  : [
      {
        id: "raffles-makkah",
        name: "Raffles Makkah Palace",
        city: "Makkah",
        dist: "0m - Courtyard Direct",
        distBn: "০ মিটার - সরাসরি হারাম চত্বর",
        stars: 5,
        starRating: "5-Star VIP",
        nightlyBdt: 145000,
        nightlyUsd: 1200,
        features: ["Panoramic Direct View of Holy Ka'aba", "Private 24-hr Dedicated Butler", "In-Suite Live Haram Audio Feed", "Exclusive Dining Suhoor & Iftar"],
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "fairmont-clocktower",
        name: "Fairmont Makkah Clock Royal Tower",
        city: "Makkah",
        dist: "0m - Courtyard Direct",
        distBn: "০ মিটার - ক্লক টাওয়ার চত্বর",
        stars: 5,
        starRating: "5-Star VIP",
        nightlyBdt: 120000,
        nightlyUsd: 1000,
        features: ["Direct Kaaba View Suites", "Elevator to Haram Courtyard", "Executive Club Lounge Access", "Royal Buffet Dining"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "swissotel-almaqam",
        name: "Swissôtel Al Maqam Makkah",
        city: "Makkah",
        dist: "50m - Direct Haram Elevators",
        distBn: "৫০ মিটার - সরাসরি হারাম লিফট",
        stars: 5,
        starRating: "5-Star VIP",
        nightlyBdt: 95000,
        nightlyUsd: 790,
        features: ["Direct Courtyard Elevators", "In-Suite Live Kaaba Audio Feed", "Gourmet International Buffet", "24/7 Chauffeur Service"],
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "oberoi-madinah",
        name: "The Oberoi Madinah",
        city: "Madinah",
        dist: "0m - Prophet's Mosque Courtyard",
        distBn: "০ মিটার - মসজিদে নববীর চত্বর",
        stars: 5,
        starRating: "5-Star VIP",
        nightlyBdt: 135000,
        nightlyUsd: 1125,
        features: ["Direct Steps to Prophet's Mosque", "Fast-Track Rawdah Permit Access", "Private Concierge Butler", "Signature Oberoi 5-Star Dining"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "dar-al-taqwa",
        name: "Dar Al Taqwa Hotel Madinah",
        city: "Madinah",
        dist: "0m - Ladies & Gentlemen Gate",
        distBn: "০ মিটার - প্রধান গেট সংলগ্ন",
        stars: 5,
        starRating: "5-Star VIP",
        nightlyBdt: 110000,
        nightlyUsd: 915,
        features: ["Facing Prophet's Mosque Gates", "Tea Lounge overlooking Courtyard", "Express VIP Check-in", "Deluxe Breakfast Buffet"],
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "madinah-hilton",
        name: "Madinah Hilton Hotel",
        city: "Madinah",
        dist: "50m - Walking Courtyard",
        distBn: "৫০ মিটার - স্বল্প হাঁটার দূরত্ব",
        stars: 4,
        starRating: "4-Star Executive",
        nightlyBdt: 85000,
        nightlyUsd: 700,
        features: ["Direct Pedestrian Path to Haram", "Traditional Arabic Hospitality", "Executive Suite Options", "Concierge Desk"],
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
      }
    ];

const FALLBACK_PRODUCTS = (initialDb && initialDb.products && initialDb.products.length > 0)
  ? initialDb.products
  : [
      {
        id: "prod-ihram-egyptian",
        name_en: "Premium Egyptian Cotton Ihram Towels (2-Piece Set)",
        name_bn: "প্রিমিয়াম মিশরীয় কটন ইহরাম তোয়ালে (২ পিস সেট)",
        priceBDT: 3500,
        priceUSD: 30,
        category: "ihram",
        tag: "Essential",
        stock: 45,
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800",
        description_en: "Ultra-absorbent 100% combed cotton seamless Ihram for gentlemen with travel buckle pouch.",
        description_bn: "পুরুষদের জন্য ১০০% খাঁটি সুতি আরামদায়ক সেলাইবিহীন ইহরাম ও পাউচ।"
      },
      {
        id: "prod-zamzam-5l",
        name_en: "Certified 5L Zamzam Water (Ministry-Sealed Box)",
        name_bn: "সার্টিফাইড ৫ লিটার জমজম পানি (সৌদি সিলগালা করা)",
        priceBDT: 4500,
        priceUSD: 38,
        category: "zamzam",
        tag: "Best Seller",
        stock: 80,
        image: "https://images.unsplash.com/photo-1548625361-1250269f8303?auto=format&fit=crop&q=80&w=800",
        description_en: "Official GACA-inspected 5-liter bottle directly sourced from Kudai Zamzam plant.",
        description_bn: "মক্কার কুদাই প্ল্যান্ট থেকে সংগৃহীত সরাসরি ৫ লিটার বোতল।"
      },
      {
        id: "prod-ajwa-madinah",
        name_en: "VIP Royal Madinah Ajwa Dates (1kg Keepsake Wooden Tin)",
        name_bn: "ভিআইপি রয়্যাল মদিনার আলিয়া আজওয়া খেজুর (১ কেজি কাষ্ঠের বক্স)",
        priceBDT: 5200,
        priceUSD: 44,
        category: "dates",
        tag: "Best Seller",
        stock: 60,
        image: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=800",
        description_en: "Selected soft, dark authentic Ajwa from the sacred groves of Al-Aliyah, Madinah.",
        description_bn: "মদিনার পবিত্র আল-আলিয়া বাগান থেকে সংগৃহীত নরম ও সুস্বাদু আজওয়া খেজুর।"
      },
      {
        id: "prod-smart-tasbeeh",
        name_en: "Digital OLED Smart Ring Tasbeeh & Tawaf Counter",
        name_bn: "ডিজিটাল ওলেড স্মার্ট রিং তাসবীহ ও তাওয়াফ কাউন্টার",
        priceBDT: 2800,
        priceUSD: 24,
        category: "tasbeeh",
        tag: "Essential",
        stock: 110,
        image: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&q=80&w=800",
        description_en: "Vibration alert at 33/99 counts, silent haptic feedback, 7-day battery life.",
        description_bn: "৩৩/৯৯ গণনায় ভাইব্রেশন অ্যালার্ট ও ব্যাটারি ব্যাকআপ বিশিষ্ট স্মার্ট তাসবীহ।"
      },
      {
        id: "prod-ortho-rug",
        name_en: "Orthopedic Memory Foam Prayer Rug with Ka'aba Gold Weave",
        name_bn: "অর্থোপেডিক মেমোরি ফোম জায়নামাজ (কিসওয়াহ গোল্ড ডিজাইন)",
        priceBDT: 4800,
        priceUSD: 40,
        category: "rugs",
        tag: "Luxury",
        stock: 35,
        image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800",
        description_en: "Joint-relieving 25mm thick memory foam, foldable with velvet carry bag.",
        description_bn: "হাঁটু ও কোমরের আরামদায়ক ২৫ মিমি ঘন মেমোরি ফোম সমৃদ্ধ লাক্সারি জায়নামাজ।"
      },
      {
        id: "prod-ihram-toiletries",
        name_en: "Fragrance-Free Shariah-Compliant Ihram Toiletries Kit",
        name_bn: "সুগন্ধিহীন হালাল ইহরাম টয়লেট্রিজ ও স্কিনকেয়ার কিট",
        priceBDT: 2200,
        priceUSD: 18,
        category: "skincare",
        tag: "Essential",
        stock: 95,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
        description_en: "100% alcohol-free and fragrance-free soap, shampoo, lip balm, and SPF50 lotion.",
        description_bn: "ইহরাম অবস্থায় ব্যবহারের উপযোগী অ্যালকোহল ও সুগন্ধিমুক্ত বিশেষ কিট।"
      }
    ];

const FALLBACK_PACKAGES = (initialDb && initialDb.packages && initialDb.packages.length > 0)
  ? initialDb.packages
  : [
      ...((PACKAGES_DATA && PACKAGES_DATA.umrah) || []).map(p => ({
        ...p,
        type: 'umrah',
        priceBDT: parseInt(String(p.price_en || '').replace(/[^0-9]/g, '')) || 145000,
        priceUSD: Math.round((parseInt(String(p.price_en || '').replace(/[^0-9]/g, '')) || 145000) / 120),
        image: p.image || "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800"
      })),
      ...((PACKAGES_DATA && PACKAGES_DATA.hajj) || []).map(p => ({
        ...p,
        type: 'hajj',
        priceBDT: parseInt(String(p.price_en || '').replace(/[^0-9]/g, '')) || 560000,
        priceUSD: Math.round((parseInt(String(p.price_en || '').replace(/[^0-9]/g, '')) || 560000) / 120),
        image: p.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
      }))
    ];

const FALLBACK_TRANSPORT = (initialDb && initialDb.transport && initialDb.transport.routes)
  ? initialDb.transport
  : {
      routes: (FLEET_ROUTES || []).map(r => ({
        ...r,
        basePriceSAR: r.basePriceSAR || 550,
        finalPriceSAR: applyTieredMarkup(r.basePriceSAR || 550)
      })),
      vehicles: FLEET_VEHICLES || []
    };

const FALLBACK_ORDERS = (initialDb && initialDb.orders && initialDb.orders.length > 0)
  ? initialDb.orders
  : [
      {
        id: "ORD-2026-8812",
        type: "store_order",
        customerName: "Al-Haj Syful Islam Chowdhury",
        customerPhone: "+8801711598234",
        customerEmail: "syful.islam@ctg-industries.com",
        status: "Processing",
        items: [
          { name: "Premium Egyptian Cotton Ihram Towels (2-Piece Set)", quantity: 2, priceBDT: 3500 },
          { name: "VIP Royal Madinah Ajwa Dates (1kg Keepsake Wooden Tin)", quantity: 3, priceBDT: 5200 }
        ],
        totalBDT: 22600,
        totalUSD: 188,
        deliveryAddress: "House 14, Road 72, Gulshan-2, Dhaka-1212",
        createdAt: "2026-11-01T10:30:00Z"
      },
      {
        id: "DOS-2026-4429",
        type: "vip_dossier",
        customerName: "Dr. Farhana Rahman",
        customerPhone: "+8801819234876",
        customerEmail: "farhana.rahman@globalhealth.org",
        status: "Pending",
        items: [
          { name: "VIP Clock Tower Royal Penthouse Umrah (Ramadan 2027)", quantity: 4, priceBDT: 285000 }
        ],
        totalBDT: 1140000,
        totalUSD: 9500,
        deliveryAddress: "Private Client Lounge Briefing, Horizon Tower, Gulshan-2",
        createdAt: "2026-11-02T14:15:00Z"
      }
    ];

// Initial Full Store Schema
function getInitialStore() {
  return {
    packages: FALLBACK_PACKAGES,
    products: FALLBACK_PRODUCTS,
    hotels: FALLBACK_HOTELS,
    transport: FALLBACK_TRANSPORT,
    orders: FALLBACK_ORDERS
  };
}

// --- 2. LOCAL CACHE & RESILIENCE LAYER ---
const STORAGE_KEY_BIN = 'horizon_jsonbin_cache';
let inMemoryStore = null;
let writeQueue = Promise.resolve();

// Defensive Normalizer ensuring no collections are undefined
function normalizeStore(raw) {
  const defaults = getInitialStore();
  if (!raw || typeof raw !== 'object') return defaults;

  return {
    packages: Array.isArray(raw.packages) && raw.packages.length > 0 ? raw.packages : defaults.packages,
    products: Array.isArray(raw.products) && raw.products.length > 0 ? raw.products : defaults.products,
    hotels: Array.isArray(raw.hotels) && raw.hotels.length > 0 ? raw.hotels : defaults.hotels,
    transport: {
      routes: Array.isArray(raw.transport?.routes) && raw.transport.routes.length > 0 ? raw.transport.routes : defaults.transport.routes,
      vehicles: Array.isArray(raw.transport?.vehicles) && raw.transport.vehicles.length > 0 ? raw.transport.vehicles : defaults.transport.vehicles
    },
    orders: Array.isArray(raw.orders) ? raw.orders : defaults.orders
  };
}

// Retrieve from in-memory cache or localStorage
function getCachedStore() {
  if (inMemoryStore) return inMemoryStore;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BIN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          inMemoryStore = normalizeStore(parsed);
          return inMemoryStore;
        }
      }
    } catch (e) {
      console.warn('Could not read cached JSONBin store from localStorage:', e);
    }
  }
  inMemoryStore = getInitialStore();
  return inMemoryStore;
}

// Persist to in-memory cache and localStorage
function saveCachedStore(store) {
  inMemoryStore = store;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_BIN, JSON.stringify(store));
    } catch (e) {
      console.warn('Could not write JSONBin store cache to localStorage:', e);
    }
  }
}

// Queue sequential cloud writes to avoid race conditions
function queueWrite(fn) {
  writeQueue = writeQueue.then(fn).catch(err => {
    console.error('JSONBin write queue error:', err);
  });
  return writeQueue;
}

// --- 3. JSONBIN.IO CLOUD SYNCHRONIZATION ROUTINES ---

// Fetch latest record from JSONBin.io with cache-busting
async function fetchCloudStore() {
  if (!isCloudConfigured()) {
    return getCachedStore();
  }

  try {
    const res = await fetch(`${BASE_URL}/latest?nocache=${Date.now()}`, {
      method: 'GET',
      headers: getJsonBinHeaders(),
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      const rawRecord = data.record || data;
      const normalized = normalizeStore(rawRecord);
      saveCachedStore(normalized);
      return normalized;
    } else {
      console.warn(`JSONBin fetch returned status ${res.status}. Falling back to cached state.`);
    }
  } catch (err) {
    console.warn('JSONBin cloud fetch error, utilizing resilient local cache:', err);
  }

  return getCachedStore();
}

// Persist whole store object to JSONBin.io via PUT
async function persistCloudStore(newStore) {
  const normalized = normalizeStore(newStore);
  saveCachedStore(normalized);

  if (!isCloudConfigured()) {
    return normalized;
  }

  return queueWrite(async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'PUT',
        headers: getJsonBinHeaders(),
        body: JSON.stringify(normalized)
      });

      if (res.ok) {
        const data = await res.json();
        const savedRecord = data.record || normalized;
        saveCachedStore(savedRecord);
        return savedRecord;
      } else {
        console.warn(`JSONBin PUT returned status ${res.status}.`);
      }
    } catch (err) {
      console.error('JSONBin PUT cloud synchronization error:', err);
    }
    return normalized;
  });
}

// =========================================================
// --- 4. EXPORTED DOMAIN API MODULES (100% COMPATIBLE) ---
// =========================================================

// --- AUTH API ---
export const authAPI = {
  async login(identifier, password) {
    const isMasterAdmin = (
      (identifier === 'admin' || identifier === 'admin@labbaikhorizon.com') &&
      (password === 'Labbaik@VIP2026' || password === 'horizon2026')
    );

    if (isMasterAdmin) {
      const token = 'horizon_cloud_vip_token_' + Date.now();
      const user = { name: 'Private Client Director', role: 'admin', email: 'director@labbaikhorizon.com' };
      if (typeof window !== 'undefined') {
        localStorage.setItem('horizon_admin_token', token);
        localStorage.setItem('horizon_admin_user', JSON.stringify(user));
        localStorage.setItem('isAdminAuthenticated', 'true');
      }
      return { success: true, data: { token, user } };
    }

    return { success: false, message: 'Invalid credentials. Please verify your director username or password.' };
  },

  async verify() {
    if (typeof window === 'undefined') return { success: false };
    const token = localStorage.getItem('horizon_admin_token');
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';

    if (!token || !isAuth) {
      localStorage.removeItem('isAdminAuthenticated');
      return { success: false };
    }

    const user = JSON.parse(localStorage.getItem('horizon_admin_user') || '{"name":"Private Client Director","role":"admin"}');
    return { success: true, user };
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('horizon_admin_token');
      localStorage.removeItem('horizon_admin_user');
      localStorage.removeItem('isAdminAuthenticated');
    }
  }
};

// --- PACKAGES API (HAJJ & UMRAH) ---
export const packagesAPI = {
  async getAll(type = 'all') {
    const store = await fetchCloudStore();
    const list = store.packages || [];
    if (!type || type === 'all') return list;
    return list.filter(p => p.type === type);
  },

  async create(packageData) {
    const newPkg = {
      ...packageData,
      id: packageData.id || `pkg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const store = await fetchCloudStore();
    const updatedPackages = [newPkg, ...(store.packages || []).filter(p => p.id !== newPkg.id)];
    const updatedStore = { ...store, packages: updatedPackages };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'create', package: newPkg } }));
    }
    return newPkg;
  },

  async update(id, updates) {
    const store = await fetchCloudStore();
    let updatedPkg = null;
    const updatedPackages = (store.packages || []).map(p => {
      if (p.id === id) {
        updatedPkg = { ...p, ...updates, updatedAt: new Date().toISOString() };
        return updatedPkg;
      }
      return p;
    });

    if (!updatedPkg) {
      updatedPkg = { id, ...updates, updatedAt: new Date().toISOString() };
      updatedPackages.push(updatedPkg);
    }

    const updatedStore = { ...store, packages: updatedPackages };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'update', package: updatedPkg } }));
    }
    return updatedPkg;
  },

  async delete(id) {
    const store = await fetchCloudStore();
    const updatedPackages = (store.packages || []).filter(p => p.id !== id);
    const updatedStore = { ...store, packages: updatedPackages };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};

// --- PRODUCTS API (PILGRIM ESSENTIALS & SHOP) ---
export const productsAPI = {
  async getAll(category = 'all') {
    const store = await fetchCloudStore();
    const list = store.products || [];
    if (!category || category === 'all') return list;
    return list.filter(p => p.category === category);
  },

  async create(productData) {
    const newProd = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const store = await fetchCloudStore();
    const updatedProducts = [newProd, ...(store.products || []).filter(p => p.id !== newProd.id)];
    const updatedStore = { ...store, products: updatedProducts };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:products-updated', { detail: { action: 'create', product: newProd } }));
    }
    return newProd;
  },

  async update(id, updates) {
    const store = await fetchCloudStore();
    let updatedProd = null;
    const updatedProducts = (store.products || []).map(p => {
      if (p.id === id) {
        updatedProd = { ...p, ...updates, updatedAt: new Date().toISOString() };
        return updatedProd;
      }
      return p;
    });

    if (!updatedProd) {
      updatedProd = { id, ...updates, updatedAt: new Date().toISOString() };
      updatedProducts.push(updatedProd);
    }

    const updatedStore = { ...store, products: updatedProducts };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:products-updated', { detail: { action: 'update', product: updatedProd } }));
    }
    return updatedProd;
  },

  async delete(id) {
    const store = await fetchCloudStore();
    const updatedProducts = (store.products || []).filter(p => p.id !== id);
    const updatedStore = { ...store, products: updatedProducts };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:products-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};

// --- HOTELS API (MAKKAH & MADINAH 5-STAR ACCOMMODATIONS) ---
export const hotelsAPI = {
  async getAll(city = 'all') {
    const store = await fetchCloudStore();
    const list = store.hotels || [];
    if (!city || city === 'all') return list;
    return list.filter(h => h.city && h.city.toLowerCase() === city.toLowerCase());
  },

  async create(hotelData) {
    const newHotel = {
      ...hotelData,
      id: hotelData.id || `hotel-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const store = await fetchCloudStore();
    const updatedHotels = [newHotel, ...(store.hotels || []).filter(h => h.id !== newHotel.id)];
    const updatedStore = { ...store, hotels: updatedHotels };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'create', hotel: newHotel } }));
    }
    return newHotel;
  },

  async update(id, updates) {
    const store = await fetchCloudStore();
    let updatedHotel = null;
    const updatedHotels = (store.hotels || []).map(h => {
      if (h.id === id) {
        updatedHotel = { ...h, ...updates, updatedAt: new Date().toISOString() };
        return updatedHotel;
      }
      return h;
    });

    if (!updatedHotel) {
      updatedHotel = { id, ...updates, updatedAt: new Date().toISOString() };
      updatedHotels.push(updatedHotel);
    }

    const updatedStore = { ...store, hotels: updatedHotels };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'update', hotel: updatedHotel } }));
    }
    return updatedHotel;
  },

  async delete(id) {
    const store = await fetchCloudStore();
    const updatedHotels = (store.hotels || []).filter(h => h.id !== id);
    const updatedStore = { ...store, hotels: updatedHotels };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};

// --- TRANSPORT API (FLEET VEHICLES & CHAUFFEUR ROUTES) ---
export const transportAPI = {
  async get() {
    const store = await fetchCloudStore();
    return store.transport || { routes: [], vehicles: [] };
  },

  async updateRoute(id, updates) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    const currentRoutes = currentTransport.routes || [];
    let updatedRoute = null;

    const newRoutes = currentRoutes.map(r => {
      if (r.id === id) {
        const priceBDT = updates.priceBDT !== undefined ? Number(updates.priceBDT) : (r.priceBDT || Math.round((r.finalPriceSAR || 1600) * 33));
        const base = updates.basePriceSAR !== undefined ? Number(updates.basePriceSAR) : Math.round(priceBDT / 33);
        updatedRoute = {
          ...r,
          ...updates,
          priceBDT,
          vehicleType: updates.vehicleType || r.vehicleType || r.typeEn || 'VIP GMC Yukon',
          basePriceSAR: base,
          finalPriceSAR: base
        };
        return updatedRoute;
      }
      return r;
    });

    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        routes: newRoutes
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'update-route', route: updatedRoute } }));
    }
    return updatedRoute;
  },

  async addRoute(routeData) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    const priceBDT = Number(routeData.priceBDT) || Math.round((Number(routeData.basePriceSAR) || 600) * 33);
    const base = Number(routeData.basePriceSAR) || Math.round(priceBDT / 33) || 600;
    const newRoute = {
      ...routeData,
      id: routeData.id || `route-${Date.now()}`,
      priceBDT,
      vehicleType: routeData.vehicleType || routeData.vehicleTypeEn || routeData.typeEn || 'VIP GMC Yukon',
      basePriceSAR: base,
      finalPriceSAR: base
    };

    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        routes: [...(currentTransport.routes || []), newRoute]
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'add-route', route: newRoute } }));
    }
    return newRoute;
  },

  async deleteRoute(id) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        routes: (currentTransport.routes || []).filter(r => r.id !== id)
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'delete-route', id } }));
    }
    return { success: true };
  },

  async addVehicle(vehicleData) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    const newVehicle = {
      ...vehicleData,
      id: vehicleData.id || `veh-${Date.now()}`,
      nameEn: vehicleData.nameEn || vehicleData.name || 'New VIP Vehicle',
      nameBn: vehicleData.nameBn || vehicleData.name || 'নতুন ভিআইপি গাড়ি',
      badgeEn: vehicleData.badgeEn || vehicleData.categoryEn || 'VIP Fleet',
      badgeBn: vehicleData.badgeBn || 'ভিআইপি ফ্লিট',
      category: vehicleData.category || vehicleData.categoryEn || 'VIP Chauffeur SUV',
      categoryEn: vehicleData.categoryEn || vehicleData.category || 'VIP Chauffeur SUV',
      categoryBn: vehicleData.categoryBn || 'ভিআইপি শফার এসইউভি',
      image: vehicleData.imageUrl || vehicleData.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      imageUrl: vehicleData.imageUrl || vehicleData.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      status: vehicleData.status || 'active',
      passengers: Number(vehicleData.passengers) || 4,
      luggage: Number(vehicleData.luggage) || 4,
      featuresEn: Array.isArray(vehicleData.featuresEn) ? vehicleData.featuresEn : (vehicleData.features || []),
      featuresBn: Array.isArray(vehicleData.featuresBn) ? vehicleData.featuresBn : (vehicleData.features || []),
      createdAt: new Date().toISOString()
    };

    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        vehicles: [...(currentTransport.vehicles || []), newVehicle]
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'add-vehicle', vehicle: newVehicle } }));
    }
    return newVehicle;
  },

  async updateVehicle(id, updates) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    let updatedVehicle = null;

    const newVehicles = (currentTransport.vehicles || []).map(v => {
      if (v.id === id) {
        updatedVehicle = {
          ...v,
          ...updates,
          nameEn: updates.nameEn || updates.name || v.nameEn,
          nameBn: updates.nameBn || updates.name || v.nameBn,
          category: updates.category || updates.categoryEn || v.category,
          categoryEn: updates.categoryEn || updates.category || v.categoryEn,
          categoryBn: updates.categoryBn || v.categoryBn,
          image: updates.imageUrl || updates.image || v.image,
          imageUrl: updates.imageUrl || updates.image || v.imageUrl,
          passengers: updates.passengers !== undefined ? Number(updates.passengers) : v.passengers,
          luggage: updates.luggage !== undefined ? Number(updates.luggage) : v.luggage,
          featuresEn: Array.isArray(updates.featuresEn) ? updates.featuresEn : (updates.features || v.featuresEn),
          featuresBn: Array.isArray(updates.featuresBn) ? updates.featuresBn : (updates.features || v.featuresBn),
          status: updates.status || v.status || 'active'
        };
        return updatedVehicle;
      }
      return v;
    });

    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        vehicles: newVehicles
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'update-vehicle', vehicle: updatedVehicle } }));
    }
    return updatedVehicle;
  },

  async deleteVehicle(id) {
    const store = await fetchCloudStore();
    const currentTransport = store.transport || { routes: [], vehicles: [] };
    const updatedStore = {
      ...store,
      transport: {
        ...currentTransport,
        vehicles: (currentTransport.vehicles || []).filter(v => v.id !== id)
      }
    };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:transport-updated', { detail: { action: 'delete-vehicle', id } }));
    }
    return true;
  }
};

// --- ORDERS API (STORE ORDERS & VIP DOSSIERS) ---
export const ordersAPI = {
  async getAll() {
    const store = await fetchCloudStore();
    return store.orders || [];
  },

  async create(orderPayload) {
    const prefix = orderPayload.type === 'vip_dossier' ? 'DOS' : 'ORD';
    const newOrder = {
      ...orderPayload,
      id: orderPayload.id || `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: orderPayload.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    const store = await fetchCloudStore();
    const updatedOrders = [newOrder, ...(store.orders || []).filter(o => o.id !== newOrder.id)];
    const updatedStore = { ...store, orders: updatedOrders };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:orders-updated', { detail: { action: 'create', order: newOrder } }));
    }
    return newOrder;
  },

  async updateStatus(id, status) {
    const store = await fetchCloudStore();
    let updatedOrder = null;
    const updatedOrders = (store.orders || []).map(o => {
      if (o.id === id) {
        updatedOrder = { ...o, status, updatedAt: new Date().toISOString() };
        return updatedOrder;
      }
      return o;
    });

    if (!updatedOrder) {
      updatedOrder = { id, status };
      updatedOrders.push(updatedOrder);
    }

    const updatedStore = { ...store, orders: updatedOrders };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:orders-updated', { detail: { action: 'update-status', order: updatedOrder } }));
    }
    return updatedOrder;
  },

  async delete(id) {
    const store = await fetchCloudStore();
    const updatedOrders = (store.orders || []).filter(o => o.id !== id);
    const updatedStore = { ...store, orders: updatedOrders };
    await persistCloudStore(updatedStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:orders-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};
