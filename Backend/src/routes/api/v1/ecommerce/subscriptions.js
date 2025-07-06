const express = require('express');
const router = express.Router();
const subscriptionController = require('../../../../controllers/ecommerce/subscriptionController');
const { isAuthenticated } = require('../../../../middleware/auth');

// Get all available subscription plans
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Get specific subscription plan
router.get('/plans/:planId', subscriptionController.getSubscriptionPlan);

// Subscribe to a plan
router.post('/plans/:planId/subscribe', isAuthenticated, subscriptionController.subscribeToPlan);

// Get user's subscriptions
router.get('/my-subscriptions', isAuthenticated, subscriptionController.getUserSubscriptions);

// Cancel subscription
router.post('/:planId/cancel', isAuthenticated, subscriptionController.cancelSubscription);

// Renew subscription
router.post('/:planId/renew', isAuthenticated, subscriptionController.renewSubscription);

// Toggle auto-renewal
router.post('/:planId/auto-renew', isAuthenticated, subscriptionController.toggleAutoRenewal);

// Check subscription access for a feature
router.get('/check-access/:feature', isAuthenticated, subscriptionController.checkSubscriptionAccess);

module.exports = router;
