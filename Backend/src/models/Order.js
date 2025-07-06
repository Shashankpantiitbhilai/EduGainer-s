const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true // Price at the time of order
    },
    total: {
      type: Number,
      required: true
    },
    // Digital content delivery info
    digitalContent: {
      downloadUrl: String,
      downloadCount: {
        type: Number,
        default: 0
      },
      downloadExpiry: Date
    }
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Shipping Information
  shippingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String
  },
  
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'],
    default: 'unfulfilled'
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod']
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date
  },
  
  // Shipping Information
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  
  // Discounts Applied
  discounts: [{
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: Number,
    amount: Number
  }],
  
  // Notes
  customerNotes: String,
  internalNotes: String,
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ 'payment.razorpayOrderId': 1 });
orderSchema.index({ 'payment.transactionId': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `EDU${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Methods
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Apply discounts
  const discountAmount = this.discounts.reduce((total, discount) => {
    return total + discount.amount;
  }, 0);
  
  this.discount = discountAmount;
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  // Update item totals
  this.items.forEach(item => {
    item.total = item.price * item.quantity;
  });
};

orderSchema.methods.updateStatus = function(status, notes = '') {
  this.status = status;
  if (notes) {
    this.internalNotes = (this.internalNotes || '') + `\n${new Date().toISOString()}: ${notes}`;
  }
  return this.save();
};

orderSchema.methods.markAsPaid = function(paymentDetails) {
  this.paymentStatus = 'paid';
  this.payment = { ...this.payment, ...paymentDetails, paidAt: new Date() };
  if (this.status === 'pending') {
    this.status = 'confirmed';
  }
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
