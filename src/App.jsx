import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PackagesSection from './components/PackagesSection';
import ConciergeCurator from './components/ConciergeCurator';
import ConciergeWizardModal from './components/ConciergeWizardModal';
import FleetSection from './components/FleetSection';
import SuiteShowcase from './components/SuiteShowcase';
import StoreSection from './components/StoreSection';
import ConciergePillars from './components/ConciergePillars';
import FaqSection from './components/FaqSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import CheckoutModal from './components/CheckoutModal';
import PrivateDossierModal from './components/PrivateDossierModal';
import PdfQuotationModal from './components/PdfQuotationModal';
import AdminDashboard from './components/AdminDashboard';
import AdminAuthGuard from './components/AdminAuthGuard';
import CartDrawer from './components/CartDrawer';
import ShopPage from './components/ShopPage';

// Homepage Component holding the primary sanctuary pilgrimage sections
function HomePage({
  locale,
  toggleLocale,
  theme,
  setTheme,
  cartCount,
  onOpenCart,
  onOpenConsultationWithPreset,
  scrollToCurator,
  onOpenWizard,
  handleAddToCart,
  handleBuyNow,
  navigate
}) {
  return (
    <div className="min-h-screen theme-bg-root bg-[#080809] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      
      {/* Luxury Navigation Header */}
      <Navbar
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onSelectTheme={setTheme}
        onOpenConsultation={() => onOpenConsultationWithPreset()}
        onNavigateCurator={scrollToCurator}
        onOpenWizard={onOpenWizard}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />

      {/* Main Luxury Sections */}
      <main className="flex-1">
        <Hero
          locale={locale}
          onOpenConsultation={() => onOpenConsultationWithPreset()}
          onNavigateCurator={scrollToCurator}
          onOpenWizard={onOpenWizard}
        />

        {/* 1. CURATED HAJJ & UMRAH VERIFIED PACKAGES (WITH HIGH-RESOLUTION ISLAMIC IMAGERY) */}
        <PackagesSection
          locale={locale}
          onSelectPackage={onOpenConsultationWithPreset}
          onOpenWizard={onOpenWizard}
        />
        
        {/* 2. ATTENTION-GRABBING CUSTOM TOUR BUILDER */}
        <ConciergeCurator
          locale={locale}
          onOpenWizard={onOpenWizard}
          onOpenConsultation={onOpenConsultationWithPreset}
        />

        {/* 3. BESPOKE PRIVATE ROYAL FLEET & CHAUFFEUR SERVICES SECTION */}
        <FleetSection
          locale={locale}
          onConfirmFleet={onOpenConsultationWithPreset}
        />

        {/* 4. SANCTUARY SUITES SHOWCASE */}
        <SuiteShowcase
          locale={locale}
          onOpenConsultation={onOpenConsultationWithPreset}
        />

        {/* 5. PILGRIM ESSENTIALS PREVIEW GRID (WITH "VISIT FULL STORE" CTA) */}
        <StoreSection
          locale={locale}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onNavigateShop={() => navigate('/shop')}
        />
        
        {/* 6. CONCIERGE PILLARS */}
        <ConciergePillars
          locale={locale}
        />
        
        {/* 7. COMPREHENSIVE LUXURY FAQ ACCORDION */}
        <FaqSection
          locale={locale}
        />

        {/* 8. TESTIMONIALS */}
        <Testimonials
          locale={locale}
        />
      </main>

      {/* Global Footer */}
      <Footer
        locale={locale}
        onOpenConsultation={() => onOpenConsultationWithPreset()}
      />

    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Locale State: 'bn' (default) | 'en'
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('horizon_locale') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('horizon_locale', locale);
  }, [locale]);

  // Theme State: 'kiswah' (default) | 'emerald' | 'desert'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('horizon_theme') || 'kiswah';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('horizon_theme', theme);
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Modals & Drawers States
  const [wizardOpen, setWizardOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [dossierData, setDossierData] = useState(null);
  const [presetDataForModal, setPresetDataForModal] = useState(null);
  const [pdfModalData, setPdfModalData] = useState(null);

  // E-Commerce Cart & Checkout State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('horizon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [checkoutItems, setCheckoutItems] = useState([]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('horizon_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const scrollToCurator = () => {
    if (location.pathname !== '/') {
      navigate('/#curator');
      return;
    }
    const curatorElem = document.getElementById('custom-package') || document.getElementById('curator');
    if (curatorElem) {
      curatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tour reservation modal trigger (for Hajj/Umrah Packages, Custom Tours & Vehicles)
  const handleOpenConsultationWithPreset = (data = null) => {
    if (data) {
      setPresetDataForModal(data);
    }
    setContactModalOpen(true);
  };

  // Cart Management Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name_en,
          name_en: product.name_en,
          name_bn: product.name_bn,
          priceBDT: product.priceBDT,
          priceUSD: product.priceUSD,
          image: product.image,
          quantity: quantity
        }
      ];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Proceed to Checkout for entire Cart Drawer
  const handleProceedToCheckout = (items) => {
    const targetItems = items && items.length > 0 ? items : cartItems;
    if (targetItems.length === 0) return;
    setCheckoutItems(targetItems);
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  // Direct "Buy Now" handler for a single product from Store / ShopPage
  const handleBuyNow = (product, quantity = 1) => {
    setCheckoutItems([
      {
        id: product.id,
        name: product.name_en,
        name_en: product.name_en,
        name_bn: product.name_bn,
        priceBDT: product.priceBDT,
        priceUSD: product.priceUSD,
        image: product.image,
        quantity: quantity
      }
    ]);
    setCheckoutModalOpen(true);
  };

  // On successful order in CheckoutModal
  const handleOrderSuccess = (orderData) => {
    // 1. Clear cart state and persisted cart in localStorage
    setCartItems([]);
    try {
      localStorage.removeItem('horizon_cart');
    } catch {}

    // Do NOT close CheckoutModal, do NOT navigate, and do NOT scroll to #packages!
    // The CheckoutModal displays its own internal success view (setSubmitted(true)) so the user stays inside the modal.
  };

  // On successful reservation in ContactModal
  const handleReservationSuccess = (resData) => {
    // ContactModal displays its own internal success view (setSubmitted(true)) so the user stays inside the modal.
  };

  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return (
    <>
      <Routes>
        {/* HOMEPAGE ROUTE */}
        <Route
          path="/"
          element={
            <HomePage
              locale={locale}
              toggleLocale={toggleLocale}
              theme={theme}
              setTheme={setTheme}
              cartCount={cartCount}
              onOpenCart={() => setCartDrawerOpen(true)}
              onOpenConsultationWithPreset={handleOpenConsultationWithPreset}
              scrollToCurator={scrollToCurator}
              onOpenWizard={() => setWizardOpen(true)}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              navigate={navigate}
            />
          }
        />

        {/* DEDICATED STANDALONE E-COMMERCE SHOP ROUTE (/shop) FOR SOCIAL MEDIA ADS */}
        <Route
          path="/shop"
          element={
            <ShopPage
              locale={locale}
              onToggleLocale={toggleLocale}
              theme={theme}
              onSelectTheme={setTheme}
              cartItems={cartItems}
              cartCount={cartCount}
              onOpenCart={() => setCartDrawerOpen(true)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onOpenConsultation={() => handleOpenConsultationWithPreset()}
            />
          }
        />

        {/* DEDICATED PRIVATE ADMIN CMS & ORDERS ROUTE (/admin) */}
        <Route
          path="/admin"
          element={
            <AdminAuthGuard>
              <AdminDashboard locale={locale} />
            </AdminAuthGuard>
          }
        />

        {/* CATCH-ALL REDIRECT TO HOME */}
        <Route
          path="*"
          element={
            <HomePage
              locale={locale}
              toggleLocale={toggleLocale}
              theme={theme}
              setTheme={setTheme}
              cartCount={cartCount}
              onOpenCart={() => setCartDrawerOpen(true)}
              onOpenConsultationWithPreset={handleOpenConsultationWithPreset}
              scrollToCurator={scrollToCurator}
              onOpenWizard={() => setWizardOpen(true)}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              navigate={navigate}
            />
          }
        />
      </Routes>

      {/* FULL-SCREEN INTERACTIVE MULTI-STEP GUIDED CONCIERGE WIZARD */}
      <ConciergeWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        locale={locale}
        onOpenPdfModal={(data) => setPdfModalData(data)}
      />

      {/* VIP CREDENTIALS RESERVATION MODAL (FOR TOURS, PACKAGES & FLEET RESERVATIONS) */}
      {contactModalOpen && (
        <ContactModal
          locale={locale}
          presetData={presetDataForModal}
          onClose={() => {
            setContactModalOpen(false);
            setPresetDataForModal(null);
          }}
          onSubmitSuccess={handleReservationSuccess}
        />
      )}

      {/* DEDICATED E-COMMERCE CHECKOUT MODAL (WITH COD, ADDRESS, BANGLADESH DIVISIONS & SHIPPING FEES) */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        locale={locale}
        items={checkoutItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* SLIDE-IN PILGRIM ESSENTIALS CART DRAWER */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        locale={locale}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        onExploreStore={() => {
          setCartDrawerOpen(false);
          navigate('/shop');
        }}
      />

      {/* Instant Printable VIP Dossier Modal */}
      {dossierData && (
        <PrivateDossierModal
          locale={locale}
          data={dossierData}
          onClose={() => setDossierData(null)}
        />
      )}

      {/* Instant Printable PDF Quotation Modal */}
      {pdfModalData && (
        <PdfQuotationModal
          data={pdfModalData}
          onClose={() => setPdfModalData(null)}
        />
      )}

    </>
  );
}
