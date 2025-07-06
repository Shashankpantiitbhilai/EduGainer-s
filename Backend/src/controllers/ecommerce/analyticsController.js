const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/student');
const Review = require('../../models/Review');

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, period = 'month' } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Overall sales statistics
        const totalSales = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        // Sales by period
        let groupBy = {};
        if (period === 'day') {
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
            };
        } else if (period === 'week') {
            groupBy = {
                year: { $year: '$createdAt' },
                week: { $week: '$createdAt' }
            };
        } else if (period === 'month') {
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            };
        } else {
            groupBy = {
                year: { $year: '$createdAt' }
            };
        }

        const salesTrend = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.name',
                    productSku: '$product.sku',
                    totalQuantitySold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        // Order status distribution
        const orderStatusDistribution = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: totalSales[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 },
                salesTrend,
                topProducts,
                orderStatusDistribution
            }
        });
    } catch (error) {
        console.error('Get sales analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sales analytics'
        });
    }
};

// Get product analytics
exports.getProductAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, categoryId } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                'orders.createdAt': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Product performance metrics
        const productMetrics = await Product.aggregate([
            ...(categoryId ? [{ $match: { category: categoryId } }] : []),
            {
                $lookup: {
                    from: 'orders',
                    let: { productId: '$_id' },
                    pipeline: [
                        { $match: { status: 'delivered', ...dateFilter } },
                        { $unwind: '$items' },
                        { $match: { $expr: { $eq: ['$items.product', '$$productId'] } } }
                    ],
                    as: 'orders'
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    totalSold: { $sum: '$orders.items.quantity' },
                    totalRevenue: {
                        $sum: {
                            $map: {
                                input: '$orders',
                                as: 'order',
                                in: { $multiply: ['$$order.items.quantity', '$$order.items.price'] }
                            }
                        }
                    },
                    averageRating: { $avg: '$reviews.rating' },
                    reviewCount: { $size: '$reviews' }
                }
            },
            {
                $project: {
                    name: 1,
                    sku: 1,
                    price: 1,
                    category: 1,
                    totalSold: 1,
                    totalRevenue: 1,
                    averageRating: 1,
                    reviewCount: 1,
                    conversionRate: {
                        $cond: {
                            if: { $gt: ['$views', 0] },
                            then: { $multiply: [{ $divide: ['$totalSold', '$views'] }, 100] },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 20 }
        ]);

        // Category performance
        const categoryPerformance = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category._id',
                    categoryName: { $first: '$category.name' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    totalQuantitySold: { $sum: '$items.quantity' },
                    orderCount: { $sum: 1 },
                    uniqueProducts: { $addToSet: '$product._id' }
                }
            },
            {
                $addFields: {
                    uniqueProductCount: { $size: '$uniqueProducts' }
                }
            },
            {
                $project: {
                    categoryName: 1,
                    totalRevenue: 1,
                    totalQuantitySold: 1,
                    orderCount: 1,
                    uniqueProductCount: 1
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        // Product view vs sales correlation
        const viewsVsSales = await Product.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    let: { productId: '$_id' },
                    pipeline: [
                        { $match: { status: 'delivered', ...dateFilter } },
                        { $unwind: '$items' },
                        { $match: { $expr: { $eq: ['$items.product', '$$productId'] } } },
                        {
                            $group: {
                                _id: null,
                                totalSold: { $sum: '$items.quantity' }
                            }
                        }
                    ],
                    as: 'salesData'
                }
            },
            {
                $project: {
                    name: 1,
                    views: 1,
                    totalSold: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0] },
                    conversionRate: {
                        $cond: {
                            if: { $gt: ['$views', 0] },
                            then: { $multiply: [{ $divide: [{ $ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0] }, '$views'] }, 100] },
                            else: 0
                        }
                    }
                }
            },
            { $match: { views: { $gt: 0 } } },
            { $sort: { conversionRate: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                productMetrics,
                categoryPerformance,
                viewsVsSales
            }
        });
    } catch (error) {
        console.error('Get product analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product analytics'
        });
    }
};

// Get customer analytics
exports.getCustomerAnalytics = async (req, res) => {
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

        // Customer metrics
        const customerMetrics = await User.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    pipeline: [
                        { $match: { status: 'delivered', ...dateFilter } }
                    ],
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    totalSpent: { $sum: '$orders.totalAmount' },
                    orderCount: { $size: '$orders' },
                    averageOrderValue: { $avg: '$orders.totalAmount' },
                    lastOrderDate: { $max: '$orders.createdAt' }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 0 }
                }
            },
            {
                $facet: {
                    topCustomers: [
                        { $sort: { totalSpent: -1 } },
                        { $limit: 10 },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                totalSpent: 1,
                                orderCount: 1,
                                averageOrderValue: 1,
                                lastOrderDate: 1
                            }
                        }
                    ],
                    customerSegments: [
                        {
                            $bucket: {
                                groupBy: '$totalSpent',
                                boundaries: [0, 1000, 5000, 10000, 50000, Infinity],
                                default: 'Other',
                                output: {
                                    count: { $sum: 1 },
                                    totalRevenue: { $sum: '$totalSpent' },
                                    averageSpent: { $avg: '$totalSpent' }
                                }
                            }
                        }
                    ],
                    orderFrequency: [
                        {
                            $bucket: {
                                groupBy: '$orderCount',
                                boundaries: [1, 2, 5, 10, 20, Infinity],
                                default: 'Other',
                                output: {
                                    customerCount: { $sum: 1 },
                                    totalRevenue: { $sum: '$totalSpent' }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        // New vs returning customers
        const customerTypes = await Order.aggregate([
            { $match: { ...dateFilter } },
            {
                $group: {
                    _id: '$user',
                    firstOrder: { $min: '$createdAt' },
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' }
                }
            },
            {
                $addFields: {
                    isNewCustomer: {
                        $cond: {
                            if: startDate,
                            then: { $gte: ['$firstOrder', new Date(startDate)] },
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$isNewCustomer',
                    customerCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalSpent' },
                    averageOrderValue: { $avg: '$totalSpent' }
                }
            }
        ]);

        // Customer retention analysis
        const retentionAnalysis = await Order.aggregate([
            { $match: { status: 'delivered' } },
            {
                $group: {
                    _id: '$user',
                    orders: { $push: { date: '$createdAt', amount: '$totalAmount' } }
                }
            },
            {
                $addFields: {
                    orderCount: { $size: '$orders' },
                    daysBetweenOrders: {
                        $cond: {
                            if: { $gt: [{ $size: '$orders' }, 1] },
                            then: {
                                $divide: [
                                    { $subtract: [{ $max: '$orders.date' }, { $min: '$orders.date' }] },
                                    86400000 // milliseconds in a day
                                ]
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $match: {
                    daysBetweenOrders: { $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRetentionDays: { $avg: '$daysBetweenOrders' },
                    repeatCustomers: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                topCustomers: customerMetrics[0]?.topCustomers || [],
                customerSegments: customerMetrics[0]?.customerSegments || [],
                orderFrequency: customerMetrics[0]?.orderFrequency || [],
                customerTypes,
                retentionAnalysis: retentionAnalysis[0] || { averageRetentionDays: 0, repeatCustomers: 0 }
            }
        });
    } catch (error) {
        console.error('Get customer analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer analytics'
        });
    }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
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

        // Revenue breakdown
        const revenueBreakdown = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalDiscount: { $sum: '$coupon.discountAmount' },
                    totalShipping: { $sum: '$shippingCost' },
                    totalTax: { $sum: '$taxAmount' },
                    grossRevenue: { $sum: { $add: ['$totalAmount', '$coupon.discountAmount'] } }
                }
            }
        ]);

        // Monthly revenue trend
        const monthlyRevenue = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Revenue by payment method
        const revenueByPaymentMethod = await Order.aggregate([
            { $match: { status: 'delivered', ...dateFilter } },
            {
                $group: {
                    _id: '$paymentMethod',
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        // Revenue forecast (simple linear regression based on trend)
        let forecast = null;
        if (monthlyRevenue.length >= 3) {
            const revenues = monthlyRevenue.map(m => m.revenue);
            const n = revenues.length;
            const sumX = revenues.reduce((sum, _, i) => sum + i, 0);
            const sumY = revenues.reduce((sum, revenue) => sum + revenue, 0);
            const sumXY = revenues.reduce((sum, revenue, i) => sum + (i * revenue), 0);
            const sumXX = revenues.reduce((sum, _, i) => sum + (i * i), 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            forecast = {
                nextMonth: slope * n + intercept,
                trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
            };
        }

        res.json({
            success: true,
            data: {
                breakdown: revenueBreakdown[0] || {
                    totalRevenue: 0,
                    totalDiscount: 0,
                    totalShipping: 0,
                    totalTax: 0,
                    grossRevenue: 0
                },
                monthlyTrend: monthlyRevenue,
                paymentMethodBreakdown: revenueByPaymentMethod,
                forecast
            }
        });
    } catch (error) {
        console.error('Get revenue analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue analytics'
        });
    }
};

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
    try {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Current month statistics
        const currentMonthStats = await Order.aggregate([
            {
                $facet: {
                    thisMonth: [
                        { $match: { createdAt: { $gte: thisMonth } } },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: '$totalAmount' },
                                deliveredOrders: {
                                    $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    lastMonth: [
                        { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth } } },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: '$totalAmount' },
                                deliveredOrders: {
                                    $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber user totalAmount status createdAt');

        // Low stock alerts
        const Inventory = require('../../models/Inventory');
        const lowStockItems = await Inventory.find({
            $or: [
                { quantity: { $lte: 10 } },
                { 'variants.quantity': { $lte: 10 } }
            ]
        })
        .populate('product', 'name sku')
        .limit(5);

        // Top products this month
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: thisMonth }, status: 'delivered' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.name',
                    productSku: '$product.sku',
                    totalSold: 1,
                    revenue: 1
                }
            }
        ]);

        const thisMonthData = currentMonthStats[0]?.thisMonth[0] || { totalOrders: 0, totalRevenue: 0, deliveredOrders: 0 };
        const lastMonthData = currentMonthStats[0]?.lastMonth[0] || { totalOrders: 0, totalRevenue: 0, deliveredOrders: 0 };

        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        res.json({
            success: true,
            data: {
                overview: {
                    thisMonth: thisMonthData,
                    growth: {
                        orders: calculateGrowth(thisMonthData.totalOrders, lastMonthData.totalOrders),
                        revenue: calculateGrowth(thisMonthData.totalRevenue, lastMonthData.totalRevenue),
                        deliveryRate: thisMonthData.totalOrders > 0 ? 
                            (thisMonthData.deliveredOrders / thisMonthData.totalOrders) * 100 : 0
                    }
                },
                recentOrders,
                lowStockAlerts: lowStockItems,
                topProducts
            }
        });
    } catch (error) {
        console.error('Get dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard overview'
        });
    }
};
