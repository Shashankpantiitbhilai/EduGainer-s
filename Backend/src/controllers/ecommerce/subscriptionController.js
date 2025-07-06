const Subscription = require('../../models/Subscription');
const { body, validationResult } = require('express-validator');

// Get all available subscription plans
exports.getSubscriptionPlans = async (req, res) => {
    try {
        const { category, status = 'active' } = req.query;
        
        const query = { status };
        if (category) query.category = category;

        const plans = await Subscription.find(query)
            .sort({ price: 1 });

        res.json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Get subscription plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription plans'
        });
    }
};

// Get specific subscription plan
exports.getSubscriptionPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        
        const plan = await Subscription.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        res.json({
            success: true,
            data: plan
        });
    } catch (error) {
        console.error('Get subscription plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription plan'
        });
    }
};

// Subscribe to a plan
exports.subscribeToPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user._id;
        
        const plan = await Subscription.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        if (plan.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This subscription plan is not available'
            });
        }

        // Check if user already has an active subscription for this plan
        const existingSubscription = plan.subscribers.find(
            sub => sub.userId.toString() === userId.toString() && sub.status === 'active'
        );

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'You already have an active subscription for this plan'
            });
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        
        switch (plan.duration.unit) {
            case 'day':
                endDate.setDate(endDate.getDate() + plan.duration.value);
                break;
            case 'week':
                endDate.setDate(endDate.getDate() + (plan.duration.value * 7));
                break;
            case 'month':
                endDate.setMonth(endDate.getMonth() + plan.duration.value);
                break;
            case 'year':
                endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
                break;
        }

        // Add subscriber to plan
        const subscription = {
            userId,
            subscribedAt: startDate,
            expiresAt: endDate,
            status: 'active',
            paymentStatus: 'pending'
        };

        plan.subscribers.push(subscription);
        await plan.save();

        // Here you would typically create a payment intent with Razorpay
        // For now, we'll return the subscription details
        
        res.json({
            success: true,
            data: {
                subscription: {
                    planId: plan._id,
                    planName: plan.name,
                    price: plan.price,
                    startDate,
                    endDate,
                    status: 'active'
                },
                message: 'Successfully subscribed to plan'
            }
        });
    } catch (error) {
        console.error('Subscribe to plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to plan'
        });
    }
};

// Get user's subscriptions
exports.getUserSubscriptions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;
        
        const query = {
            'subscribers.userId': userId
        };

        const subscriptions = await Subscription.find(query);
        
        const userSubscriptions = subscriptions.map(plan => {
            const userSub = plan.subscribers.find(
                sub => sub.userId.toString() === userId.toString()
            );
            
            if (!userSub || (status && userSub.status !== status)) {
                return null;
            }

            return {
                planId: plan._id,
                planName: plan.name,
                planDescription: plan.description,
                price: plan.price,
                features: plan.features,
                subscribedAt: userSub.subscribedAt,
                expiresAt: userSub.expiresAt,
                status: userSub.status,
                paymentStatus: userSub.paymentStatus,
                autoRenew: userSub.autoRenew
            };
        }).filter(Boolean);

        res.json({
            success: true,
            data: userSubscriptions
        });
    } catch (error) {
        console.error('Get user subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user subscriptions'
        });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user._id;
        
        const plan = await Subscription.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        const subscriberIndex = plan.subscribers.findIndex(
            sub => sub.userId.toString() === userId.toString() && sub.status === 'active'
        );

        if (subscriberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found for this plan'
            });
        }

        // Update subscription status
        plan.subscribers[subscriberIndex].status = 'cancelled';
        plan.subscribers[subscriberIndex].cancelledAt = new Date();
        plan.subscribers[subscriberIndex].autoRenew = false;
        
        await plan.save();

        res.json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription'
        });
    }
};

// Renew subscription
exports.renewSubscription = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user._id;
        
        const plan = await Subscription.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        const subscriberIndex = plan.subscribers.findIndex(
            sub => sub.userId.toString() === userId.toString()
        );

        if (subscriberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'No subscription found for this plan'
            });
        }

        const subscriber = plan.subscribers[subscriberIndex];
        
        // Calculate new expiry date
        const newEndDate = new Date(subscriber.expiresAt);
        
        switch (plan.duration.unit) {
            case 'day':
                newEndDate.setDate(newEndDate.getDate() + plan.duration.value);
                break;
            case 'week':
                newEndDate.setDate(newEndDate.getDate() + (plan.duration.value * 7));
                break;
            case 'month':
                newEndDate.setMonth(newEndDate.getMonth() + plan.duration.value);
                break;
            case 'year':
                newEndDate.setFullYear(newEndDate.getFullYear() + plan.duration.value);
                break;
        }

        // Update subscription
        plan.subscribers[subscriberIndex].expiresAt = newEndDate;
        plan.subscribers[subscriberIndex].status = 'active';
        plan.subscribers[subscriberIndex].renewedAt = new Date();
        
        await plan.save();

        res.json({
            success: true,
            data: {
                newExpiryDate: newEndDate,
                message: 'Subscription renewed successfully'
            }
        });
    } catch (error) {
        console.error('Renew subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to renew subscription'
        });
    }
};

// Toggle auto-renewal
exports.toggleAutoRenewal = async (req, res) => {
    try {
        const { planId } = req.params;
        const { autoRenew } = req.body;
        const userId = req.user._id;
        
        const plan = await Subscription.findById(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        const subscriberIndex = plan.subscribers.findIndex(
            sub => sub.userId.toString() === userId.toString() && sub.status === 'active'
        );

        if (subscriberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found for this plan'
            });
        }

        plan.subscribers[subscriberIndex].autoRenew = autoRenew;
        await plan.save();

        res.json({
            success: true,
            data: {
                autoRenew,
                message: `Auto-renewal ${autoRenew ? 'enabled' : 'disabled'} successfully`
            }
        });
    } catch (error) {
        console.error('Toggle auto-renewal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update auto-renewal setting'
        });
    }
};

// Check subscription access
exports.checkSubscriptionAccess = async (req, res) => {
    try {
        const { feature } = req.params;
        const userId = req.user._id;
        
        const subscriptions = await Subscription.find({
            'subscribers.userId': userId,
            'subscribers.status': 'active',
            'subscribers.expiresAt': { $gt: new Date() }
        });

        let hasAccess = false;
        let accessDetails = [];

        subscriptions.forEach(plan => {
            const userSub = plan.subscribers.find(
                sub => sub.userId.toString() === userId.toString() && sub.status === 'active'
            );
            
            if (userSub && userSub.expiresAt > new Date()) {
                if (plan.features.includes(feature) || plan.features.includes('all')) {
                    hasAccess = true;
                    accessDetails.push({
                        planName: plan.name,
                        expiresAt: userSub.expiresAt
                    });
                }
            }
        });

        res.json({
            success: true,
            data: {
                hasAccess,
                feature,
                accessDetails
            }
        });
    } catch (error) {
        console.error('Check subscription access error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check subscription access'
        });
    }
};
