const express = require('express');
const router = express.Router();
const inventoryController = require('../../../../controllers/ecommerce/inventoryController');
const inventoryManagementController = require('../../../../controllers/ecommerce/admin/inventoryManagementController');
const { isAuthenticated } = require('../../../../middleware/auth');

// User routes for inventory (limited access)
router.get('/product/:productId', isAuthenticated, inventoryController.getProductInventory);
router.post('/check-availability', isAuthenticated, inventoryController.checkStockAvailability);

// Stock reservation and management (for checkout process)
router.post('/reserve', isAuthenticated, inventoryController.reserveStock);
router.delete('/reserve/:orderId', isAuthenticated, inventoryController.releaseReservation);
router.post('/deduct', isAuthenticated, inventoryController.deductStock);

// Cleanup routes
router.post('/cleanup/expired-reservations', isAuthenticated, inventoryController.cleanupExpiredReservations);
router.get('/alerts/low-stock', isAuthenticated, inventoryController.getLowStockAlerts);

// Admin routes for inventory management
router.get('/admin/overview', isAuthenticated, inventoryManagementController.getInventoryOverview);
router.get('/admin/all', isAuthenticated, inventoryManagementController.getAllInventory);
router.put('/admin/:inventoryId', isAuthenticated, inventoryManagementController.updateInventory);
router.post('/admin/:inventoryId/add-stock', isAuthenticated, inventoryManagementController.addStock);
router.post('/admin/:inventoryId/adjust-stock', isAuthenticated, inventoryManagementController.adjustStock);
router.get('/admin/:inventoryId/movements', isAuthenticated, inventoryManagementController.getStockMovements);
router.post('/admin/bulk-update', isAuthenticated, inventoryManagementController.bulkInventoryUpdate);

module.exports = router;
