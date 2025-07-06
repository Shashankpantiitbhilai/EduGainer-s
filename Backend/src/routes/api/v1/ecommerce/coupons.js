const express = require('express');
const router = express.Router();
const couponController = require('../../../../controllers/ecommerce/couponController');
const couponManagementController = require('../../../../controllers/ecommerce/admin/couponManagementController');
const { isAuthenticated } = require('../../../../middleware/auth');

// User routes for coupons
router.get('/available', isAuthenticated, couponController.getAvailableCoupons);
router.post('/apply', isAuthenticated, couponController.applyCoupon);
router.post('/validate', couponController.validateCouponPost);
router.get('/validate/:couponCode', isAuthenticated, couponController.validateCoupon);
router.get('/history', isAuthenticated, couponController.getCouponHistory);

// Admin routes for coupon management
router.post('/admin/create', isAuthenticated, couponManagementController.createCoupon);
router.get('/admin/all', isAuthenticated, couponManagementController.getAllCoupons);
router.get('/admin/:couponId', isAuthenticated, couponManagementController.getCoupon);
router.put('/admin/:couponId', isAuthenticated, couponManagementController.updateCoupon);
router.patch('/admin/:couponId/toggle-status', isAuthenticated, couponManagementController.toggleCouponStatus);
router.delete('/admin/:couponId', isAuthenticated, couponManagementController.deleteCoupon);
router.get('/admin/analytics/overview', isAuthenticated, couponManagementController.getCouponAnalytics);
router.post('/admin/bulk-update', isAuthenticated, couponManagementController.bulkUpdateCoupons);

module.exports = router;
