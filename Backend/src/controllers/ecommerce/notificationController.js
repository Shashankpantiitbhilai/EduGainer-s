const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/student');
const Inventory = require('../../models/Inventory');

// Send order status notification
exports.sendOrderNotification = async (req, res) => {
    try {
        const { orderId, status, message } = req.body;
        
        const order = await Order.findById(orderId)
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Here you would integrate with your notification service
        // For now, we'll simulate the notification sending
        
        const notificationData = {
            type: 'order_update',
            orderId: order._id,
            orderNumber: order.orderNumber,
            status,
            message: message || `Your order #${order.orderNumber} status has been updated to ${status}`,
            user: {
                name: order.user.name,
                email: order.user.email,
                phone: order.user.phone
            },
            timestamp: new Date()
        };

        // Simulate sending email notification
        console.log('Sending email notification:', notificationData);
        
        // Simulate sending SMS notification if phone number exists
        if (order.user.phone) {
            console.log('Sending SMS notification:', {
                phone: order.user.phone,
                message: notificationData.message
            });
        }

        // In a real implementation, you would:
        // 1. Send email using your email service (nodemailer, sendgrid, etc.)
        // 2. Send SMS using SMS service (twilio, etc.)
        // 3. Send push notification if mobile app exists
        // 4. Store notification in database for tracking

        res.json({
            success: true,
            data: {
                notificationSent: true,
                channels: ['email', ...(order.user.phone ? ['sms'] : [])],
                message: 'Order notification sent successfully'
            }
        });
    } catch (error) {
        console.error('Send order notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send order notification'
        });
    }
};

// Send product availability notification
exports.sendProductNotification = async (req, res) => {
    try {
        const { productId, type, message } = req.body;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let targetUsers = [];
        
        if (type === 'back_in_stock') {
            // Find users who have this product in their wishlist
            const Wishlist = require('../../models/Wishlist');
            const wishlists = await Wishlist.find({ 'items.product': productId })
                .populate('user', 'name email phone');
            
            targetUsers = wishlists.map(wishlist => wishlist.user);
        } else if (type === 'price_drop') {
            // Similar logic for price drop notifications
            // For now, we'll use a placeholder
            targetUsers = [];
        }

        const notifications = targetUsers.map(user => ({
            type: 'product_update',
            productId: product._id,
            productName: product.name,
            notificationType: type,
            message: message || `Great news! ${product.name} is now ${type.replace('_', ' ')}`,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            timestamp: new Date()
        }));

        // Simulate sending notifications
        console.log('Sending product notifications:', notifications);

        res.json({
            success: true,
            data: {
                notificationsSent: notifications.length,
                targetUsers: targetUsers.length,
                message: `Product notifications sent to ${targetUsers.length} users`
            }
        });
    } catch (error) {
        console.error('Send product notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send product notification'
        });
    }
};

// Send bulk promotional notifications
exports.sendPromotionalNotification = async (req, res) => {
    try {
        const { subject, message, targetAudience, channels = ['email'] } = req.body;
        
        let userQuery = {};
        
        // Define target audience
        switch (targetAudience) {
            case 'all':
                userQuery = {};
                break;
            case 'premium':
                // Users with premium subscriptions
                userQuery = { subscriptionStatus: 'active' };
                break;
            case 'inactive':
                // Users who haven't ordered in last 30 days
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                const recentOrders = await Order.distinct('user', {
                    createdAt: { $gte: thirtyDaysAgo }
                });
                userQuery = { _id: { $nin: recentOrders } };
                break;
            case 'high_value':
                // Users with total spend > 10000
                const highValueUsers = await Order.aggregate([
                    { $match: { status: 'delivered' } },
                    {
                        $group: {
                            _id: '$user',
                            totalSpent: { $sum: '$totalAmount' }
                        }
                    },
                    { $match: { totalSpent: { $gt: 10000 } } }
                ]);
                userQuery = { _id: { $in: highValueUsers.map(u => u._id) } };
                break;
            default:
                userQuery = {};
        }

        const users = await User.find(userQuery)
            .select('name email phone preferences');

        // Filter users based on their notification preferences
        const eligibleUsers = users.filter(user => {
            // Check if user has opted in for promotional notifications
            return !user.preferences?.notifications?.promotional || 
                   user.preferences.notifications.promotional !== false;
        });

        const notifications = eligibleUsers.map(user => ({
            type: 'promotional',
            subject,
            message,
            channels,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            timestamp: new Date()
        }));

        // Simulate sending notifications
        console.log('Sending promotional notifications:', {
            count: notifications.length,
            subject,
            targetAudience,
            channels
        });

        res.json({
            success: true,
            data: {
                totalUsers: users.length,
                eligibleUsers: eligibleUsers.length,
                notificationsSent: notifications.length,
                message: `Promotional notifications sent to ${notifications.length} users`
            }
        });
    } catch (error) {
        console.error('Send promotional notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send promotional notification'
        });
    }
};

// Send low stock alert to admins
exports.sendLowStockAlert = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;
        
        const lowStockItems = await Inventory.find({
            $or: [
                { quantity: { $lte: threshold } },
                { 'variants.quantity': { $lte: threshold } }
            ]
        })
        .populate('product', 'name sku price');

        if (lowStockItems.length === 0) {
            return res.json({
                success: true,
                data: {
                    alertsSent: 0,
                    message: 'No low stock items found'
                }
            });
        }

        // Get admin users (you might have a different way to identify admins)
        const adminUsers = await User.find({ role: 'admin' })
            .select('name email');

        const alertData = {
            type: 'low_stock_alert',
            threshold,
            lowStockItems: lowStockItems.map(item => ({
                productName: item.product.name,
                sku: item.product.sku,
                currentStock: item.quantity,
                variants: item.variants?.filter(v => v.quantity <= threshold) || []
            })),
            timestamp: new Date()
        };

        // Simulate sending alerts to admins
        console.log('Sending low stock alerts to admins:', {
            adminCount: adminUsers.length,
            lowStockItemsCount: lowStockItems.length,
            alertData
        });

        res.json({
            success: true,
            data: {
                alertsSent: adminUsers.length,
                lowStockItemsCount: lowStockItems.length,
                message: `Low stock alerts sent to ${adminUsers.length} administrators`
            }
        });
    } catch (error) {
        console.error('Send low stock alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send low stock alert'
        });
    }
};

// Send abandoned cart reminder
exports.sendAbandonedCartReminder = async (req, res) => {
    try {
        const { hoursThreshold = 24 } = req.query;
        
        const Cart = require('../../models/Cart');
        const thresholdDate = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
        
        const abandonedCarts = await Cart.find({
            updatedAt: { $lt: thresholdDate },
            items: { $ne: [] } // Cart is not empty
        })
        .populate('user', 'name email phone')
        .populate('items.product', 'name price images');

        // Filter out carts where user has placed an order after cart update
        const cartsToRemind = [];
        
        for (const cart of abandonedCarts) {
            const recentOrder = await Order.findOne({
                user: cart.user._id,
                createdAt: { $gt: cart.updatedAt }
            });
            
            if (!recentOrder) {
                cartsToRemind.push(cart);
            }
        }

        const reminders = cartsToRemind.map(cart => ({
            type: 'abandoned_cart',
            cartId: cart._id,
            cartValue: cart.totalAmount,
            itemCount: cart.items.length,
            user: {
                name: cart.user.name,
                email: cart.user.email,
                phone: cart.user.phone
            },
            items: cart.items.slice(0, 3), // Show first 3 items in reminder
            timestamp: new Date()
        }));

        // Simulate sending reminders
        console.log('Sending abandoned cart reminders:', {
            count: reminders.length,
            hoursThreshold
        });

        res.json({
            success: true,
            data: {
                totalAbandonedCarts: abandonedCarts.length,
                remindersSent: reminders.length,
                message: `Abandoned cart reminders sent to ${reminders.length} users`
            }
        });
    } catch (error) {
        console.error('Send abandoned cart reminder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send abandoned cart reminders'
        });
    }
};

// Get notification analytics
exports.getNotificationAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // This would typically come from a notifications table
        // For now, we'll provide mock analytics data
        
        const analytics = {
            summary: {
                totalSent: 1250,
                delivered: 1180,
                opened: 590,
                clicked: 118,
                unsubscribed: 5
            },
            byType: [
                { type: 'order_update', sent: 800, delivered: 785, opened: 470 },
                { type: 'promotional', sent: 300, delivered: 270, opened: 90 },
                { type: 'product_update', sent: 100, delivered: 95, opened: 25 },
                { type: 'abandoned_cart', sent: 50, delivered: 30, opened: 5 }
            ],
            byChannel: [
                { channel: 'email', sent: 1000, delivered: 950, opened: 475 },
                { channel: 'sms', sent: 200, delivered: 195, opened: 98 },
                { channel: 'push', sent: 50, delivered: 35, opened: 17 }
            ],
            trends: [
                { date: '2024-01-01', sent: 45, delivered: 42, opened: 21 },
                { date: '2024-01-02', sent: 38, delivered: 36, opened: 18 },
                { date: '2024-01-03', sent: 52, delivered: 49, opened: 24 }
                // ... more trend data
            ]
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Get notification analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notification analytics'
        });
    }
};

// Update user notification preferences
exports.updateNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const { preferences } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'preferences.notifications': preferences
                }
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                preferences: user.preferences?.notifications || {},
                message: 'Notification preferences updated successfully'
            }
        });
    } catch (error) {
        console.error('Update notification preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification preferences'
        });
    }
};

// Test notification system
exports.testNotification = async (req, res) => {
    try {
        const { type, channel, recipient } = req.body;
        
        const testNotification = {
            type: 'test',
            subType: type,
            channel,
            recipient,
            message: 'This is a test notification from EduGainer\'s e-commerce system',
            timestamp: new Date()
        };

        // Simulate sending test notification
        console.log('Sending test notification:', testNotification);

        res.json({
            success: true,
            data: {
                testSent: true,
                notificationDetails: testNotification,
                message: 'Test notification sent successfully'
            }
        });
    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test notification'
        });
    }
};
