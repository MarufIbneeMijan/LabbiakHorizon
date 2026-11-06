// server/routes/products.js
// E-Commerce Store Products API (/api/products)

import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - Fetch all pilgrim essential products
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    const products = db.getProducts(category);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - Fetch single product
router.get('/:id', (req, res) => {
  const prod = db.getProductById(req.params.id);
  if (!prod) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, data: prod });
});

// POST /api/products - Add a new product (Name EN/BN, Price BDT/USD, Category, Image URL, Stock quantity, Tag)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { 
      name_en, name_bn, priceBDT, priceUSD, 
      category, image, stock, tag, description_en, description_bn,
      specifications
    } = req.body;

    if (!name_en || priceBDT === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: name_en and priceBDT are required.' 
      });
    }

    const newProduct = db.createProduct({
      name_en,
      name_bn: name_bn || name_en,
      priceBDT: Number(priceBDT),
      priceUSD: Number(priceUSD) || Math.round(Number(priceBDT) / 120),
      category: category || 'essential',
      image: image || 'https://images.unsplash.com/photo-1548625361-1250269f8303?auto=format&fit=crop&q=80&w=800',
      stock: stock !== undefined ? Number(stock) : 50,
      tag: tag || 'Essential',
      description_en,
      description_bn,
      specifications: Array.isArray(specifications) ? specifications.slice(0, 4) : []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id - Edit product details or update stock level
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
