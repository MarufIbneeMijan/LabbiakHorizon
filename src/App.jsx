import React, { useState, useEffect } from 'react';
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
import PrivateDossierModal from './components/PrivateDossierModal';
import PdfQuotationModal from './components/PdfQuotationModal';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';

export default function App() {
  // Locale State: 'en' | 'bn'
  const [locale, setLocale] = useState('en');

  // Theme State: 'kiswah' (default) | 'emerald' | 'desert'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('horizon_theme') || 'kiswah';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('horizon_theme', theme);
  }, [theme]);

  // Modals & Drawers States
  const [wizardOpen, setWizardOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [dossierData, setDossierData] = useState(null);
  const [presetDataForModal, setPresetDataForModal] = useState(null);
  const [pdfModalData, setPdfModalData] = useState(null);

  // E-Commerce Cart State
  const [cartItems, setCartItems] = useState([]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const scrollToCurator = () => {
    const curatorElem = document.getElementById('custom-package') || document.getElementById('curator');
    if (curatorElem) {
      curatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe reservation modal trigger - removes broken triggers causing blank-screens
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

  const handleProceedToCheckout = (items, totalBDT) => {
    const summaryItems = items.map((i) => `${i.name_en || i.name} (x${i.quantity || 1})`).join(', ');
    handleOpenConsultationWithPreset({
      tier: locale === 'bn' ? 'অনলাইন শপ অর্ডার চেকআউট' : 'Store Purchase Checkout',
      packageName: `Cart Items: ${summaryItems}`,
      totalBDT: totalBDT,
      type: 'STORE PURCHASE'
    });
  };

  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return (
    <div className="min-h-screen theme-bg-root bg-[#080809] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#080809]">
      
      {/* Kiswah Luxury Navigation Header with Language & Theme Switcher */}
      <Navbar
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onSelectTheme={setTheme}
        onOpenConsultation={() => handleOpenConsultationWithPreset()}
        onNavigateCurator={scrollToCurator}
        onOpenWizard={() => setWizardOpen(true)}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Main Luxury Content Sections */}
      <main className="flex-1">
        <Hero
          locale={locale}
          onOpenConsultation={() => handleOpenConsultationWithPreset()}
          onNavigateCurator={scrollToCurator}
          onOpenWizard={() => setWizardOpen(true)}
        />

        {/* 1. CURATED HAJJ & UMRAH VERIFIED PACKAGES (CMS HYDRATED - ONLY ONE UNIFIED SECTION) */}
        <PackagesSection
          locale={locale}
          onSelectPackage={handleOpenConsultationWithPreset}
          onOpenWizard={() => setWizardOpen(true)}
        />
        
        {/* 2. ATTENTION-GRABBING CUSTOM TOUR BUILDER (NO DUPLICATE PACKAGES) */}
        <ConciergeCurator
          locale={locale}
          onOpenWizard={() => setWizardOpen(true)}
          onOpenConsultation={handleOpenConsultationWithPreset}
        />

        {/* 3. BESPOKE PRIVATE ROYAL FLEET & CHAUFFEUR SERVICES SECTION */}
        <FleetSection
          locale={locale}
          onConfirmFleet={handleOpenConsultationWithPreset}
        />

        {/* 4. SANCTUARY SUITES SHOWCASE */}
        <SuiteShowcase
          locale={locale}
          onOpenConsultation={handleOpenConsultationWithPreset}
        />

        {/* 5. PILGRIM ESSENTIALS & LUXURY RELICS STORE (E-COMMERCE BACKEND) */}
        <StoreSection
          locale={locale}
          onAddToCart={handleAddToCart}
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
        onOpenConsultation={() => handleOpenConsultationWithPreset()}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
      />

      {/* FULL-SCREEN INTERACTIVE MULTI-STEP GUIDED CONCIERGE WIZARD */}
      <ConciergeWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        locale={locale}
        onOpenPdfModal={(data) => setPdfModalData(data)}
      />

      {/* VIP CREDENTIALS RESERVATION MODAL (GLASSMORPHISM, CONFETTI & WHATSAPP LINK) */}
      {contactModalOpen && (
        <ContactModal
          locale={locale}
          presetData={presetDataForModal}
          onClose={() => {
            setContactModalOpen(false);
            setPresetDataForModal(null);
          }}
        />
      )}

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
          const el = document.getElementById('store');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
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

      {/* Dynamic Content Management System (CMS) & Orders Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        locale={locale}
      />

    </div>
  );
}
