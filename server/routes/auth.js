// server/routes/auth.js
// Admin Authentication Routes

import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { identifier, username, email, password } = req.body;
  const loginUser = identifier || username || email;

  if (!loginUser || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Identifier and password are required.' 
    });
  }

  const isValid = db.verifyAdmin(loginUser, password);

  if (!isValid) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. Please verify your VIP Director login details.' 
    });
  }

  const payload = {
    username: loginUser,
    role: 'admin',
    name: 'Private Client Director'
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    success: true,
    token,
    user: payload,
    message: 'Welcome to LabbaikHorizon Admin Control Center'
  });
});

// GET /api/auth/verify
router.get('/verify', requireAdmin, (req, res) => {
  return res.json({
    success: true,
    user: req.admin,
    message: 'Token is valid'
  });
});

export default router;
