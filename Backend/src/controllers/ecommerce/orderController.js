const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const Payment = require('../../models/Payment');
const Inventory = require('../../models/Inventory');
const { createOrder: createRazorpayOrder, verifyPaymentSignature } = require('../../services/payment/razorpayService');
const { validationResult } = require('express-validator');

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod = 'razorpay',
      notes,
      giftMessage,
      giftWrap = false
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product')
      .populate('appliedCoupons.coupon');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate inventory for all items
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.name}" is no longer available`
        });
      }

      const inventory = await Inventory.findOne({ product: item.product._id });
      if (inventory && item.quantity > inventory.availableStock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.name}". Available: ${inventory.availableStock}`,
          productId: item.product._id,
          availableStock: inventory.availableStock
        });
      }
    }

    // Create order
    const orderData = {
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        digitalContent: item.product.digitalContent
      })),
      totals: cart.totals,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      appliedCoupons: cart.appliedCoupons,
      paymentMethod,
      notes,
      gift: giftWrap ? { isGift: true, message: giftMessage } : undefined
    };

    const order = new Order(orderData);
    await order.save();

    // Reserve inventory
    for (const item of cart.items) {
      const inventory = await Inventory.findOne({ product: item.product._id });
      if (inventory) {
        inventory.reserveStock(item.quantity, order.orderNumber, userId);
        await inventory.save();
      }
    }

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder(order.totals.total);
    } catch (paymentError) {
      // Rollback inventory reservation
      for (const item of cart.items) {
        const inventory = await Inventory.findOne({ product: item.product._id });
        if (inventory) {
          inventory.releaseReservedStock(item.quantity, order.orderNumber, userId);
          await inventory.save();
        }
      }
      
      await Order.findByIdAndDelete(order._id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: paymentError
      });
    }

    // Create payment record
    const payment = new Payment({
      order: order._id,
      user: userId,
      amount: order.totals.total,
      paymentMethod: paymentMethod,
      gatewayOrderId: razorpayOrder.id,
      billingAddress
    });
    await payment.save();

    // Update order with payment info
    order.payment.gatewayOrderId = razorpayOrder.id;
    order.payment.paymentId = payment._id;
    await order.save();

    // Clear cart
    cart.clearCart();
    await cart.save();

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name slug images')
      .populate('appliedCoupons.coupon', 'code type value');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: populatedOrder,
        razorpayOrder,
        payment: {
          id: payment._id,
          gatewayOrderId: razorpayOrder.id,
          amount: payment.amount,
          currency: payment.currency
        }
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Verify payment and confirm order
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Verify signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find order and payment
    const order = await Order.findById(orderId);
    const payment = await Payment.findById(order.payment.paymentId);

    if (!order || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Order or payment not found'
      });
    }

    // Update payment status
    payment.markCompleted(razorpay_payment_id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
    await payment.save();

    // Update order status
    order.status = 'confirmed';
    order.payment.status = 'completed';
    order.payment.paymentDate = new Date();
    order.payment.transactionId = razorpay_payment_id;
    
    // Add to order timeline
    order.timeline.push({
      status: 'confirmed',
      timestamp: new Date(),
      description: 'Payment verified and order confirmed'
    });

    await order.save();

    // Update inventory - convert reserved to sold
    for (const item of order.items) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        inventory.releaseReservedStock(item.quantity, order.orderNumber);
        inventory.removeStock(item.quantity, 'sale', order.orderNumber);
        await inventory.save();
      }

      // Update product analytics
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          'analytics.purchases': item.quantity,
          stockQuantity: -item.quantity
        }
      });
    }

    // Send order confirmation email/SMS
    // You can implement email service here

    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.totals.total
        },
        payment: {
          id: payment._id,
          status: payment.status,
          transactionId: payment.gatewayPaymentId
        }
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
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
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: id, 
      user: userId 
    })
      .populate('items.product', 'name slug images digitalContent')
      .populate('appliedCoupons.coupon', 'code type value')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get payment details
    const payment = await Payment.findById(order.payment.paymentId)
      .select('status gatewayPaymentId paymentDate paymentMethod')
      .lean();

    res.json({
      success: true,
      data: {
        order,
        payment
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

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason, description } = req.body;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status',
        currentStatus: order.status
      });
    }

    // Cancel the order
    order.cancel(reason, description);
    await order.save();

    // Release reserved inventory
    for (const item of order.items) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        inventory.releaseReservedStock(item.quantity, order.orderNumber);
        await inventory.save();
      }
    }

    // Process refund if payment was completed
    if (order.payment.status === 'completed') {
      const payment = await Payment.findById(order.payment.paymentId);
      if (payment && payment.status === 'completed') {
        // Initiate refund process
        payment.initiateRefund(
          payment.amount, 
          'order_cancellation', 
          'Order cancelled by customer'
        );
        await payment.save();
        
        // Note: Actual refund processing would be handled by a background job
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        cancellationReason: order.cancellation.reason
      }
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Request return/refund
const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason, description, items } = req.body;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.canBeReturned()) {
      return res.status(400).json({
        success: false,
        message: 'Order is not eligible for return',
        currentStatus: order.status
      });
    }

    // Create return request
    const returnRequest = order.createReturnRequest(reason, description, items);
    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully',
      data: {
        orderId: order._id,
        returnRequestId: returnRequest._id,
        status: returnRequest.status,
        estimatedRefund: returnRequest.refundAmount
      }
    });
  } catch (error) {
    console.error('Error requesting return:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting return',
      error: error.message
    });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: id, 
      user: userId 
    })
      .select('orderNumber status timeline shipping estimatedDelivery tracking')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        timeline: order.timeline,
        shipping: order.shipping,
        estimatedDelivery: order.estimatedDelivery,
        tracking: order.tracking
      }
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
};

// Download digital content
const downloadDigitalContent = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: id, 
      user: userId,
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not confirmed'
      });
    }

    const orderItem = order.items.find(item => 
      item.product.toString() === productId && 
      item.digitalContent
    );

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Digital content not found in this order'
      });
    }

    const product = await Product.findById(productId);
    if (!product || !product.digitalContent) {
      return res.status(404).json({
        success: false,
        message: 'Digital content not available'
      });
    }

    // Check download limits
    if (product.digitalContent.downloadLimit && 
        orderItem.downloadCount >= product.digitalContent.downloadLimit) {
      return res.status(403).json({
        success: false,
        message: 'Download limit exceeded'
      });
    }

    // Check access expiry
    if (product.digitalContent.accessDuration) {
      const accessExpiry = new Date(order.createdAt);
      accessExpiry.setDate(accessExpiry.getDate() + product.digitalContent.accessDuration);
      
      if (new Date() > accessExpiry) {
        return res.status(403).json({
          success: false,
          message: 'Access to digital content has expired'
        });
      }
    }

    // Generate secure download link or serve file
    // This would typically involve generating a temporary signed URL
    
    // Update download count
    orderItem.downloadCount = (orderItem.downloadCount || 0) + 1;
    orderItem.lastDownloaded = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Download link generated',
      data: {
        downloadUrl: product.digitalContent.downloadUrl,
        fileName: product.digitalContent.fileName,
        fileSize: product.digitalContent.fileSize,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        remainingDownloads: product.digitalContent.downloadLimit ? 
          (product.digitalContent.downloadLimit - orderItem.downloadCount) : 'unlimited'
      }
    });
  } catch (error) {
    console.error('Error downloading digital content:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading digital content',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  trackOrder,
  downloadDigitalContent
};
