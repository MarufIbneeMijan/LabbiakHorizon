// server/server.js
// Main Express Application & API Service for LabbaikHorizon

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import packagesRoutes from './routes/packages.js';
import productsRoutes from './routes/products.js';
import transportRoutes from './routes/transport.js';
import ordersRoutes from './routes/orders.js';
import hotelsRoutes from './routes/hotels.js';

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/hotels', hotelsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'LabbaikHorizon CMS & E-Commerce API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'LabbaikHorizon Luxury Pilgrimage API',
    endpoints: {
      packages: '/api/packages',
      products: '/api/products',
      transport: '/api/transport',
      orders: '/api/orders',
      hotels: '/api/hotels',
      auth: '/api/auth'
    }
  });
});

// Only start listening if run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  app.listen(PORT, () => {
    console.log(`🕋 LabbaikHorizon API Server running on http://localhost:${PORT}`);
  });
}

export default app;
