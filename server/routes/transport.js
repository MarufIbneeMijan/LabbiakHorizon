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

// PUT /api/transport/routes/:id - Update route
router.put('/routes/:id', requireAdmin, (req, res) => {
  try {
    const { 
      basePriceSAR, priceBDT, vehicleType, vehicleTypeEn, vehicleTypeBn,
      nameEn, nameBn, descEn, descBn, distanceEn, distanceBn, typeEn, typeBn 
    } = req.body;

    if (basePriceSAR === undefined && priceBDT === undefined && !nameEn) {
      return res.status(400).json({ 
        success: false, 
        message: 'No update data provided.' 
      });
    }

    const updated = db.updateRoute(req.params.id, {
      ...(priceBDT !== undefined && { priceBDT: Number(priceBDT) }),
      ...(vehicleType && { vehicleType }),
      ...(vehicleTypeEn && { vehicleType: vehicleTypeEn }),
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
      message: 'Transport route updated successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/transport/routes - Add a new custom transport route
router.post('/routes', requireAdmin, (req, res) => {
  try {
    const { 
      nameEn, nameBn, name_en, name_bn,
      vehicleType, vehicleTypeEn, vehicleTypeBn,
      priceBDT, price,
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

    const finalBDT = Number(priceBDT || price) || Math.round((Number(basePriceSAR) || 600) * 33);

    const newRoute = db.addRoute({
      nameEn: enName,
      nameBn: nameBn || name_bn || enName,
      vehicleType: vehicleType || vehicleTypeEn || typeEn || 'VIP GMC Yukon',
      priceBDT: finalBDT,
      descEn: descEn || desc_en,
      descBn: descBn || desc_bn,
      typeEn: typeEn || type_en || vehicleType || 'Private Chauffeur',
      typeBn: typeBn || type_bn || vehicleTypeBn || 'প্রাইভেট সফর',
      distanceEn: distanceEn || 'Express Route',
      distanceBn: distanceBn || 'এক্সপ্রেস রুট',
      basePriceSAR: Number(basePriceSAR) || Math.round(finalBDT / 33) || 600
    });

    res.status(201).json({
      success: true,
      message: 'Custom transport route created successfully.',
      data: newRoute
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/transport/routes/:id - Remove a transport route
router.delete('/routes/:id', requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteRoute(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transport route not found.' });
    }
    res.json({
      success: true,
      message: 'Transport route deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
