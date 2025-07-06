const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'emi', 'cash_on_delivery']
  },
  paymentGateway: {
    type: String,
    required: true,
    enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'manual'],
    default: 'razorpay'
  },
  gatewayOrderId: {
    type: String,
    required: true
  },
  gatewayPaymentId: {
    type: String
  },
  gatewaySignature: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Store complete gateway response
  },
  attemptCount: {
    type: Number,
    default: 1
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    bankName: String,
    upiId: String,
    walletName: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      enum: ['customer_request', 'order_cancellation', 'product_return', 'duplicate_payment', 'fraud', 'other'],
      required: true
    },
    description: String,
    gatewayRefundId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    initiatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    gatewayResponse: mongoose.Schema.Types.Mixed
  }],
  fees: {
    gatewayFee: {
      type: Number,
      default: 0
    },
    processingFee: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    }
  },
  netAmount: {
    type: Number // Amount after deducting fees
  },
  paymentDate: Date,
  dueDate: Date, // For EMI or pay later options
  emi: {
    isEmi: {
      type: Boolean,
      default: false
    },
    tenure: Number, // in months
    interestRate: Number,
    monthlyAmount: Number,
    totalAmount: Number,
    installments: [{
      installmentNumber: Number,
      amount: Number,
      dueDate: Date,
      paidDate: Date,
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      },
      gatewayPaymentId: String
    }]
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextPaymentDate: Date,
    autoRenew: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  },
  notes: String,
  isTestPayment: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ gatewayOrderId: 1 });
paymentSchema.index({ gatewayPaymentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ paymentDate: -1 });

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual for refundable amount
paymentSchema.virtual('refundableAmount').get(function() {
  return this.amount - this.totalRefunded;
});

// Methods
paymentSchema.methods.markCompleted = function(gatewayPaymentId, gatewayResponse = {}) {
  this.status = 'completed';
  this.gatewayPaymentId = gatewayPaymentId;
  this.paymentDate = new Date();
  this.gatewayResponse = gatewayResponse;
  
  // Extract payment details from gateway response
  if (gatewayResponse.method) {
    this.paymentMethod = this.mapGatewayMethod(gatewayResponse.method);
  }
  
  if (gatewayResponse.card) {
    this.paymentDetails.cardLast4 = gatewayResponse.card.last4;
    this.paymentDetails.cardBrand = gatewayResponse.card.network;
  }
  
  return this;
};

paymentSchema.methods.markFailed = function(reason = '', gatewayResponse = {}) {
  this.status = 'failed';
  this.gatewayResponse = gatewayResponse;
  if (reason) {
    this.notes = reason;
  }
  return this;
};

paymentSchema.methods.initiateRefund = function(amount, reason, description = '', processedBy = null) {
  if (amount > this.refundableAmount) {
    throw new Error('Refund amount cannot exceed refundable amount');
  }

  const refund = {
    amount: amount,
    reason: reason,
    description: description,
    processedBy: processedBy
  };

  this.refunds.push(refund);
  
  // Update payment status
  if (amount === this.refundableAmount) {
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }

  return refund;
};

paymentSchema.methods.completeRefund = function(refundId, gatewayRefundId, gatewayResponse = {}) {
  const refund = this.refunds.id(refundId);
  if (refund) {
    refund.status = 'completed';
    refund.gatewayRefundId = gatewayRefundId;
    refund.completedAt = new Date();
    refund.gatewayResponse = gatewayResponse;
  }
  return refund;
};

paymentSchema.methods.mapGatewayMethod = function(gatewayMethod) {
  const methodMap = {
    'card': 'credit_card',
    'upi': 'upi',
    'netbanking': 'net_banking',
    'wallet': 'wallet',
    'emi': 'emi'
  };
  return methodMap[gatewayMethod] || gatewayMethod;
};

paymentSchema.methods.calculateEMI = function(principal, rate, tenure) {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

paymentSchema.methods.setupEMI = function(tenure, interestRate) {
  const monthlyAmount = this.calculateEMI(this.amount, interestRate, tenure);
  const totalAmount = monthlyAmount * tenure;

  this.emi = {
    isEmi: true,
    tenure: tenure,
    interestRate: interestRate,
    monthlyAmount: monthlyAmount,
    totalAmount: totalAmount,
    installments: []
  };

  // Create installment schedule
  let currentDate = new Date();
  for (let i = 1; i <= tenure; i++) {
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.emi.installments.push({
      installmentNumber: i,
      amount: monthlyAmount,
      dueDate: new Date(currentDate),
      status: 'pending'
    });
  }

  return this;
};

// Static methods
paymentSchema.statics.getPaymentStats = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        averageAmount: { $avg: '$amount' },
        methodBreakdown: {
          $push: '$paymentMethod'
        }
      }
    }
  ]);

  return stats[0] || {
    totalAmount: 0,
    totalPayments: 0,
    averageAmount: 0,
    methodBreakdown: []
  };
};

paymentSchema.statics.getFailedPayments = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.find({
    status: 'failed',
    createdAt: { $gte: startDate }
  }).populate('user', 'email firstName lastName')
    .populate('order', 'orderNumber');
};

module.exports = mongoose.model('Payment', paymentSchema);
