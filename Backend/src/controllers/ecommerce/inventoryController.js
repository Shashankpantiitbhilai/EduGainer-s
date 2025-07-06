const Inventory = require('../../models/Inventory');
const Product = require('../../models/Product');
const { body, validationResult } = require('express-validator');

// Get inventory status for a product
exports.getProductInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const inventory = await Inventory.findOne({ product: productId })
            .populate('product', 'name sku');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory not found for this product'
            });
        }

        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error('Get product inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory'
        });
    }
};

// Check stock availability
exports.checkStockAvailability = async (req, res) => {
    try {
        const { items } = req.body; // Array of { productId, quantity, variant }
        
        const stockChecks = await Promise.all(
            items.map(async (item) => {
                const inventory = await Inventory.findOne({ product: item.productId });
                
                if (!inventory) {
                    return {
                        productId: item.productId,
                        available: false,
                        requestedQuantity: item.quantity,
                        availableQuantity: 0,
                        message: 'Product not found in inventory'
                    };
                }

                let availableQuantity = inventory.quantity;
                
                // Check variant stock if applicable
                if (item.variant && inventory.variants && inventory.variants.length > 0) {
                    const variantStock = inventory.variants.find(v => 
                        v.variant === item.variant
                    );
                    availableQuantity = variantStock ? variantStock.quantity : 0;
                }

                const available = availableQuantity >= item.quantity;

                return {
                    productId: item.productId,
                    available,
                    requestedQuantity: item.quantity,
                    availableQuantity,
                    message: available ? 'In stock' : 'Insufficient stock'
                };
            })
        );

        const allAvailable = stockChecks.every(check => check.available);

        res.json({
            success: true,
            data: {
                allAvailable,
                items: stockChecks
            }
        });
    } catch (error) {
        console.error('Check stock availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check stock availability'
        });
    }
};

// Reserve stock for order
exports.reserveStock = async (req, res) => {
    try {
        const { orderId, items, reservationMinutes = 15 } = req.body;
        
        const reservationExpiry = new Date(Date.now() + reservationMinutes * 60 * 1000);
        
        const reservations = await Promise.all(
            items.map(async (item) => {
                const inventory = await Inventory.findOne({ product: item.productId });
                
                if (!inventory) {
                    throw new Error(`Product ${item.productId} not found in inventory`);
                }

                // Check if enough stock is available
                let availableQuantity = inventory.quantity;
                if (item.variant && inventory.variants && inventory.variants.length > 0) {
                    const variantStock = inventory.variants.find(v => v.variant === item.variant);
                    availableQuantity = variantStock ? variantStock.quantity : 0;
                }

                if (availableQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.productId}`);
                }

                // Add reservation
                const reservation = {
                    orderId,
                    quantity: item.quantity,
                    variant: item.variant || null,
                    expiresAt: reservationExpiry
                };

                inventory.reservations.push(reservation);
                await inventory.save();

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    variant: item.variant,
                    reservedUntil: reservationExpiry
                };
            })
        );

        res.json({
            success: true,
            data: {
                orderId,
                reservations,
                expiresAt: reservationExpiry
            }
        });
    } catch (error) {
        console.error('Reserve stock error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reserve stock'
        });
    }
};

// Release stock reservation
exports.releaseReservation = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const inventories = await Inventory.find({
            'reservations.orderId': orderId
        });

        await Promise.all(
            inventories.map(async (inventory) => {
                inventory.reservations = inventory.reservations.filter(
                    reservation => reservation.orderId !== orderId
                );
                await inventory.save();
            })
        );

        res.json({
            success: true,
            message: 'Stock reservation released successfully'
        });
    } catch (error) {
        console.error('Release reservation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to release stock reservation'
        });
    }
};

// Deduct stock after successful order
exports.deductStock = async (req, res) => {
    try {
        const { orderId, items } = req.body;
        
        const updates = await Promise.all(
            items.map(async (item) => {
                const inventory = await Inventory.findOne({ product: item.productId });
                
                if (!inventory) {
                    throw new Error(`Product ${item.productId} not found in inventory`);
                }

                // Remove reservation and deduct stock
                inventory.reservations = inventory.reservations.filter(
                    reservation => reservation.orderId !== orderId
                );

                if (item.variant && inventory.variants && inventory.variants.length > 0) {
                    const variantIndex = inventory.variants.findIndex(v => v.variant === item.variant);
                    if (variantIndex !== -1) {
                        inventory.variants[variantIndex].quantity -= item.quantity;
                    }
                } else {
                    inventory.quantity -= item.quantity;
                }

                // Add stock movement record
                inventory.stockMovements.push({
                    type: 'sale',
                    quantity: -item.quantity,
                    variant: item.variant || null,
                    reference: orderId,
                    reason: 'Order fulfilled'
                });

                await inventory.save();

                return {
                    productId: item.productId,
                    deductedQuantity: item.quantity,
                    remainingStock: item.variant ? 
                        inventory.variants.find(v => v.variant === item.variant)?.quantity || 0 :
                        inventory.quantity
                };
            })
        );

        res.json({
            success: true,
            data: {
                orderId,
                stockUpdates: updates
            }
        });
    } catch (error) {
        console.error('Deduct stock error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to deduct stock'
        });
    }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;
        
        const lowStockItems = await Inventory.find({
            $or: [
                { quantity: { $lte: threshold } },
                { 'variants.quantity': { $lte: threshold } }
            ]
        })
        .populate('product', 'name sku images')
        .sort({ quantity: 1 });

        const alerts = lowStockItems.map(inventory => {
            const alerts = [];
            
            // Check main stock
            if (inventory.quantity <= threshold) {
                alerts.push({
                    type: 'main_stock',
                    productId: inventory.product._id,
                    productName: inventory.product.name,
                    sku: inventory.product.sku,
                    currentStock: inventory.quantity,
                    threshold,
                    variant: null
                });
            }

            // Check variant stocks
            if (inventory.variants && inventory.variants.length > 0) {
                inventory.variants.forEach(variant => {
                    if (variant.quantity <= threshold) {
                        alerts.push({
                            type: 'variant_stock',
                            productId: inventory.product._id,
                            productName: inventory.product.name,
                            sku: inventory.product.sku,
                            currentStock: variant.quantity,
                            threshold,
                            variant: variant.variant
                        });
                    }
                });
            }

            return alerts;
        }).flat();

        res.json({
            success: true,
            data: {
                alertCount: alerts.length,
                alerts
            }
        });
    } catch (error) {
        console.error('Get low stock alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch low stock alerts'
        });
    }
};

// Clean up expired reservations
exports.cleanupExpiredReservations = async (req, res) => {
    try {
        const now = new Date();
        
        const result = await Inventory.updateMany(
            { 'reservations.expiresAt': { $lt: now } },
            {
                $pull: {
                    reservations: { expiresAt: { $lt: now } }
                }
            }
        );

        res.json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                message: 'Expired reservations cleaned up successfully'
            }
        });
    } catch (error) {
        console.error('Cleanup expired reservations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cleanup expired reservations'
        });
    }
};
