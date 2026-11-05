// server/routes/orders.js
// Orders & Dossier Enquiries API (/api/orders)

import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders - Admin-only fetch for all store orders and confidential VIP dossier requests
router.get('/', requireAdmin, (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders - Public endpoint for clients placing store orders or requesting VIP dossiers
router.post('/', (req, res) => {
  try {
    const { 
      type, customerName, customerPhone, customerEmail,
      name, phone, email,
      items, totalBDT, totalUSD, deliveryAddress, address, notes,
      tier, rawdahWindow, makkahHotel, madinahHotel
    } = req.body;

    const resolvedName = customerName || name;
    const resolvedPhone = customerPhone || phone;

    if (!resolvedName || !resolvedPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer name and phone number are required.' 
      });
    }

    // Prepare items if this is a VIP dossier inquiry
    let resolvedItems = items;
    if (!resolvedItems || !Array.isArray(resolvedItems) || resolvedItems.length === 0) {
      resolvedItems = [{
        name: tier || rawdahWindow || 'VIP Customized Pilgrimage Dossier',
        quantity: 1,
        priceBDT: Number(totalBDT) || 0,
        makkahHotel: makkahHotel || '',
        madinahHotel: madinahHotel || ''
      }];
    }

    const newOrder = db.createOrder({
      type: type || (items && items.length > 0 ? 'store_order' : 'vip_dossier'),
      customerName: resolvedName,
      customerPhone: resolvedPhone,
      customerEmail: customerEmail || email || '',
      items: resolvedItems,
      totalBDT: Number(totalBDT) || 0,
      totalUSD: Number(totalUSD) || Math.round((Number(totalBDT) || 0) / 120),
      deliveryAddress: deliveryAddress || address || 'Horizon VIP Client Desk, Gulshan-2, Dhaka',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Order or VIP Dossier inquiry successfully submitted.',
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/status - Update order status ('Pending' ➔ 'Processing' ➔ 'Dispatched' ➔ 'Completed')
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Dispatched', 'Completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/orders/:id - Admin-only delete for completed or dispatched orders
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const orders = db.getOrders();
    const target = orders.find(o => o.id === req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (target.status !== 'Completed' && target.status !== 'Dispatched') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only completed or dispatched orders can be archived/deleted.' 
      });
    }

    const deleted = db.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order could not be removed.' });
    }

    res.json({
      success: true,
      message: 'Order successfully deleted.',
      id: req.params.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
