const express = require('express');
const router = express.Router();
const analyticsController = require('../../../../controllers/ecommerce/analyticsController');
const { isAuthenticated } = require('../../../../middleware/auth');

// Dashboard overview (for admin dashboard)
router.get('/dashboard', isAuthenticated, analyticsController.getDashboardOverview);

// Sales analytics
router.get('/sales', isAuthenticated, analyticsController.getSalesAnalytics);

// Product analytics
router.get('/products', isAuthenticated, analyticsController.getProductAnalytics);

// Customer analytics
router.get('/customers', isAuthenticated, analyticsController.getCustomerAnalytics);

// Revenue analytics
router.get('/revenue', isAuthenticated, analyticsController.getRevenueAnalytics);

module.exports = router;
