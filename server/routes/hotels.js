// server/routes/hotels.js
// Hotel Management API (/api/hotels)

import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/hotels - Retrieve all hotels, optionally filtered by city ('makkah' vs 'madinah')
router.get('/', (req, res) => {
  try {
    const { city } = req.query;
    const hotels = db.getHotels(city);
    
    // Also provide grouped format for easy consumption
    const makkah = hotels.filter(h => h.city && h.city.toLowerCase() === 'makkah');
    const madinah = hotels.filter(h => h.city && h.city.toLowerCase() === 'madinah');

    res.json({
      success: true,
      count: hotels.length,
      data: hotels,
      grouped: {
        makkah,
        madinah
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/hotels/:id - Retrieve single hotel
router.get('/:id', (req, res) => {
  const hotel = db.getHotelById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ success: false, message: 'Hotel property not found.' });
  }
  res.json({ success: true, data: hotel });
});

// POST /api/hotels - Create a new luxury hotel property (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { 
      name, nameBn, city, dist, distBn, 
      stars, starRating, nightlyBdt, nightlyUsd, 
      features, image 
    } = req.body;

    if (!name || !nightlyBdt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: Property Name and Nightly Rate (BDT) are required.' 
      });
    }

    const newHotel = db.createHotel({
      name,
      nameBn: nameBn || name,
      city: city || 'Makkah',
      dist: dist || '0m - Courtyard Direct',
      distBn: distBn || (dist || '০ মিটার সরাসরি হারাম চত্বর'),
      stars: Number(stars) || 5,
      starRating: starRating || '5-Star VIP',
      nightlyBdt: Number(nightlyBdt),
      nightlyUsd: Number(nightlyUsd) || Math.round(Number(nightlyBdt) / 120),
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      image: image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    });

    res.status(201).json({
      success: true,
      message: 'Luxury hotel property registered successfully.',
      data: newHotel
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/hotels/:id - Update hotel property (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateHotel(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hotel property not found.' });
    }
    res.json({
      success: true,
      message: 'Hotel property updated successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/hotels/:id - Remove hotel property (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteHotel(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Hotel property not found.' });
    }
    res.json({
      success: true,
      message: 'Hotel property removed successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
