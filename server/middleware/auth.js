// server/middleware/auth.js
// JWT Token Authentication Middleware for Admin Protection

import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'labbaik_kiswah_secret_key_2026';

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Missing or invalid VIP Admin Authorization header.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Session expired or invalid VIP token. Please sign in again.' 
    });
  }
}
