const Coupon = require('../../models/Coupon');
const { body, validationResult } = require('express-validator');

// Apply coupon to cart
exports.applyCoupon = async (req, res) => {
    try {
        const { couponCode, cartTotal } = req.body;
        
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() },
            usageCount: { $lt: '$usageLimit' }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired coupon code'
            });
        }

        // Check minimum order amount
        if (cartTotal < coupon.minimumOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`
            });
        }

        // Check user eligibility
        if (coupon.userRestrictions.length > 0 && !coupon.userRestrictions.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'This coupon is not valid for your account'
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        const finalAmount = cartTotal - discountAmount;

        res.json({
            success: true,
            data: {
                coupon: {
                    code: coupon.code,
                    description: coupon.description,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue
                },
                originalAmount: cartTotal,
                discountAmount,
                finalAmount: Math.max(0, finalAmount)
            }
        });
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to apply coupon'
        });
    }
};

// Get available coupons for user
exports.getAvailableCoupons = async (req, res) => {
    try {
        const { cartTotal } = req.query;
        
        const query = {
            isActive: true,
            expiresAt: { $gt: new Date() },
            usageCount: { $lt: '$usageLimit' }
        };

        if (cartTotal) {
            query.minimumOrderAmount = { $lte: parseFloat(cartTotal) };
        }

        const coupons = await Coupon.find(query)
            .select('code description discountType discountValue minimumOrderAmount maxDiscountAmount expiresAt')
            .sort({ discountValue: -1 });

        // Filter coupons based on user restrictions
        const availableCoupons = coupons.filter(coupon => {
            if (coupon.userRestrictions.length === 0) return true;
            return coupon.userRestrictions.includes(req.user._id);
        });

        res.json({
            success: true,
            data: availableCoupons
        });
    } catch (error) {
        console.error('Get available coupons error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available coupons'
        });
    }
};

// Validate coupon without applying
exports.validateCoupon = async (req, res) => {
    try {
        const { couponCode } = req.params;
        
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() },
            usageCount: { $lt: '$usageLimit' }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired coupon code'
            });
        }

        // Check user eligibility
        if (coupon.userRestrictions.length > 0 && !coupon.userRestrictions.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'This coupon is not valid for your account'
            });
        }

        res.json({
            success: true,
            data: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minimumOrderAmount: coupon.minimumOrderAmount,
                maxDiscountAmount: coupon.maxDiscountAmount,
                expiresAt: coupon.expiresAt
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate coupon'
        });
    }
};

// Validate coupon (POST endpoint for easier testing)
exports.validateCouponPost = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired coupon code'
            });
        }

        // Check if coupon usage limit exceeded
        if (coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit exceeded'
            });
        }

        // Check minimum order amount if provided
        if (orderAmount && orderAmount < coupon.minimumOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`
            });
        }

        // Calculate potential discount
        let discountAmount = 0;
        if (orderAmount) {
            if (coupon.discountType === 'percentage') {
                discountAmount = (orderAmount * coupon.discountValue) / 100;
                if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                    discountAmount = coupon.maxDiscountAmount;
                }
            } else {
                discountAmount = coupon.discountValue;
            }
        }

        res.json({
            success: true,
            message: 'Valid coupon code',
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscountAmount: coupon.maxDiscountAmount,
                minimumOrderAmount: coupon.minimumOrderAmount,
                discountAmount: discountAmount,
                expiresAt: coupon.expiresAt,
                usageRemaining: coupon.usageLimit - coupon.usageCount
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate coupon'
        });
    }
};

// Get user's coupon usage history
exports.getCouponHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // This would require adding a CouponUsage model or tracking in Order model
        // For now, we'll get orders with coupons used
        const Order = require('../../models/Order');
        
        const orders = await Order.find({
            user: userId,
            'coupon.code': { $exists: true }
        })
        .select('orderNumber coupon totalAmount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Order.countDocuments({
            user: userId,
            'coupon.code': { $exists: true }
        });

        res.json({
            success: true,
            data: {
                coupons: orders.map(order => ({
                    orderNumber: order.orderNumber,
                    couponCode: order.coupon.code,
                    discountAmount: order.coupon.discountAmount,
                    usedAt: order.createdAt
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get coupon history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coupon history'
        });
    }
};
