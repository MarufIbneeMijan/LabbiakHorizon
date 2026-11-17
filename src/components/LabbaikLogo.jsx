import React from 'react';

/**
 * Official LabbaikHorizon Brand Logo
 * 
 * Signature Kiswah Obsidian Black (#080809) and Metallic 24K Gold (#d4af37)
 * vector insignia representing the Holy Kaaba, the golden Kiswah Hizam belt,
 * and the ascending celestial Horizon.
 */

export function LabbaikLogoIcon({ size = 40, className = '' }) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/logo.png" // Ensure your logo file is named logo.png and placed inside the public/ folder
        alt="LabbaikHorizon Logo"
        className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] rounded-xl"
      />
     
    </div>
  );
}

export default function LabbaikLogo({ 
  size = "md", 
  iconOnly = false, 
  locale = "en",
  className = "" 
}) {
  const isBn = locale === 'bn';

  const pixelMap = {
    xs: 28,
    sm: 34,
    md: 42,
    lg: 52,
    xl: 64
  };

  const px = typeof size === 'number' ? size : (pixelMap[size] || 42);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LabbaikLogoIcon size={px} />
      
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-white transition-colors group-hover:text-[#d4af37]">
              LabbaikHorizon
            </span>
          </div>
          <p className="text-[9.5px] text-[#d4af37]/90 tracking-[0.22em] font-mono uppercase font-semibold">
            {isBn ? 'অভিজাত হজ ও ওমরাহ কনসিয়ার্জ' : 'Ultra-Luxury Pilgrimage'}
          </p>
        </div>
      )}
    </div>
  );
}
