const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'pro', 'enterprise']
  },
  planDetails: {
    name: String,
    description: String,
    features: [String],
    price: {
      monthly: Number,
      quarterly: Number,
      yearly: Number
    }
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'suspended', 'trial'],
    default: 'inactive'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  trialPeriod: {
    isTrialActive: {
      type: Boolean,
      default: false
    },
    trialStartDate: Date,
    trialEndDate: Date,
    trialDays: {
      type: Number,
      default: 0
    }
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  renewalAttempts: {
    type: Number,
    default: 0
  },
  maxRenewalAttempts: {
    type: Number,
    default: 3
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  usage: {
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    usage: {
      apiCalls: {
        type: Number,
        default: 0
      },
      storageUsed: {
        type: Number,
        default: 0
      },
      featuresUsed: [String]
    },
    limits: {
      apiCalls: Number,
      storageLimit: Number,
      maxUsers: Number
    }
  },
  discounts: [{
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: Number,
    appliedAmount: Number,
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student'
    },
    reason: {
      type: String,
      enum: ['user_request', 'payment_failure', 'policy_violation', 'system_error', 'other']
    },
    description: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    accessUntil: Date // When access will be revoked
  },
  upgrades: [{
    fromPlan: String,
    toPlan: String,
    upgradedAt: {
      type: Date,
      default: Date.now
    },
    proratedAmount: Number,
    effectiveDate: Date
  }],
  suspension: {
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspendedAt: Date,
    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reason: String,
    autoReactivateAt: Date
  },
  notifications: {
    renewalReminder: {
      type: Boolean,
      default: true
    },
    paymentFailure: {
      type: Boolean,
      default: true
    },
    usageAlerts: {
      type: Boolean,
      default: true
    },
    lastReminderSent: Date
  },
  metadata: {
    source: String, // How subscription was created
    campaignId: String,
    referralCode: String,
    customFields: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ 'trialPeriod.trialEndDate': 1 });
subscriptionSchema.index({ autoRenew: 1, status: 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for is active
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && new Date() <= this.endDate;
});

// Virtual for trial days remaining
subscriptionSchema.virtual('trialDaysRemaining').get(function() {
  if (!this.trialPeriod.isTrialActive) return 0;
  const today = new Date();
  const trialEnd = new Date(this.trialPeriod.trialEndDate);
  const timeDiff = trialEnd.getTime() - today.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
});

// Methods
subscriptionSchema.methods.activate = function() {
  this.status = 'active';
  this.startDate = new Date();
  this.calculateEndDate();
  this.calculateNextBillingDate();
  return this;
};

subscriptionSchema.methods.deactivate = function() {
  this.status = 'inactive';
  return this;
};

subscriptionSchema.methods.cancel = function(reason = 'user_request', description = '', refundAmount = 0) {
  this.status = 'cancelled';
  this.cancellation = {
    isCancelled: true,
    cancelledAt: new Date(),
    cancelledBy: this.user,
    reason: reason,
    description: description,
    refundAmount: refundAmount,
    accessUntil: this.endDate // Allow access until period ends
  };
  this.autoRenew = false;
  return this;
};

subscriptionSchema.methods.suspend = function(reason, suspendedBy = null, autoReactivateAt = null) {
  this.status = 'suspended';
  this.suspension = {
    isSuspended: true,
    suspendedAt: new Date(),
    suspendedBy: suspendedBy,
    reason: reason,
    autoReactivateAt: autoReactivateAt
  };
  return this;
};

subscriptionSchema.methods.reactivate = function() {
  if (this.suspension.isSuspended) {
    this.suspension.isSuspended = false;
    this.status = 'active';
  }
  return this;
};

subscriptionSchema.methods.calculateEndDate = function() {
  const start = new Date(this.startDate);
  
  switch (this.billingCycle) {
    case 'monthly':
      this.endDate = new Date(start.setMonth(start.getMonth() + 1));
      break;
    case 'quarterly':
      this.endDate = new Date(start.setMonth(start.getMonth() + 3));
      break;
    case 'yearly':
      this.endDate = new Date(start.setFullYear(start.getFullYear() + 1));
      break;
  }
  
  return this.endDate;
};

subscriptionSchema.methods.calculateNextBillingDate = function() {
  if (!this.autoRenew) {
    this.nextBillingDate = null;
    return null;
  }

  const end = new Date(this.endDate);
  
  switch (this.billingCycle) {
    case 'monthly':
      this.nextBillingDate = new Date(end.setMonth(end.getMonth() + 1));
      break;
    case 'quarterly':
      this.nextBillingDate = new Date(end.setMonth(end.getMonth() + 3));
      break;
    case 'yearly':
      this.nextBillingDate = new Date(end.setFullYear(end.getFullYear() + 1));
      break;
  }
  
  return this.nextBillingDate;
};

subscriptionSchema.methods.renew = function() {
  if (!this.autoRenew) {
    throw new Error('Auto-renewal is disabled for this subscription');
  }

  this.startDate = this.endDate;
  this.calculateEndDate();
  this.calculateNextBillingDate();
  this.renewalAttempts = 0;
  
  // Reset usage for new period
  this.usage.currentPeriodStart = this.startDate;
  this.usage.currentPeriodEnd = this.endDate;
  this.usage.usage.apiCalls = 0;
  this.usage.usage.storageUsed = 0;
  this.usage.usage.featuresUsed = [];
  
  return this;
};

subscriptionSchema.methods.upgrade = function(newPlan, newAmount, proratedAmount = 0) {
  const oldPlan = this.plan;
  
  this.upgrades.push({
    fromPlan: oldPlan,
    toPlan: newPlan,
    proratedAmount: proratedAmount,
    effectiveDate: new Date()
  });
  
  this.plan = newPlan;
  this.amount = newAmount;
  
  return this;
};

subscriptionSchema.methods.addUsage = function(type, amount) {
  if (!this.usage.usage[type]) {
    this.usage.usage[type] = 0;
  }
  this.usage.usage[type] += amount;
  
  // Check limits and send alerts if needed
  this.checkUsageLimits();
  
  return this;
};

subscriptionSchema.methods.checkUsageLimits = function() {
  const usage = this.usage.usage;
  const limits = this.usage.limits;
  
  // Check if any usage is approaching or exceeding limits
  const alerts = [];
  
  if (limits.apiCalls && usage.apiCalls >= limits.apiCalls * 0.8) {
    alerts.push('API calls approaching limit');
  }
  
  if (limits.storageLimit && usage.storageUsed >= limits.storageLimit * 0.8) {
    alerts.push('Storage approaching limit');
  }
  
  return alerts;
};

subscriptionSchema.methods.startTrial = function(trialDays = 7) {
  this.trialPeriod = {
    isTrialActive: true,
    trialStartDate: new Date(),
    trialEndDate: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
    trialDays: trialDays
  };
  this.status = 'trial';
  return this;
};

subscriptionSchema.methods.endTrial = function() {
  this.trialPeriod.isTrialActive = false;
  if (this.status === 'trial') {
    this.status = 'inactive';
  }
  return this;
};

// Static methods
subscriptionSchema.statics.getActiveSubscriptions = async function() {
  return await this.find({
    status: 'active',
    endDate: { $gt: new Date() }
  }).populate('user', 'email firstName lastName');
};

subscriptionSchema.statics.getExpiringSubscriptions = async function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return await this.find({
    status: 'active',
    autoRenew: false,
    endDate: { $lte: futureDate, $gt: new Date() }
  }).populate('user', 'email firstName lastName');
};

subscriptionSchema.statics.getTrialExpiringSubscriptions = async function(days = 3) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return await this.find({
    status: 'trial',
    'trialPeriod.isTrialActive': true,
    'trialPeriod.trialEndDate': { $lte: futureDate, $gt: new Date() }
  }).populate('user', 'email firstName lastName');
};

subscriptionSchema.statics.getSubscriptionStats = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$plan',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$amount' },
        activeCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
