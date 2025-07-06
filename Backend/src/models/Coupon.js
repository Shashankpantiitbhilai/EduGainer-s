const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed', 'buy_one_get_one', 'free_shipping']
  },
  value: {
    type: Number,
    required: function() {
      return this.type === 'percentage' || this.type === 'fixed';
    },
    min: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  maximumDiscountAmount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usagePerUser: {
    type: Number,
    default: 1
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  userType: {
    type: String,
    enum: ['all', 'student', 'educator', 'institution'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
      required: true
    },
    usageCount: {
      type: Number,
      default: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ applicableCategories: 1 });
couponSchema.index({ applicableProducts: 1 });

// Methods
couponSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.usageLimit === null || this.usageCount < this.usageLimit);
};

couponSchema.methods.canUserUse = function(userId) {
  const userUsage = this.usedBy.find(usage => usage.user.toString() === userId.toString());
  const userUsageCount = userUsage ? userUsage.usageCount : 0;
  return userUsageCount < this.usagePerUser;
};

couponSchema.methods.calculateDiscount = function(orderValue, items = []) {
  if (!this.isValid()) return 0;

  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderValue * this.value) / 100;
      if (this.maximumDiscountAmount) {
        discount = Math.min(discount, this.maximumDiscountAmount);
      }
      break;
    case 'fixed':
      discount = Math.min(this.value, orderValue);
      break;
    case 'free_shipping':
      // This should be handled separately in shipping calculation
      discount = 0;
      break;
    case 'buy_one_get_one':
      // BOGO logic would need specific implementation based on products
      discount = 0;
      break;
  }

  return discount;
};

module.exports = mongoose.model('Coupon', couponSchema);
