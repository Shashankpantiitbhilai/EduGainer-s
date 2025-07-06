const express = require('express');
const router = express.Router();
const productManagementController = require('../../../../controllers/ecommerce/admin/productManagementController');
const orderManagementController = require('../../../../controllers/ecommerce/admin/orderManagementController');
const couponManagementController = require('../../../../controllers/ecommerce/admin/couponManagementController');
const inventoryManagementController = require('../../../../controllers/ecommerce/admin/inventoryManagementController');
const analyticsController = require('../../../../controllers/ecommerce/analyticsController');
const { isAuthenticated } = require('../../../../middleware/auth');
const { csvUpload } = require('../../../../middleware/upload');

// Product Management Routes
router.get('/products', isAuthenticated, productManagementController.getAllProducts);
router.post('/products', isAuthenticated, productManagementController.createProduct);
router.get('/products/:productId', isAuthenticated, productManagementController.getProduct);
router.put('/products/:productId', isAuthenticated, productManagementController.updateProduct);
router.delete('/products/:productId', isAuthenticated, productManagementController.deleteProduct);
router.patch('/products/:productId/toggle-status', isAuthenticated, productManagementController.toggleProductStatus);
router.post('/products/bulk-update', isAuthenticated, productManagementController.bulkUpdateProducts);
router.post('/products/import', isAuthenticated, csvUpload.single('csvFile'), productManagementController.importProducts);
router.get('/products/export', isAuthenticated, productManagementController.exportProducts);

// Order Management Routes
router.get('/orders', isAuthenticated, orderManagementController.getAllOrders);
router.get('/orders/:orderId', isAuthenticated, orderManagementController.getOrder);
router.patch('/orders/:orderId/status', isAuthenticated, orderManagementController.updateOrderStatus);
router.post('/orders/:orderId/refund', isAuthenticated, orderManagementController.processRefund);
router.get('/orders/:orderId/timeline', isAuthenticated, orderManagementController.getOrderTimeline);
router.post('/orders/bulk-update', isAuthenticated, orderManagementController.bulkOrderUpdate);
router.get('/orders/export', isAuthenticated, orderManagementController.exportOrders);

// Coupon Management Routes
router.post('/coupons', isAuthenticated, couponManagementController.createCoupon);
router.get('/coupons', isAuthenticated, couponManagementController.getAllCoupons);
router.get('/coupons/:couponId', isAuthenticated, couponManagementController.getCoupon);
router.put('/coupons/:couponId', isAuthenticated, couponManagementController.updateCoupon);
router.patch('/coupons/:couponId/toggle-status', isAuthenticated, couponManagementController.toggleCouponStatus);
router.delete('/coupons/:couponId', isAuthenticated, couponManagementController.deleteCoupon);
router.get('/coupons/analytics/overview', isAuthenticated, couponManagementController.getCouponAnalytics);
router.post('/coupons/bulk-update', isAuthenticated, couponManagementController.bulkUpdateCoupons);

// Inventory Management Routes
router.get('/inventory/overview', isAuthenticated, inventoryManagementController.getInventoryOverview);
router.get('/inventory', isAuthenticated, inventoryManagementController.getAllInventory);
router.put('/inventory/:inventoryId', isAuthenticated, inventoryManagementController.updateInventory);
router.post('/inventory/:inventoryId/add-stock', isAuthenticated, inventoryManagementController.addStock);
router.post('/inventory/:inventoryId/adjust-stock', isAuthenticated, inventoryManagementController.adjustStock);
router.get('/inventory/:inventoryId/movements', isAuthenticated, inventoryManagementController.getStockMovements);
router.post('/inventory/bulk-update', isAuthenticated, inventoryManagementController.bulkInventoryUpdate);

// Analytics Routes
router.get('/analytics/dashboard', isAuthenticated, analyticsController.getDashboardOverview);
router.get('/analytics/sales', isAuthenticated, analyticsController.getSalesAnalytics);
router.get('/analytics/products', isAuthenticated, analyticsController.getProductAnalytics);
router.get('/analytics/customers', isAuthenticated, analyticsController.getCustomerAnalytics);
router.get('/analytics/revenue', isAuthenticated, analyticsController.getRevenueAnalytics);

module.exports = router;
