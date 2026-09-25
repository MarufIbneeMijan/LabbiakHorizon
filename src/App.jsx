import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ConciergeCurator from './components/ConciergeCurator';
import SuiteShowcase from './components/SuiteShowcase';
import ConciergePillars from './components/ConciergePillars';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import PrivateDossierModal from './components/PrivateDossierModal';

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [dossierData, setDossierData] = useState(null);
  const [presetDataForModal, setPresetDataForModal] = useState(null);

  const scrollToCurator = () => {
    const curatorElem = document.getElementById('curator');
    if (curatorElem) {
      curatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenConsultationWithPreset = (data) => {
    if (data) {
      setPresetDataForModal(data);
    }
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#080808]">
      
      {/* Kiswah Luxury Navigation Header with Ambient Audio Player */}
      <Navbar
        onOpenConsultation={() => setContactModalOpen(true)}
        onNavigateCurator={scrollToCurator}
      />

      {/* Main Luxury Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenConsultation={() => setContactModalOpen(true)}
          onNavigateCurator={scrollToCurator}
        />
        
        <ConciergeCurator
          onOpenConsultation={handleOpenConsultationWithPreset}
          onOpenDossier={(data) => setDossierData(data)}
        />
        
        <SuiteShowcase
          onOpenConsultation={() => setContactModalOpen(true)}
        />
        
        <ConciergePillars />
        
        <Testimonials />
      </main>

      {/* Global Footer */}
      <Footer
        onOpenConsultation={() => setContactModalOpen(true)}
      />

      {/* Contact Dossier Request Modal with Confetti Celebration */}
      {contactModalOpen && (
        <ContactModal
          presetData={presetDataForModal}
          onClose={() => {
            setContactModalOpen(false);
            setPresetDataForModal(null);
          }}
        />
      )}

      {/* Instant Printable VIP Dossier Modal */}
      {dossierData && (
        <PrivateDossierModal
          data={dossierData}
          onClose={() => setDossierData(null)}
        />
      )}

    </div>
  );
}
