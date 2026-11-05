// server/routes/transport.js
// Fleet & Transport Routes API (/api/transport)

import express from 'express';
import { db, calculateTieredMarkup } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/transport - Fetch all transport routes and vehicle base rates
router.get('/', (req, res) => {
  try {
    const data = db.getTransport();
    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/transport/routes/:id - Update route base prices (automatically re-applying the tiered markup formula: +150 SAR if >1500, +100 SAR if 900–1500, +50 SAR if <900)
router.put('/routes/:id', requireAdmin, (req, res) => {
  try {
    const { basePriceSAR, nameEn, nameBn, descEn, descBn, distanceEn, distanceBn, typeEn, typeBn } = req.body;

    if (basePriceSAR === undefined && !nameEn) {
      return res.status(400).json({ 
        success: false, 
        message: 'No update data provided.' 
      });
    }

    const updated = db.updateRoute(req.params.id, {
      ...(basePriceSAR !== undefined && { basePriceSAR: Number(basePriceSAR) }),
      ...(nameEn && { nameEn }),
      ...(nameBn && { nameBn }),
      ...(descEn && { descEn }),
      ...(descBn && { descBn }),
      ...(distanceEn && { distanceEn }),
      ...(distanceBn && { distanceBn }),
      ...(typeEn && { typeEn }),
      ...(typeBn && { typeBn })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Transport route not found.' });
    }

    res.json({
      success: true,
      message: 'Transport route updated with automatic tiered markup applied.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/transport/routes - Add a new custom transport route or ziyarah excursion
router.post('/routes', requireAdmin, (req, res) => {
  try {
    const { 
      nameEn, nameBn, name_en, name_bn,
      descEn, descBn, desc_en, desc_bn,
      typeEn, typeBn, type_en, type_bn,
      distanceEn, distanceBn,
      basePriceSAR 
    } = req.body;

    const enName = nameEn || name_en;
    if (!enName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Route name is required.' 
      });
    }

    const newRoute = db.addRoute({
      nameEn: enName,
      nameBn: nameBn || name_bn || enName,
      descEn: descEn || desc_en,
      descBn: descBn || desc_bn,
      typeEn: typeEn || type_en || 'Private Chauffeur',
      typeBn: typeBn || type_bn || 'প্রাইভেট সফর',
      distanceEn: distanceEn || 'Variable distance',
      distanceBn: distanceBn || 'দূরত্ব ভিত্তিক',
      basePriceSAR: Number(basePriceSAR) || 600
    });

    res.status(201).json({
      success: true,
      message: 'Custom transport route created with tiered markup.',
      data: newRoute
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
