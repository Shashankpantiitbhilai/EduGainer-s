const express = require('express');
const router = express.Router();
const notificationController = require('../../../../controllers/ecommerce/notificationController');
const { isAuthenticated } = require('../../../../middleware/auth');

// Send order status notification
router.post('/order', isAuthenticated, notificationController.sendOrderNotification);

// Send product availability notification
router.post('/product', isAuthenticated, notificationController.sendProductNotification);

// Send promotional notifications
router.post('/promotional', isAuthenticated, notificationController.sendPromotionalNotification);

// Send low stock alerts
router.post('/low-stock-alert', isAuthenticated, notificationController.sendLowStockAlert);

// Send abandoned cart reminders
router.post('/abandoned-cart', isAuthenticated, notificationController.sendAbandonedCartReminder);

// Get notification analytics
router.get('/analytics', isAuthenticated, notificationController.getNotificationAnalytics);

// Update user notification preferences
router.put('/preferences', isAuthenticated, notificationController.updateNotificationPreferences);

// Test notification system
router.post('/test', isAuthenticated, notificationController.testNotification);

module.exports = router;
