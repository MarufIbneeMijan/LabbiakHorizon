/**
 * Official Brand & Contact Configuration
 * LabbaikHorizon Ultra-Luxury Kiswah Pilgrimage Concierge
 */

// Official WhatsApp contact number as specified
export const OFFICIAL_WHATSAPP = "01724919098";

// Internationalized format for wa.me links
export const OFFICIAL_WHATSAPP_INTL = "8801724919098";

// VIP Customer Hotline display format
export const OFFICIAL_HOTLINE = "+880 1724-919098";

// Alternate hotline / emergency line
export const OFFICIAL_HOTLINE_ALT = "+880 1800-522224";

/**
 * Generates an official WhatsApp click-to-chat URL with optional pre-filled message.
 * Safely strips non-numeric characters and ensures the Bangladesh country code (+880).
 *
 * @param {string} message - Optional message text to pre-fill
 * @param {string} customNumber - Optional phone number override
 * @returns {string} Fully qualified wa.me URL
 */
export const getWhatsAppUrl = (message = '', customNumber = null) => {
  const target = customNumber || OFFICIAL_WHATSAPP;
  const digits = String(target).replace(/\D/g, '');
  const internationalNumber = digits.startsWith('88') ? digits : `88${digits}`;
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${internationalNumber}${textParam}`;
};

export default {
  OFFICIAL_WHATSAPP,
  OFFICIAL_WHATSAPP_INTL,
  OFFICIAL_HOTLINE,
  OFFICIAL_HOTLINE_ALT,
  getWhatsAppUrl
};
