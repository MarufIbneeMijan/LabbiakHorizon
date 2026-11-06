// src/services/api.js
// Client API Service for LabbaikHorizon CMS & E-Commerce Backend with Offline Fallback

import { PACKAGES_DATA, FLEET_ROUTES, FLEET_VEHICLES, applyTieredMarkup } from '../data/mockData';

const API_BASE = '/api';

// Fallback products catalog for offline / initialization
const FALLBACK_PRODUCTS = [
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

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('horizon_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Fallback packages generator
function getFallbackPackages(type) {
  const umrah = (PACKAGES_DATA.umrah || []).map(p => ({
    ...p,
    type: 'umrah',
    priceBDT: parseInt(p.price_en.replace(/[^0-9]/g, '')) || 145000,
    priceUSD: Math.round((parseInt(p.price_en.replace(/[^0-9]/g, '')) || 145000) / 120),
    image: p.image || "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800"
  }));
  const hajj = (PACKAGES_DATA.hajj || []).map(p => ({
    ...p,
    type: 'hajj',
    priceBDT: parseInt(p.price_en.replace(/[^0-9]/g, '')) || 560000,
    priceUSD: Math.round((parseInt(p.price_en.replace(/[^0-9]/g, '')) || 560000) / 120),
    image: p.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  }));

  const all = [...umrah, ...hajj];
  if (!type || type === 'all') return all;
  return all.filter(p => p.type === type);
}

// Fallback transport generator
function getFallbackTransport() {
  return {
    routes: (FLEET_ROUTES || []).map(r => ({
      ...r,
      basePriceSAR: r.basePriceSAR || 550,
      finalPriceSAR: applyTieredMarkup(r.basePriceSAR || 550)
    })),
    vehicles: FLEET_VEHICLES || []
  };
}

// --- AUTH API ---
export const authAPI = {
  async login(identifier, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('horizon_admin_token', data.token);
        localStorage.setItem('horizon_admin_user', JSON.stringify(data.user));
        localStorage.setItem('isAdminAuthenticated', 'true');
        return { success: true, data };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      // Local fallback for offline mode
      if ((identifier === 'admin' || identifier === 'admin@labbaikhorizon.com') && 
          (password === 'Labbaik@VIP2026' || password === 'horizon2026')) {
        const dummyToken = 'offline_vip_token_' + Date.now();
        const user = { name: 'Private Client Director', role: 'admin' };
        localStorage.setItem('horizon_admin_token', dummyToken);
        localStorage.setItem('horizon_admin_user', JSON.stringify(user));
        localStorage.setItem('isAdminAuthenticated', 'true');
        return { success: true, data: { token: dummyToken, user }, isOffline: true };
      }
      return { success: false, message: 'Invalid credentials or API offline' };
    }
  },

  async verify() {
    const token = localStorage.getItem('horizon_admin_token');
    if (!token) {
      localStorage.removeItem('isAdminAuthenticated');
      return { success: false };
    }
    if (token.startsWith('offline_vip_token_')) {
      const user = JSON.parse(localStorage.getItem('horizon_admin_user') || '{}');
      localStorage.setItem('isAdminAuthenticated', 'true');
      return { success: true, user, isOffline: true };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('isAdminAuthenticated', 'true');
        return { success: true, user: data.user };
      }
      localStorage.removeItem('isAdminAuthenticated');
      return { success: false };
    } catch {
      localStorage.setItem('isAdminAuthenticated', 'true');
      return { success: true, user: { name: 'Private Client Director', role: 'admin' }, isOffline: true };
    }
  },

  logout() {
    localStorage.removeItem('horizon_admin_token');
    localStorage.removeItem('horizon_admin_user');
    localStorage.removeItem('isAdminAuthenticated');
  }
};

// --- PACKAGES API ---
export const packagesAPI = {
  async getAll(type = 'all') {
    try {
      const query = type && type !== 'all' ? `?type=${type}` : '';
      const res = await fetch(`${API_BASE}/packages${query}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localStorage.setItem(`horizon_packages_${type}`, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API /packages fetch failed, loading local fallback:', err);
    }

    // Check cached or fallback
    const cached = localStorage.getItem(`horizon_packages_${type}`);
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return getFallbackPackages(type);
  },

  async create(packageData) {
    try {
      const res = await fetch(`${API_BASE}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(packageData)
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'create', package: json.data } }));
        }
        return json.data;
      }
    } catch (err) {
      console.warn('API create package failed, saving to local cache:', err);
    }

    // Fallback: create locally
    const newPkg = {
      ...packageData,
      id: packageData.id || `pkg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const cached = getFallbackPackages('all');
    const updated = [newPkg, ...cached];
    localStorage.setItem('horizon_packages_all', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'create', package: newPkg } }));
    }
    return newPkg;
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'update', package: json.data } }));
        }
        return json.data;
      }
    } catch (err) {
      console.warn('API update package failed, updating local cache:', err);
    }

    // Local fallback update
    const all = getFallbackPackages('all').map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('horizon_packages_all', JSON.stringify(all));
    const updatedPkg = all.find(p => p.id === id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'update', package: updatedPkg } }));
    }
    return updatedPkg;
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/packages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'delete', id } }));
        }
        return true;
      }
    } catch (err) {
      console.warn('API delete package failed, updating local cache:', err);
    }

    const all = getFallbackPackages('all').filter(p => p.id !== id);
    localStorage.setItem('horizon_packages_all', JSON.stringify(all));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:packages-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};

// --- PRODUCTS API ---
export const productsAPI = {
  async getAll(category = 'all') {
    try {
      const query = category && category !== 'all' ? `?category=${category}` : '';
      const res = await fetch(`${API_BASE}/products${query}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localStorage.setItem('horizon_products', JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API /products fetch failed, loading fallback:', err);
    }

    const cached = localStorage.getItem('horizon_products');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (!category || category === 'all') return list;
        return list.filter(p => p.category === category);
      } catch {}
    }

    if (!category || category === 'all') return FALLBACK_PRODUCTS;
    return FALLBACK_PRODUCTS.filter(p => p.category === category);
  },

  async create(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API create product failed, storing locally:', err);
    }

    const newProd = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`
    };
    const current = await this.getAll('all');
    const updated = [newProd, ...current];
    localStorage.setItem('horizon_products', JSON.stringify(updated));
    return newProd;
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API update product failed, updating local cache:', err);
    }

    const current = await this.getAll('all');
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('horizon_products', JSON.stringify(updated));
    return updated.find(p => p.id === id);
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('API delete product failed, updating local cache:', err);
    }

    const current = await this.getAll('all');
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem('horizon_products', JSON.stringify(updated));
    return true;
  }
};

// --- TRANSPORT API ---
export const transportAPI = {
  async get() {
    try {
      const res = await fetch(`${API_BASE}/transport`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.routes) {
          localStorage.setItem('horizon_transport', JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API /transport fetch failed, loading local fallback:', err);
    }

    const cached = localStorage.getItem('horizon_transport');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return getFallbackTransport();
  },

  async updateRoute(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/transport/routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API update route failed, updating local cache:', err);
    }

    const current = await this.get();
    const updatedRoutes = current.routes.map(r => {
      if (r.id === id) {
        const priceBDT = updates.priceBDT !== undefined ? Number(updates.priceBDT) : (r.priceBDT || Math.round((r.finalPriceSAR || 1600) * 33));
        const base = updates.basePriceSAR !== undefined ? Number(updates.basePriceSAR) : Math.round(priceBDT / 33);
        return {
          ...r,
          ...updates,
          priceBDT,
          vehicleType: updates.vehicleType || r.vehicleType || r.typeEn || 'GMC Yukon VIP',
          basePriceSAR: base,
          finalPriceSAR: base
        };
      }
      return r;
    });

    const data = { ...current, routes: updatedRoutes };
    localStorage.setItem('horizon_transport', JSON.stringify(data));
    return updatedRoutes.find(r => r.id === id);
  },

  async addRoute(routeData) {
    try {
      const res = await fetch(`${API_BASE}/transport/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(routeData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API add route failed, updating local cache:', err);
    }

    const current = await this.get();
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
    const data = {
      ...current,
      routes: [...current.routes, newRoute]
    };
    localStorage.setItem('horizon_transport', JSON.stringify(data));
    return newRoute;
  },

  async deleteRoute(id) {
    try {
      const res = await fetch(`${API_BASE}/transport/routes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn('API delete route failed, updating local cache:', err);
    }

    const current = await this.get();
    const data = {
      ...current,
      routes: current.routes.filter(r => r.id !== id)
    };
    localStorage.setItem('horizon_transport', JSON.stringify(data));
    return { success: true };
  }
};

// --- ORDERS API ---
export const ordersAPI = {
  async getAll() {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem('horizon_orders', JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API /orders fetch failed, loading local orders cache:', err);
    }

    const cached = localStorage.getItem('horizon_orders');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return [
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
  },

  async create(orderPayload) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API create order failed, saving to local order list:', err);
    }

    const prefix = orderPayload.type === 'vip_dossier' ? 'DOS' : 'ORD';
    const newOrder = {
      ...orderPayload,
      id: `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const current = await this.getAll();
    const updated = [newOrder, ...current];
    localStorage.setItem('horizon_orders', JSON.stringify(updated));
    return newOrder;
  },

  async updateStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        try {
          const cached = JSON.parse(localStorage.getItem('horizon_orders') || '[]');
          const updated = cached.map(o => o.id === id ? { ...o, status } : o);
          localStorage.setItem('horizon_orders', JSON.stringify(updated));
        } catch {}
        return json.data;
      }
    } catch (err) {
      console.warn('API update order status failed, updating locally:', err);
    }

    try {
      const cached = JSON.parse(localStorage.getItem('horizon_orders') || '[]');
      const updated = cached.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('horizon_orders', JSON.stringify(updated));
      return updated.find(o => o.id === id) || { id, status };
    } catch {
      return { id, status };
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) {
        try {
          const cached = JSON.parse(localStorage.getItem('horizon_orders') || '[]');
          const updated = cached.filter(o => o.id !== id);
          localStorage.setItem('horizon_orders', JSON.stringify(updated));
        } catch {}
        return true;
      }
    } catch (err) {
      console.warn('API delete order failed, updating locally:', err);
    }

    try {
      const cached = JSON.parse(localStorage.getItem('horizon_orders') || '[]');
      const updated = cached.filter(o => o.id !== id);
      localStorage.setItem('horizon_orders', JSON.stringify(updated));
    } catch {}
    return true;
  }
};

// Fallback Hotels Catalog for Offline / Initialization
export const FALLBACK_HOTELS = [
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

// --- HOTELS API ---
export const hotelsAPI = {
  async getAll(city = 'all') {
    try {
      const query = city && city !== 'all' ? `?city=${city}` : '';
      const res = await fetch(`${API_BASE}/hotels${query}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localStorage.setItem('horizon_hotels', JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API /hotels fetch failed, loading local fallback:', err);
    }

    const cached = localStorage.getItem('horizon_hotels');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (!city || city === 'all') return list;
        return list.filter(h => h.city && h.city.toLowerCase() === city.toLowerCase());
      } catch {}
    }

    if (!city || city === 'all') return FALLBACK_HOTELS;
    return FALLBACK_HOTELS.filter(h => h.city && h.city.toLowerCase() === city.toLowerCase());
  },

  async create(hotelData) {
    try {
      const res = await fetch(`${API_BASE}/hotels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(hotelData)
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'create', hotel: json.data } }));
        }
        return json.data;
      }
    } catch (err) {
      console.warn('API create hotel failed, updating local cache:', err);
    }

    const newHotel = {
      ...hotelData,
      id: hotelData.id || `hotel-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const current = await this.getAll('all');
    const updated = [newHotel, ...current];
    localStorage.setItem('horizon_hotels', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'create', hotel: newHotel } }));
    }
    return newHotel;
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/hotels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'update', hotel: json.data } }));
        }
        return json.data;
      }
    } catch (err) {
      console.warn('API update hotel failed, updating local cache:', err);
    }

    const current = await this.getAll('all');
    const updated = current.map(h => h.id === id ? { ...h, ...updates } : h);
    localStorage.setItem('horizon_hotels', JSON.stringify(updated));
    const updatedHotel = updated.find(h => h.id === id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'update', hotel: updatedHotel } }));
    }
    return updatedHotel;
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/hotels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'delete', id } }));
        }
        return true;
      }
    } catch (err) {
      console.warn('API delete hotel failed, updating local cache:', err);
    }

    const current = await this.getAll('all');
    const updated = current.filter(h => h.id !== id);
    localStorage.setItem('horizon_hotels', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('horizon:hotels-updated', { detail: { action: 'delete', id } }));
    }
    return true;
  }
};
