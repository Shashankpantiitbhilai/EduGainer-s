const Order = require('../../../models/Order');
const Product = require('../../../models/Product');
const Payment = require('../../../models/Payment');
const Inventory = require('../../../models/Inventory');
const { validationResult } = require('express-validator');

// Get all orders with filters (Admin)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (paymentStatus) {
      filter['payment.status'] = paymentStatus;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order details (Admin)
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name images sku')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get payment details
    const payment = await Payment.findOne({ order: orderId });

    // Get order timeline/history
    const timeline = order.timeline || [];

    res.json({
      success: true,
      data: {
        ...order,
        payment,
        timeline
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Process refund for an order
const processRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason, refundType = 'full' } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is eligible for refund
    if (!['delivered', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order is not eligible for refund'
      });
    }

    // Get payment details
    const payment = await Payment.findOne({ order: orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    const refundAmount = refundType === 'full' ? order.totalAmount : amount;

    // Validate refund amount
    if (refundAmount > order.totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed order total'
      });
    }

    // Process refund through payment gateway (Razorpay)
    try {
      // Note: Implement actual Razorpay refund logic here
      // const refund = await razorpay.payments.refund(payment.paymentId, {
      //   amount: refundAmount * 100 // Convert to paisa
      // });

      // Update order status
      order.status = refundType === 'full' ? 'refunded' : 'partially_refunded';
      order.refund = {
        amount: refundAmount,
        reason,
        processedAt: new Date(),
        refundId: `refund_${Date.now()}`, // Use actual refund ID from payment gateway
        status: 'processed'
      };

      // Add to timeline
      order.timeline.push({
        status: order.status,
        timestamp: new Date(),
        note: `Refund processed: ${refundAmount} - ${reason}`
      });

      await order.save();

      // Update payment record
      payment.refunds = payment.refunds || [];
      payment.refunds.push({
        amount: refundAmount,
        reason,
        processedAt: new Date(),
        refundId: order.refund.refundId
      });
      await payment.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          orderId: order._id,
          refundAmount,
          refundId: order.refund.refundId,
          status: order.status
        }
      });
    } catch (paymentError) {
      console.error('Payment gateway error:', paymentError);
      res.status(500).json({
        success: false,
        message: 'Error processing refund through payment gateway',
        error: paymentError.message
      });
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

// Get order timeline/history
const getOrderTimeline = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select('timeline status createdAt');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const timeline = order.timeline || [];
    
    // Ensure created status is in timeline
    if (!timeline.some(t => t.status === 'pending')) {
      timeline.unshift({
        status: 'pending',
        timestamp: order.createdAt,
        note: 'Order created'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        currentStatus: order.status,
        timeline: timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      }
    });
  } catch (error) {
    console.error('Error fetching order timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order timeline',
      error: error.message
    });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;
    order.status = status;

    // Add to timeline
    order.timeline.push({
      status: status,
      timestamp: new Date(),
      description: notes || `Order status updated to ${status}`,
      updatedBy: req.user.id
    });

    // Update specific fields based on status
    switch (status) {
      case 'processing':
        order.processingStartedAt = new Date();
        break;
      case 'shipped':
        order.shippedAt = new Date();
        if (trackingNumber) {
          order.tracking.trackingNumber = trackingNumber;
          order.tracking.carrier = req.body.carrier || 'TBD';
        }
        if (estimatedDelivery) {
          order.estimatedDelivery = new Date(estimatedDelivery);
        }
        break;
      case 'delivered':
        order.deliveredAt = new Date();
        order.status = 'completed'; // Auto-complete on delivery
        break;
      case 'cancelled':
        // Release inventory
        for (const item of order.items) {
          const inventory = await Inventory.findOne({ product: item.product });
          if (inventory) {
            inventory.releaseReservedStock(item.quantity, order.orderNumber);
            await inventory.save();
          }
        }
        break;
    }

    await order.save();

    // Send notification to customer
    // You can implement email/SMS service here

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus: status,
        timeline: order.timeline[order.timeline.length - 1]
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Process return request (Admin)
const processReturnRequest = async (req, res) => {
  try {
    const { id, returnId } = req.params;
    const { action, notes, refundAmount } = req.body; // action: 'approve' or 'reject'

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const returnRequest = order.returnRequests.id(returnId);
    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (action === 'approve') {
      returnRequest.status = 'approved';
      returnRequest.approvedAt = new Date();
      returnRequest.approvedBy = req.user.id;
      returnRequest.refundAmount = refundAmount || returnRequest.refundAmount;
      returnRequest.adminNotes = notes;

      // Update inventory
      for (const item of returnRequest.items) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
          inventory.addStock(
            item.quantity, 
            'return', 
            order.orderNumber, 
            req.user.id,
            'Product returned by customer'
          );
          await inventory.save();
        }
      }

      // Process refund
      const payment = await Payment.findById(order.payment.paymentId);
      if (payment) {
        payment.initiateRefund(
          returnRequest.refundAmount,
          'product_return',
          'Return approved by admin',
          req.user.id
        );
        await payment.save();
      }

    } else if (action === 'reject') {
      returnRequest.status = 'rejected';
      returnRequest.rejectedAt = new Date();
      returnRequest.rejectedBy = req.user.id;
      returnRequest.adminNotes = notes;
    }

    await order.save();

    res.json({
      success: true,
      message: `Return request ${action}d successfully`,
      data: {
        returnRequest: returnRequest,
        refundAmount: action === 'approve' ? returnRequest.refundAmount : 0
      }
    });
  } catch (error) {
    console.error('Error processing return request:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing return request',
      error: error.message
    });
  }
};

// Get order analytics (Admin)
const getOrderAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    if (!startDate) {
      start.setDate(start.getDate() - 30); // Default to last 30 days
    }

    // Overall stats
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totals.total' }
        }
      }
    ]);

    // Status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totals.total' }
        }
      }
    ]);

    // Time series data
    let groupBy;
    switch (period) {
      case 'hourly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const timeSeries = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          orders: { $sum: 1 },
          revenue: { $sum: '$totals.total' },
          averageOrderValue: { $avg: '$totals.total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 }
        }
      },
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
          productSlug: '$product.slug',
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          averageOrderValue: totalRevenue[0] ? totalRevenue[0].total / totalOrders : 0,
          period: { start, end }
        },
        statusBreakdown,
        timeSeries,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order analytics',
      error: error.message
    });
  }
};

// Export orders to CSV (Admin)
const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const filter = {};
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name sku')
      .lean();

    // Convert to CSV format
    const csvHeaders = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Status',
      'Items',
      'Subtotal',
      'Tax',
      'Shipping',
      'Total',
      'Payment Method',
      'Payment Status'
    ];

    const csvRows = orders.map(order => [
      order.orderNumber,
      order.createdAt.toISOString().split('T')[0],
      `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      order.user?.email || '',
      order.status,
      order.items.map(item => `${item.name} (x${item.quantity})`).join('; '),
      order.totals.subtotal,
      order.totals.tax,
      order.totals.shipping,
      order.totals.total,
      order.paymentMethod,
      order.payment.status
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders-export.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting orders',
      error: error.message
    });
  }
};

// Bulk update order status (Admin)
const bulkUpdateOrders = async (req, res) => {
  try {
    const { orderIds, action, data } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs are required'
      });
    }

    const results = [];

    for (const orderId of orderIds) {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          results.push({
            orderId,
            success: false,
            message: 'Order not found'
          });
          continue;
        }

        switch (action) {
          case 'updateStatus':
            if (data.status) {
              order.status = data.status;
              order.timeline.push({
                status: data.status,
                timestamp: new Date(),
                description: data.notes || `Bulk status update to ${data.status}`,
                updatedBy: req.user.id
              });
              await order.save();
            }
            break;
          
          case 'addTracking':
            if (data.trackingNumber) {
              order.tracking.trackingNumber = data.trackingNumber;
              order.tracking.carrier = data.carrier || 'TBD';
              await order.save();
            }
            break;
          
          default:
            results.push({
              orderId,
              success: false,
              message: 'Invalid action'
            });
            continue;
        }

        results.push({
          orderId,
          success: true,
          message: 'Updated successfully'
        });
      } catch (error) {
        results.push({
          orderId,
          success: false,
          message: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Bulk update completed. ${successCount} successful, ${failureCount} failed.`,
      data: {
        results,
        summary: {
          total: orderIds.length,
          successful: successCount,
          failed: failureCount
        }
      }
    });
  } catch (error) {
    console.error('Error in bulk update orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk update',
      error: error.message
    });
  }
};

// Bulk update orders
const bulkOrderUpdate = async (req, res) => {
  try {
    const { orderIds, updates } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const orderId of orderIds) {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          results.failed.push({
            orderId,
            error: 'Order not found'
          });
          continue;
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
          if (key === 'status') {
            // Add to timeline for status changes
            if (order.status !== updates[key]) {
              order.timeline.push({
                status: updates[key],
                timestamp: new Date(),
                note: `Bulk update: Status changed from ${order.status} to ${updates[key]}`
              });
            }
          }
          order[key] = updates[key];
        });

        await order.save();
        results.successful.push(orderId);
      } catch (error) {
        results.failed.push({
          orderId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Bulk update completed',
      data: {
        total: orderIds.length,
        successful: results.successful.length,
        failed: results.failed.length,
        results
      }
    });
  } catch (error) {
    console.error('Error in bulk order update:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk order update',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  processRefund,
  getOrderTimeline,
  processReturnRequest,
  getOrderAnalytics,
  exportOrders,
  bulkUpdateOrders,
  bulkOrderUpdate
};
