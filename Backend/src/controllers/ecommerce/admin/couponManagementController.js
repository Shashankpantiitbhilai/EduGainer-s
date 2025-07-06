const Coupon = require('../../../models/Coupon');
const Order = require('../../../models/Order');
const { body, validationResult } = require('express-validator');

// Create new coupon
exports.createCoupon = [
    body('code').isLength({ min: 3, max: 20 }).withMessage('Coupon code must be 3-20 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isNumeric().withMessage('Discount value must be numeric'),
    body('minimumOrderAmount').optional().isNumeric().withMessage('Minimum order amount must be numeric'),
    body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be positive integer'),
    body('expiresAt').isISO8601().withMessage('Valid expiry date is required'),
    
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const {
                code,
                description,
                discountType,
                discountValue,
                minimumOrderAmount = 0,
                maxDiscountAmount,
                usageLimit,
                expiresAt,
                userRestrictions = [],
                productRestrictions = [],
                categoryRestrictions = []
            } = req.body;

            // Check if coupon code already exists
            const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
            if (existingCoupon) {
                return res.status(400).json({
                    success: false,
                    message: 'Coupon code already exists'
                });
            }

            const coupon = new Coupon({
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minimumOrderAmount,
                maxDiscountAmount,
                usageLimit,
                expiresAt,
                userRestrictions,
                productRestrictions,
                categoryRestrictions,
                createdBy: req.user._id
            });

            await coupon.save();

            res.status(201).json({
                success: true,
                data: coupon,
                message: 'Coupon created successfully'
            });
        } catch (error) {
            console.error('Create coupon error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create coupon'
            });
        }
    }
];

// Get all coupons with pagination
exports.getAllCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, search } = req.query;

        let query = {};
        
        if (status) {
            if (status === 'active') {
                query.isActive = true;
                query.expiresAt = { $gt: new Date() };
            } else if (status === 'expired') {
                query.expiresAt = { $lte: new Date() };
            } else if (status === 'inactive') {
                query.isActive = false;
            }
        }

        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const coupons = await Coupon.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Coupon.countDocuments(query);

        // Add usage statistics
        const couponsWithStats = await Promise.all(
            coupons.map(async (coupon) => {
                const usageCount = await Order.countDocuments({
                    'coupon.code': coupon.code
                });
                
                const totalDiscount = await Order.aggregate([
                    { $match: { 'coupon.code': coupon.code } },
                    { $group: { _id: null, total: { $sum: '$coupon.discountAmount' } } }
                ]);

                return {
                    ...coupon.toObject(),
                    actualUsageCount: usageCount,
                    totalDiscountGiven: totalDiscount[0]?.total || 0,
                    usagePercentage: coupon.usageLimit ? (usageCount / coupon.usageLimit) * 100 : 0
                };
            })
        );

        res.json({
            success: true,
            data: {
                coupons: couponsWithStats,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all coupons error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coupons'
        });
    }
};

// Get single coupon
exports.getCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        
        const coupon = await Coupon.findById(couponId)
            .populate('createdBy', 'name email');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Get usage statistics
        const usageCount = await Order.countDocuments({
            'coupon.code': coupon.code
        });
        
        const totalDiscount = await Order.aggregate([
            { $match: { 'coupon.code': coupon.code } },
            { $group: { _id: null, total: { $sum: '$coupon.discountAmount' } } }
        ]);

        const recentUsage = await Order.find({
            'coupon.code': coupon.code
        })
        .populate('user', 'name email')
        .select('orderNumber user coupon.discountAmount createdAt')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({
            success: true,
            data: {
                ...coupon.toObject(),
                statistics: {
                    actualUsageCount: usageCount,
                    totalDiscountGiven: totalDiscount[0]?.total || 0,
                    usagePercentage: coupon.usageLimit ? (usageCount / coupon.usageLimit) * 100 : 0,
                    recentUsage
                }
            }
        });
    } catch (error) {
        console.error('Get coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coupon'
        });
    }
};

// Update coupon
exports.updateCoupon = [
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('discountValue').optional().isNumeric().withMessage('Discount value must be numeric'),
    body('minimumOrderAmount').optional().isNumeric().withMessage('Minimum order amount must be numeric'),
    body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be positive integer'),
    body('expiresAt').optional().isISO8601().withMessage('Valid expiry date is required'),
    
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { couponId } = req.params;
            const updateData = req.body;

            // Remove fields that shouldn't be updated
            delete updateData.code;
            delete updateData.usageCount;

            const coupon = await Coupon.findByIdAndUpdate(
                couponId,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!coupon) {
                return res.status(404).json({
                    success: false,
                    message: 'Coupon not found'
                });
            }

            res.json({
                success: true,
                data: coupon,
                message: 'Coupon updated successfully'
            });
        } catch (error) {
            console.error('Update coupon error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update coupon'
            });
        }
    }
];

// Toggle coupon status
exports.toggleCouponStatus = async (req, res) => {
    try {
        const { couponId } = req.params;
        
        const coupon = await Coupon.findById(couponId);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({
            success: true,
            data: {
                couponId,
                isActive: coupon.isActive
            },
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error('Toggle coupon status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle coupon status'
        });
    }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        
        // Check if coupon has been used
        const usageCount = await Order.countDocuments({
            'coupon.code': { $exists: true }
        });

        if (usageCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete coupon that has been used. Consider deactivating it instead.'
            });
        }

        const coupon = await Coupon.findByIdAndDelete(couponId);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete coupon'
        });
    }
};

// Get coupon analytics
exports.getCouponAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Overall statistics
        const totalCoupons = await Coupon.countDocuments();
        const activeCoupons = await Coupon.countDocuments({
            isActive: true,
            expiresAt: { $gt: new Date() }
        });
        const expiredCoupons = await Coupon.countDocuments({
            expiresAt: { $lte: new Date() }
        });

        // Usage statistics
        const couponUsage = await Order.aggregate([
            { $match: { 'coupon.code': { $exists: true }, ...dateFilter } },
            {
                $group: {
                    _id: '$coupon.code',
                    usageCount: { $sum: 1 },
                    totalDiscount: { $sum: '$coupon.discountAmount' },
                    avgOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { usageCount: -1 } },
            { $limit: 10 }
        ]);

        // Top performing coupons
        const topCoupons = await Promise.all(
            couponUsage.map(async (usage) => {
                const coupon = await Coupon.findOne({ code: usage._id })
                    .select('code description discountType discountValue');
                return {
                    ...usage,
                    couponDetails: coupon
                };
            })
        );

        // Monthly usage trend
        const monthlyTrend = await Order.aggregate([
            { $match: { 'coupon.code': { $exists: true }, ...dateFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    usageCount: { $sum: 1 },
                    totalDiscount: { $sum: '$coupon.discountAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalCoupons,
                    activeCoupons,
                    expiredCoupons,
                    inactiveCoupons: totalCoupons - activeCoupons - expiredCoupons
                },
                topPerformingCoupons: topCoupons,
                monthlyTrend
            }
        });
    } catch (error) {
        console.error('Get coupon analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coupon analytics'
        });
    }
};

// Bulk operations
exports.bulkUpdateCoupons = async (req, res) => {
    try {
        const { couponIds, action, data } = req.body;
        
        if (!couponIds || !Array.isArray(couponIds) || couponIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid coupon IDs array is required'
            });
        }

        let updateOperation = {};
        
        switch (action) {
            case 'activate':
                updateOperation = { isActive: true };
                break;
            case 'deactivate':
                updateOperation = { isActive: false };
                break;
            case 'extend_expiry':
                if (!data.days) {
                    return res.status(400).json({
                        success: false,
                        message: 'Number of days is required for expiry extension'
                    });
                }
                // This would require individual updates for each coupon
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid action'
                });
        }

        if (action === 'extend_expiry') {
            // Handle expiry extension individually
            const results = await Promise.all(
                couponIds.map(async (couponId) => {
                    const coupon = await Coupon.findById(couponId);
                    if (coupon) {
                        const newExpiry = new Date(coupon.expiresAt);
                        newExpiry.setDate(newExpiry.getDate() + parseInt(data.days));
                        coupon.expiresAt = newExpiry;
                        await coupon.save();
                        return couponId;
                    }
                    return null;
                })
            );
            
            const updatedCount = results.filter(Boolean).length;
            
            res.json({
                success: true,
                data: {
                    updatedCount,
                    message: `Extended expiry for ${updatedCount} coupons by ${data.days} days`
                }
            });
        } else {
            const result = await Coupon.updateMany(
                { _id: { $in: couponIds } },
                updateOperation
            );

            res.json({
                success: true,
                data: {
                    modifiedCount: result.modifiedCount,
                    message: `${action} operation completed for ${result.modifiedCount} coupons`
                }
            });
        }
    } catch (error) {
        console.error('Bulk update coupons error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform bulk operation'
        });
    }
};
