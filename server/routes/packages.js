// server/routes/packages.js
// Packages Management API (/api/packages)

import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/packages - Retrieve all packages filtered by type ('umrah' vs 'hajj')
router.get('/', (req, res) => {
  try {
    const { type } = req.query;
    const packages = db.getPackages(type);
    res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/packages/:id - Get single package
router.get('/:id', (req, res) => {
  const pkg = db.getPackageById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  res.json({ success: true, data: pkg });
});

// POST /api/packages - Add a new Hajj/Umrah package (Title EN/BN, Badge EN/BN, Price, Features array, Image URL, Accent color)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { 
      type, title_en, title_bn, badge_en, badge_bn, 
      priceBDT, priceUSD, features_en, features_bn, 
      image, accentColor, borderColor, tagColor, isPopular,
      selectedHotelIds, flightTier, flightLuggage, flightRoute, flightAircraft,
      itinerary, inclusions
    } = req.body;

    const bdtAmount = priceBDT || req.body.price;

    if (!title_en || !bdtAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: title_en and priceBDT are required.' 
      });
    }

    const newPackage = db.createPackage({
      type: type || 'umrah',
      title_en,
      title_bn: title_bn || title_en,
      badge_en: badge_en || 'VIP Sanctum',
      badge_bn: badge_bn || 'ভিআইপি স্যাঙ্কটাম',
      priceBDT: Number(bdtAmount),
      priceUSD: Number(priceUSD) || Math.round(Number(bdtAmount) / 120),
      features_en: Array.isArray(features_en) ? features_en : [features_en].filter(Boolean),
      features_bn: Array.isArray(features_bn) ? features_bn : [features_bn].filter(Boolean),
      image,
      accentColor,
      borderColor,
      tagColor,
      isPopular,
      selectedHotelIds: Array.isArray(selectedHotelIds) ? selectedHotelIds : [],
      flightTier: flightTier || 'Direct Flight - Saudia / Biman VIP',
      flightLuggage: flightLuggage || '2x 23kg Check-in (46kg) + 7kg Cabin Baggage + 5L Zamzam',
      flightRoute: flightRoute || 'Dhaka ➔ Jeddah ➔ Madinah ➔ Dhaka (Direct)',
      flightAircraft: flightAircraft || 'Boeing 787-9 Dreamliner / Boeing 777-300ER',
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      inclusions: Array.isArray(inclusions) ? inclusions : []
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully.',
      data: newPackage
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/packages/:id - Update existing package pricing, features, or promotional flags
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updatePackage(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }
    res.json({
      success: true,
      message: 'Package updated successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/packages/:id - Remove a package
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deletePackage(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }
    res.json({
      success: true,
      message: 'Package removed successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
