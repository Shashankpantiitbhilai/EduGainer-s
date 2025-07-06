const Inventory = require('../../../models/Inventory');
const Product = require('../../../models/Product');
const { body, validationResult } = require('express-validator');

// Get inventory overview
exports.getInventoryOverview = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;
        
        // Overall statistics
        const totalProducts = await Inventory.countDocuments();
        const lowStockCount = await Inventory.countDocuments({
            $or: [
                { quantity: { $lte: threshold } },
                { 'variants.quantity': { $lte: threshold } }
            ]
        });
        const outOfStockCount = await Inventory.countDocuments({
            $or: [
                { quantity: 0 },
                { 'variants.quantity': 0 }
            ]
        });

        // Total stock value
        const stockValue = await Inventory.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $addFields: {
                    stockValue: { $multiply: ['$quantity', '$productInfo.price'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: '$stockValue' },
                    totalQuantity: { $sum: '$quantity' }
                }
            }
        ]);

        // Category-wise inventory
        const categoryInventory = await Inventory.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    lowStockItems: {
                        $sum: {
                            $cond: [{ $lte: ['$quantity', threshold] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $project: {
                    categoryName: '$categoryInfo.name',
                    totalProducts: 1,
                    totalQuantity: 1,
                    lowStockItems: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalProducts,
                    lowStockCount,
                    outOfStockCount,
                    totalStockValue: stockValue[0]?.totalValue || 0,
                    totalQuantity: stockValue[0]?.totalQuantity || 0
                },
                categoryBreakdown: categoryInventory
            }
        });
    } catch (error) {
        console.error('Get inventory overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory overview'
        });
    }
};

// Get all inventory items with pagination
exports.getAllInventory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { category, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        let pipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' }
        ];

        // Add match stage for filters
        let matchStage = {};
        
        if (category) {
            matchStage['productInfo.category'] = category;
        }

        if (search) {
            matchStage.$or = [
                { 'productInfo.name': { $regex: search, $options: 'i' } },
                { 'productInfo.sku': { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            if (status === 'low_stock') {
                matchStage.$or = [
                    { quantity: { $lte: 10 } },
                    { 'variants.quantity': { $lte: 10 } }
                ];
            } else if (status === 'out_of_stock') {
                matchStage.$or = [
                    { quantity: 0 },
                    { 'variants.quantity': 0 }
                ];
            } else if (status === 'in_stock') {
                matchStage.quantity = { $gt: 10 };
            }
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Add sort stage
        const sortStage = {};
        if (sortBy === 'quantity') {
            sortStage.quantity = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'name') {
            sortStage['productInfo.name'] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortStage.createdAt = sortOrder === 'desc' ? -1 : 1;
        }
        pipeline.push({ $sort: sortStage });

        // Add pagination
        pipeline.push({ $skip: skip }, { $limit: limit });

        // Project fields
        pipeline.push({
            $project: {
                _id: 1,
                product: '$productInfo._id',
                productName: '$productInfo.name',
                productSku: '$productInfo.sku',
                productPrice: '$productInfo.price',
                productImages: '$productInfo.images',
                quantity: 1,
                lowStockThreshold: 1,
                variants: 1,
                lastRestocked: 1,
                location: 1,
                supplier: 1,
                createdAt: 1,
                updatedAt: 1
            }
        });

        const inventory = await Inventory.aggregate(pipeline);

        // Get total count for pagination
        const countPipeline = pipeline.slice(0, -3); // Remove skip, limit, and project stages
        countPipeline.push({ $count: 'total' });
        const totalResult = await Inventory.aggregate(countPipeline);
        const total = totalResult[0]?.total || 0;

        res.json({
            success: true,
            data: {
                inventory,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory'
        });
    }
};

// Update inventory for a product
exports.updateInventory = [
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be non-negative integer'),
    body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Low stock threshold must be non-negative integer'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('supplier').optional().notEmpty().withMessage('Supplier cannot be empty'),
    
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

            const { inventoryId } = req.params;
            const { quantity, lowStockThreshold, location, supplier, variants } = req.body;

            const inventory = await Inventory.findById(inventoryId);
            
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }

            const oldQuantity = inventory.quantity;

            // Update inventory fields
            if (quantity !== undefined) inventory.quantity = quantity;
            if (lowStockThreshold !== undefined) inventory.lowStockThreshold = lowStockThreshold;
            if (location) inventory.location = location;
            if (supplier) inventory.supplier = supplier;
            if (variants) inventory.variants = variants;

            // Add stock movement record if quantity changed
            if (quantity !== undefined && quantity !== oldQuantity) {
                const movementType = quantity > oldQuantity ? 'restock' : 'adjustment';
                const quantityChange = quantity - oldQuantity;
                
                inventory.stockMovements.push({
                    type: movementType,
                    quantity: quantityChange,
                    reason: 'Admin update',
                    performedBy: req.user._id
                });

                inventory.lastRestocked = new Date();
            }

            await inventory.save();

            const updatedInventory = await Inventory.findById(inventoryId)
                .populate('product', 'name sku price images');

            res.json({
                success: true,
                data: updatedInventory,
                message: 'Inventory updated successfully'
            });
        } catch (error) {
            console.error('Update inventory error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update inventory'
            });
        }
    }
];

// Add stock to inventory
exports.addStock = [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive integer'),
    body('reason').notEmpty().withMessage('Reason is required'),
    
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

            const { inventoryId } = req.params;
            const { quantity, reason, variant = null } = req.body;

            const inventory = await Inventory.findById(inventoryId);
            
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }

            // Update stock
            if (variant && inventory.variants && inventory.variants.length > 0) {
                const variantIndex = inventory.variants.findIndex(v => v.variant === variant);
                if (variantIndex !== -1) {
                    inventory.variants[variantIndex].quantity += quantity;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Variant not found'
                    });
                }
            } else {
                inventory.quantity += quantity;
            }

            // Add stock movement record
            inventory.stockMovements.push({
                type: 'restock',
                quantity: quantity,
                variant,
                reason,
                performedBy: req.user._id
            });

            inventory.lastRestocked = new Date();
            await inventory.save();

            const updatedInventory = await Inventory.findById(inventoryId)
                .populate('product', 'name sku price images');

            res.json({
                success: true,
                data: updatedInventory,
                message: `Successfully added ${quantity} units to inventory`
            });
        } catch (error) {
            console.error('Add stock error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to add stock'
            });
        }
    }
];

// Adjust stock (can be positive or negative)
exports.adjustStock = [
    body('adjustment').isInt().withMessage('Adjustment must be an integer'),
    body('reason').notEmpty().withMessage('Reason is required'),
    
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

            const { inventoryId } = req.params;
            const { adjustment, reason, variant = null } = req.body;

            const inventory = await Inventory.findById(inventoryId);
            
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }

            // Calculate new quantity
            let currentQuantity;
            if (variant && inventory.variants && inventory.variants.length > 0) {
                const variantIndex = inventory.variants.findIndex(v => v.variant === variant);
                if (variantIndex !== -1) {
                    currentQuantity = inventory.variants[variantIndex].quantity;
                    const newQuantity = Math.max(0, currentQuantity + adjustment);
                    inventory.variants[variantIndex].quantity = newQuantity;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Variant not found'
                    });
                }
            } else {
                currentQuantity = inventory.quantity;
                const newQuantity = Math.max(0, currentQuantity + adjustment);
                inventory.quantity = newQuantity;
            }

            // Add stock movement record
            inventory.stockMovements.push({
                type: 'adjustment',
                quantity: adjustment,
                variant,
                reason,
                performedBy: req.user._id
            });

            await inventory.save();

            const updatedInventory = await Inventory.findById(inventoryId)
                .populate('product', 'name sku price images');

            res.json({
                success: true,
                data: updatedInventory,
                message: `Stock adjusted by ${adjustment} units`
            });
        } catch (error) {
            console.error('Adjust stock error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to adjust stock'
            });
        }
    }
];

// Get stock movement history
exports.getStockMovements = async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const inventory = await Inventory.findById(inventoryId)
            .populate('product', 'name sku')
            .populate('stockMovements.performedBy', 'name email');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Sort movements by date (newest first) and paginate
        const sortedMovements = inventory.stockMovements
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(skip, skip + limit);

        res.json({
            success: true,
            data: {
                product: {
                    name: inventory.product.name,
                    sku: inventory.product.sku
                },
                movements: sortedMovements,
                pagination: {
                    page,
                    limit,
                    total: inventory.stockMovements.length,
                    totalPages: Math.ceil(inventory.stockMovements.length / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get stock movements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock movements'
        });
    }
};

// Bulk inventory operations
exports.bulkInventoryUpdate = async (req, res) => {
    try {
        const { operations } = req.body; // Array of {inventoryId, quantity, reason}
        
        if (!operations || !Array.isArray(operations) || operations.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid operations array is required'
            });
        }

        const results = await Promise.all(
            operations.map(async (operation) => {
                try {
                    const { inventoryId, quantity, reason = 'Bulk update' } = operation;
                    
                    const inventory = await Inventory.findById(inventoryId);
                    if (!inventory) {
                        return {
                            inventoryId,
                            success: false,
                            message: 'Inventory item not found'
                        };
                    }

                    const oldQuantity = inventory.quantity;
                    inventory.quantity = quantity;

                    // Add stock movement record
                    inventory.stockMovements.push({
                        type: 'adjustment',
                        quantity: quantity - oldQuantity,
                        reason,
                        performedBy: req.user._id
                    });

                    await inventory.save();

                    return {
                        inventoryId,
                        success: true,
                        oldQuantity,
                        newQuantity: quantity
                    };
                } catch (error) {
                    return {
                        inventoryId: operation.inventoryId,
                        success: false,
                        message: error.message
                    };
                }
            })
        );

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;

        res.json({
            success: true,
            data: {
                results,
                summary: {
                    total: results.length,
                    successful: successCount,
                    failed: failureCount
                }
            },
            message: `Bulk update completed: ${successCount} successful, ${failureCount} failed`
        });
    } catch (error) {
        console.error('Bulk inventory update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform bulk inventory update'
        });
    }
};
