const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const wishlistRoutes = require('./wishlist');
const reviewRoutes = require('./reviews');
const couponRoutes = require('./coupons');
const inventoryRoutes = require('./inventory');
const subscriptionRoutes = require('./subscriptions');
const analyticsRoutes = require('./analytics');
const notificationRoutes = require('./notifications');
const adminRoutes = require('./admin');

// Mount routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// E-commerce health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
