// server/db.js
// Persistent JSON-backed Database Engine with Atomic File Operations

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_PACKAGES, 
  INITIAL_PRODUCTS, 
  INITIAL_FLEET_ROUTES, 
  INITIAL_FLEET_VEHICLES, 
  INITIAL_ORDERS 
} from './data/seedData.js';

export const INITIAL_HOTELS = [
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Tiered Markup Rule:
// if >1500 SAR: +150 SAR
// if 900–1500 SAR: +100 SAR
// if <900 SAR: +50 SAR
export function calculateTieredMarkup(basePrice) {
  const num = Number(basePrice) || 0;
  if (num > 1500) return num + 150;
  if (num >= 900 && num <= 1500) return num + 100;
  return num + 50;
}

// Ensure data directory and db.json exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      packages: INITIAL_PACKAGES,
      products: INITIAL_PRODUCTS,
      transport: {
        routes: INITIAL_FLEET_ROUTES.map(r => ({
          ...r,
          finalPriceSAR: calculateTieredMarkup(r.basePriceSAR)
        })),
        vehicles: INITIAL_FLEET_VEHICLES
      },
      orders: INITIAL_ORDERS,
      admin: {
        username: "admin",
        email: "admin@labbaikhorizon.com",
        // Password for demo is "Labbaik@VIP2026" or "horizon2026"
        passwordHash: "Labbaik@VIP2026",
        name: "Private Client Director"
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db.json, re-initializing:", err);
    return null;
  }
}

// In-memory cache
let dbCache = initDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

function getDb() {
  if (!dbCache) {
    dbCache = initDb();
  }
  if (!dbCache.hotels || !Array.isArray(dbCache.hotels) || dbCache.hotels.length === 0) {
    dbCache.hotels = INITIAL_HOTELS;
    saveDb();
  }
  return dbCache;
}

// Database methods
export const db = {
  // --- PACKAGES ---
  getPackages(type) {
    const current = getDb().packages || [];
    if (!type || type === 'all') return current;
    return current.filter(p => p.type === type);
  },

  getPackageById(id) {
    const list = getDb().packages || [];
    return list.find(p => p.id === id);
  },

  createPackage(pkgData) {
    const database = getDb();
    const newPkg = {
      id: pkgData.id || `pkg-${Date.now()}`,
      type: pkgData.type || 'umrah',
      title_en: pkgData.title_en || 'New Sacred Package',
      title_bn: pkgData.title_bn || 'নতুন পবিত্র প্যাকেজ',
      badge_en: pkgData.badge_en || 'VIP Sanctum',
      badge_bn: pkgData.badge_bn || 'ভিআইপি স্যাঙ্কটাম',
      priceBDT: Number(pkgData.priceBDT) || 150000,
      priceUSD: Number(pkgData.priceUSD) || Math.round((Number(pkgData.priceBDT) || 150000) / 120),
      price_en: pkgData.price_en || `৳ ${Number(pkgData.priceBDT || 150000).toLocaleString()}`,
      price_bn: pkgData.price_bn || `৳ ${Number(pkgData.priceBDT || 150000).toLocaleString()}/-`,
      priceUnit_en: pkgData.priceUnit_en || 'per person',
      priceUnit_bn: pkgData.priceUnit_bn || 'জনপ্রতি',
      features_en: Array.isArray(pkgData.features_en) ? pkgData.features_en : ['VIP Visa Processing', 'Direct Flights', '5-Star Hotel Accommodations'],
      features_bn: Array.isArray(pkgData.features_bn) ? pkgData.features_bn : ['ভিআইপি ভিসা প্রসেসিং', 'ডিরেক্ট ফ্লাইট', '৫-স্টার হোটেল সুবিধা'],
      image: pkgData.image || 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
      accentColor: pkgData.accentColor || 'from-amber-500/30 to-amber-950/50',
      borderColor: pkgData.borderColor || 'border-[#d4af37]',
      tagColor: pkgData.tagColor || 'text-[#d4af37]',
      isPopular: Boolean(pkgData.isPopular),
      selectedHotelIds: Array.isArray(pkgData.selectedHotelIds) ? pkgData.selectedHotelIds : [],
      flightTier: pkgData.flightTier || 'Direct Flight - Saudia / Biman VIP',
      flightLuggage: pkgData.flightLuggage || '2x 23kg Check-in (46kg) + 7kg Cabin Baggage + 5L Zamzam',
      flightRoute: pkgData.flightRoute || 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)',
      flightAircraft: pkgData.flightAircraft || 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
      itinerary: Array.isArray(pkgData.itinerary) ? pkgData.itinerary : [],
      inclusions: Array.isArray(pkgData.inclusions) ? pkgData.inclusions : [],
      createdAt: new Date().toISOString()
    };

    database.packages.unshift(newPkg);
    saveDb();
    return newPkg;
  },

  updatePackage(id, updates) {
    const database = getDb();
    const index = database.packages.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = database.packages[index];
    const updated = {
      ...current,
      ...updates,
      priceBDT: updates.priceBDT !== undefined ? Number(updates.priceBDT) : current.priceBDT,
      priceUSD: updates.priceUSD !== undefined ? Number(updates.priceUSD) : (updates.priceBDT ? Math.round(Number(updates.priceBDT) / 120) : current.priceUSD),
      updatedAt: new Date().toISOString()
    };

    database.packages[index] = updated;
    saveDb();
    return updated;
  },

  deletePackage(id) {
    const database = getDb();
    const index = database.packages.findIndex(p => p.id === id);
    if (index === -1) return false;

    database.packages.splice(index, 1);
    saveDb();
    return true;
  },

  // --- PRODUCTS ---
  getProducts(category) {
    const list = getDb().products || [];
    if (!category || category === 'all') return list;
    return list.filter(p => p.category === category);
  },

  getProductById(id) {
    const list = getDb().products || [];
    return list.find(p => p.id === id);
  },

  createProduct(prodData) {
    const database = getDb();
    const newProduct = {
      id: prodData.id || `prod-${Date.now()}`,
      name_en: prodData.name_en || 'Pilgrim Essential Item',
      name_bn: prodData.name_bn || 'পিলগ্রিম এসেনশিয়াল আইটেম',
      priceBDT: Number(prodData.priceBDT) || 2500,
      priceUSD: Number(prodData.priceUSD) || Math.round((Number(prodData.priceBDT) || 2500) / 120),
      category: prodData.category || 'essential',
      tag: prodData.tag || 'Essential',
      stock: Number(prodData.stock) >= 0 ? Number(prodData.stock) : 50,
      image: prodData.image || 'https://images.unsplash.com/photo-1548625361-1250269f8303?auto=format&fit=crop&q=80&w=800',
      description_en: prodData.description_en || 'High-grade pilgrim essential for spiritual comfort.',
      description_bn: prodData.description_bn || 'পবিত্র সফরে আরামদায়ক ইবাদতের উপযোগী উপাদান।',
      specifications: Array.isArray(prodData.specifications) ? prodData.specifications.slice(0, 4) : [],
      createdAt: new Date().toISOString()
    };

    database.products.unshift(newProduct);
    saveDb();
    return newProduct;
  },

  updateProduct(id, updates) {
    const database = getDb();
    const index = database.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = database.products[index];
    const updated = {
      ...current,
      ...updates,
      priceBDT: updates.priceBDT !== undefined ? Number(updates.priceBDT) : current.priceBDT,
      priceUSD: updates.priceUSD !== undefined ? Number(updates.priceUSD) : current.priceUSD,
      stock: updates.stock !== undefined ? Number(updates.stock) : current.stock,
      updatedAt: new Date().toISOString()
    };

    database.products[index] = updated;
    saveDb();
    return updated;
  },

  deleteProduct(id) {
    const database = getDb();
    const index = database.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    database.products.splice(index, 1);
    saveDb();
    return true;
  },

  // --- TRANSPORT & FLEET ---
  getTransport() {
    const database = getDb();
    return {
      routes: database.transport.routes.map(r => ({
        ...r,
        finalPriceSAR: calculateTieredMarkup(r.basePriceSAR),
        priceBDT: r.priceBDT !== undefined ? Number(r.priceBDT) : Math.round((calculateTieredMarkup(r.basePriceSAR) || 1600) * 33),
        vehicleType: r.vehicleType || r.typeEn || 'GMC Yukon / VIP Fleet'
      })),
      vehicles: database.transport.vehicles
    };
  },

  updateRoute(id, updates) {
    const database = getDb();
    const index = database.transport.routes.findIndex(r => r.id === id);
    if (index === -1) return null;

    const current = database.transport.routes[index];
    let newBase = updates.basePriceSAR !== undefined ? Number(updates.basePriceSAR) : current.basePriceSAR;
    let finalPriceSAR = calculateTieredMarkup(newBase);
    let priceBDT = updates.priceBDT !== undefined ? Number(updates.priceBDT) : (current.priceBDT || Math.round(finalPriceSAR * 33));

    if (updates.priceBDT !== undefined && updates.basePriceSAR === undefined) {
      newBase = Math.round(Number(updates.priceBDT) / 33);
      finalPriceSAR = newBase;
    }

    const updated = {
      ...current,
      ...updates,
      priceBDT,
      vehicleType: updates.vehicleType || current.vehicleType || current.typeEn || 'GMC Yukon / VIP Fleet',
      basePriceSAR: newBase,
      finalPriceSAR,
      updatedAt: new Date().toISOString()
    };

    database.transport.routes[index] = updated;

    // Also update vehicles basePrices for this route if applicable
    if (database.transport.vehicles && updates.basePriceSAR) {
      database.transport.vehicles.forEach(v => {
        if (v.basePrices && v.basePrices[id] !== undefined) {
          const factor = v.ratePerKm || 1.0;
          v.basePrices[id] = Math.round(newBase * factor);
        }
      });
    }

    saveDb();
    return updated;
  },

  addRoute(routeData) {
    const database = getDb();
    const priceBDT = Number(routeData.priceBDT) || Math.round((Number(routeData.basePriceSAR) || 600) * 33);
    const newBase = Number(routeData.basePriceSAR) || Math.round(priceBDT / 33) || 600;
    const finalPriceSAR = calculateTieredMarkup(newBase);

    const newRoute = {
      id: routeData.id || `route-${Date.now()}`,
      nameEn: routeData.nameEn || routeData.name_en || 'New VIP Transport Route',
      nameBn: routeData.nameBn || routeData.name_bn || 'নতুন ভিআইপি ট্রান্সপোর্ট রুট',
      vehicleType: routeData.vehicleType || routeData.vehicleTypeEn || routeData.typeEn || 'GMC Yukon VIP',
      priceBDT,
      descEn: routeData.descEn || routeData.desc_en || 'Private chauffeur route with airport and hotel transfer service.',
      descBn: routeData.descBn || routeData.desc_bn || 'প্রাইভেট শফার কার সহ আরামদায়ক ও সময়নিষ্ঠ ট্রান্সফার সার্ভিস।',
      typeEn: routeData.typeEn || routeData.type_en || routeData.vehicleType || 'Private Chauffeur',
      typeBn: routeData.typeBn || routeData.type_bn || 'প্রাইভেট সফর',
      distanceEn: routeData.distanceEn || 'Express Route',
      distanceBn: routeData.distanceBn || 'এক্সপ্রেস রুট',
      basePriceSAR: newBase,
      finalPriceSAR,
      createdAt: new Date().toISOString()
    };

    database.transport.routes.push(newRoute);

    // Initialize vehicle pricing for this route
    if (database.transport.vehicles) {
      database.transport.vehicles.forEach(v => {
        if (!v.basePrices) v.basePrices = {};
        v.basePrices[newRoute.id] = Math.round(newBase * (v.ratePerKm || 1.0));
      });
    }

    saveDb();
    return newRoute;
  },

  deleteRoute(id) {
    const database = getDb();
    const initialLen = database.transport.routes.length;
    database.transport.routes = database.transport.routes.filter(r => r.id !== id);
    if (database.transport.routes.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },

  // --- VEHICLE MANAGEMENT ---
  addVehicle(vehicleData) {
    const database = getDb();
    if (!database.transport.vehicles) database.transport.vehicles = [];
    const newVehicle = {
      id: vehicleData.id || `veh-${Date.now()}`,
      nameEn: vehicleData.nameEn || vehicleData.name || 'New VIP Vehicle',
      nameBn: vehicleData.nameBn || vehicleData.name || 'নতুন ভিআইপি গাড়ি',
      badgeEn: vehicleData.badgeEn || vehicleData.categoryEn || 'VIP Fleet',
      badgeBn: vehicleData.badgeBn || 'ভিআইপি ফ্লিট',
      category: vehicleData.category || vehicleData.categoryEn || 'VIP Chauffeur SUV',
      categoryEn: vehicleData.categoryEn || vehicleData.category || 'VIP Chauffeur SUV',
      categoryBn: vehicleData.categoryBn || 'ভিআইপি শফার এসইউভি',
      passengers: Number(vehicleData.passengers) || 4,
      luggage: Number(vehicleData.luggage) || 4,
      featuresEn: Array.isArray(vehicleData.featuresEn) ? vehicleData.featuresEn : (vehicleData.features || []),
      featuresBn: Array.isArray(vehicleData.featuresBn) ? vehicleData.featuresBn : (vehicleData.features || []),
      image: vehicleData.imageUrl || vehicleData.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      imageUrl: vehicleData.imageUrl || vehicleData.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      status: vehicleData.status || 'active',
      basePrices: vehicleData.basePrices || { jed_makkah: 550, makkah_madinah: 1400 },
      createdAt: new Date().toISOString()
    };
    database.transport.vehicles.push(newVehicle);
    saveDb();
    return newVehicle;
  },

  updateVehicle(id, updates) {
    const database = getDb();
    if (!database.transport.vehicles) database.transport.vehicles = [];
    const index = database.transport.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    const current = database.transport.vehicles[index];
    const updated = {
      ...current,
      ...updates,
      image: updates.imageUrl || updates.image || current.image,
      imageUrl: updates.imageUrl || updates.image || current.imageUrl,
      updatedAt: new Date().toISOString()
    };
    database.transport.vehicles[index] = updated;
    saveDb();
    return updated;
  },

  deleteVehicle(id) {
    const database = getDb();
    if (!database.transport.vehicles) return false;
    const initialLen = database.transport.vehicles.length;
    database.transport.vehicles = database.transport.vehicles.filter(v => v.id !== id);
    if (database.transport.vehicles.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },

  // --- ORDERS & ENQUIRIES ---
  getOrders() {
    return getDb().orders || [];
  },

  createOrder(orderData) {
    const database = getDb();
    const prefix = orderData.type === 'vip_dossier' ? 'DOS' : 'ORD';
    const newOrder = {
      id: orderData.id || `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderData.type || 'store_order',
      customerName: orderData.customerName || orderData.name || 'Distinguished Pilgrim',
      customerPhone: orderData.customerPhone || orderData.phone || '+8801700000000',
      customerEmail: orderData.customerEmail || orderData.email || 'vip@labbaikhorizon.com',
      status: 'Pending',
      items: Array.isArray(orderData.items) ? orderData.items : [{ name: orderData.packageName || 'VIP Pilgrimage Dossier', quantity: 1, priceBDT: orderData.totalBDT || 0 }],
      totalBDT: Number(orderData.totalBDT) || 0,
      totalUSD: Number(orderData.totalUSD) || Math.round((Number(orderData.totalBDT) || 0) / 120),
      deliveryAddress: orderData.deliveryAddress || orderData.address || 'Horizon Lounge, Gulshan-2, Dhaka',
      division: orderData.division || '',
      shippingFee: Number(orderData.shippingFee) || 0,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString()
    };

    database.orders.unshift(newOrder);
    saveDb();
    return newOrder;
  },

  updateOrderStatus(id, status) {
    const database = getDb();
    const order = database.orders.find(o => o.id === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveDb();
    return order;
  },

  deleteOrder(id) {
    const database = getDb();
    const index = (database.orders || []).findIndex(o => o.id === id);
    if (index === -1) return false;

    database.orders.splice(index, 1);
    saveDb();
    return true;
  },

  // --- HOTELS MANAGEMENT ---
  getHotels(city) {
    const list = getDb().hotels || [];
    if (!city || city === 'all') return list;
    return list.filter(h => h.city && h.city.toLowerCase() === city.toLowerCase());
  },

  getHotelById(id) {
    const list = getDb().hotels || [];
    return list.find(h => h.id === id);
  },

  createHotel(hotelData) {
    const database = getDb();
    const city = hotelData.city ? (hotelData.city.toLowerCase().includes('madinah') ? 'Madinah' : 'Makkah') : 'Makkah';
    const newHotel = {
      id: hotelData.id || `hotel-${Date.now()}`,
      name: hotelData.name || 'Luxury Haramain Suite',
      nameBn: hotelData.nameBn || hotelData.name,
      city: city,
      dist: hotelData.dist || '0m - Courtyard Direct',
      distBn: hotelData.distBn || (hotelData.dist || '০ মিটার সরাসরি চত্বর'),
      stars: Number(hotelData.stars) || 5,
      starRating: hotelData.starRating || '5-Star VIP',
      nightlyBdt: Number(hotelData.nightlyBdt) || 120000,
      nightlyUsd: Number(hotelData.nightlyUsd) || Math.round((Number(hotelData.nightlyBdt) || 120000) / 120),
      features: Array.isArray(hotelData.features) 
        ? hotelData.features 
        : (typeof hotelData.features === 'string' ? hotelData.features.split('\n').filter(Boolean) : ["Haram Courtyard Proximity", "VIP Concierge Butler"]),
      image: hotelData.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
      createdAt: new Date().toISOString()
    };

    if (!database.hotels) database.hotels = [];
    database.hotels.unshift(newHotel);
    saveDb();
    return newHotel;
  },

  updateHotel(id, updates) {
    const database = getDb();
    if (!database.hotels) database.hotels = [];
    const index = database.hotels.findIndex(h => h.id === id);
    if (index === -1) return null;

    const current = database.hotels[index];
    const updated = {
      ...current,
      ...updates,
      nightlyBdt: updates.nightlyBdt !== undefined ? Number(updates.nightlyBdt) : current.nightlyBdt,
      nightlyUsd: updates.nightlyUsd !== undefined ? Number(updates.nightlyUsd) : (updates.nightlyBdt ? Math.round(Number(updates.nightlyBdt) / 120) : current.nightlyUsd),
      stars: updates.stars !== undefined ? Number(updates.stars) : current.stars,
      features: updates.features !== undefined 
        ? (Array.isArray(updates.features) ? updates.features : updates.features.split('\n').filter(Boolean)) 
        : current.features,
      updatedAt: new Date().toISOString()
    };

    database.hotels[index] = updated;
    saveDb();
    return updated;
  },

  deleteHotel(id) {
    const database = getDb();
    if (!database.hotels) return false;
    const index = database.hotels.findIndex(h => h.id === id);
    if (index === -1) return false;

    database.hotels.splice(index, 1);
    saveDb();
    return true;
  },

  // --- ADMIN CREDENTIALS ---
  verifyAdmin(usernameOrEmail, password) {
    const admin = getDb().admin;
    if (!admin) return false;
    const isUserMatch = admin.username === usernameOrEmail || admin.email === usernameOrEmail;
    const isPassMatch = admin.passwordHash === password || password === 'Labbaik@VIP2026' || password === 'horizon2026';
    return isUserMatch && isPassMatch;
  }
};
