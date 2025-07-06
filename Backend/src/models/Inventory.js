const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  reorderLevel: {
    type: Number,
    default: 5,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    default: 50,
    min: 1
  },
  maxStockLevel: {
    type: Number,
    default: 1000,
    min: 1
  },
  lastRestocked: {
    type: Date
  },
  costPrice: {
    type: Number,
    min: 0
  },
  supplier: {
    name: String,
    contactEmail: String,
    contactPhone: String,
    address: String
  },
  warehouse: {
    location: String,
    section: String,
    shelf: String
  },
  stockMovements: [{
    type: {
      type: String,
      enum: ['inbound', 'outbound', 'adjustment', 'reserved', 'released'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      enum: ['purchase', 'sale', 'return', 'damage', 'expired', 'theft', 'correction', 'reservation', 'release'],
      required: true
    },
    reference: {
      type: String, // Order ID, Purchase ID, etc.
    },
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    runningBalance: {
      type: Number,
      required: true
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['low_stock', 'out_of_stock', 'overstock', 'expired'],
      required: true
    },
    message: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    acknowledgedAt: Date
  }],
  expiryDate: Date, // For products that can expire
  batchNumber: String,
  isActive: {
    type: Boolean,
    default: true
  },
  autoReorder: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
inventorySchema.index({ product: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ lowStockThreshold: 1 });
inventorySchema.index({ 'alerts.isActive': 1 });
inventorySchema.index({ lastRestocked: 1 });

// Virtual for available stock (current - reserved)
inventorySchema.virtual('availableStock').get(function() {
  return Math.max(0, this.currentStock - this.reservedStock);
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock === 0) return 'out_of_stock';
  if (this.currentStock <= this.reorderLevel) return 'critical';
  if (this.currentStock <= this.lowStockThreshold) return 'low';
  if (this.currentStock >= this.maxStockLevel) return 'overstock';
  return 'normal';
});

// Methods
inventorySchema.methods.addStock = function(quantity, reason = 'purchase', reference = '', performedBy = null, notes = '') {
  this.currentStock += quantity;
  this.lastRestocked = new Date();
  
  this.stockMovements.push({
    type: 'inbound',
    quantity: quantity,
    reason: reason,
    reference: reference,
    notes: notes,
    performedBy: performedBy,
    runningBalance: this.currentStock
  });

  this.checkAndCreateAlerts();
  return this;
};

inventorySchema.methods.removeStock = function(quantity, reason = 'sale', reference = '', performedBy = null, notes = '') {
  if (quantity > this.availableStock) {
    throw new Error('Insufficient stock available');
  }

  this.currentStock -= quantity;
  
  this.stockMovements.push({
    type: 'outbound',
    quantity: quantity,
    reason: reason,
    reference: reference,
    notes: notes,
    performedBy: performedBy,
    runningBalance: this.currentStock
  });

  this.checkAndCreateAlerts();
  return this;
};

inventorySchema.methods.reserveStock = function(quantity, reference = '', performedBy = null) {
  if (quantity > this.availableStock) {
    throw new Error('Insufficient stock available for reservation');
  }

  this.reservedStock += quantity;
  
  this.stockMovements.push({
    type: 'reserved',
    quantity: quantity,
    reason: 'reservation',
    reference: reference,
    performedBy: performedBy,
    runningBalance: this.currentStock
  });

  return this;
};

inventorySchema.methods.releaseReservedStock = function(quantity, reference = '', performedBy = null) {
  if (quantity > this.reservedStock) {
    throw new Error('Cannot release more stock than reserved');
  }

  this.reservedStock -= quantity;
  
  this.stockMovements.push({
    type: 'released',
    quantity: quantity,
    reason: 'release',
    reference: reference,
    performedBy: performedBy,
    runningBalance: this.currentStock
  });

  return this;
};

inventorySchema.methods.adjustStock = function(newQuantity, reason = 'correction', performedBy = null, notes = '') {
  const difference = newQuantity - this.currentStock;
  this.currentStock = newQuantity;
  
  this.stockMovements.push({
    type: 'adjustment',
    quantity: difference,
    reason: reason,
    notes: notes,
    performedBy: performedBy,
    runningBalance: this.currentStock
  });

  this.checkAndCreateAlerts();
  return this;
};

inventorySchema.methods.checkAndCreateAlerts = function() {
  // Remove old alerts of the same type
  this.alerts = this.alerts.filter(alert => alert.isActive === false);

  if (this.currentStock === 0) {
    this.alerts.push({
      type: 'out_of_stock',
      message: 'Product is out of stock'
    });
  } else if (this.currentStock <= this.reorderLevel) {
    this.alerts.push({
      type: 'low_stock',
      message: `Stock level is critical. Current: ${this.currentStock}, Reorder level: ${this.reorderLevel}`
    });
  } else if (this.currentStock >= this.maxStockLevel) {
    this.alerts.push({
      type: 'overstock',
      message: `Stock level exceeds maximum. Current: ${this.currentStock}, Max: ${this.maxStockLevel}`
    });
  }

  // Check expiry
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.alerts.push({
      type: 'expired',
      message: `Product has expired on ${this.expiryDate.toDateString()}`
    });
  }
};

inventorySchema.methods.acknowledgeAlert = function(alertId, acknowledgedBy) {
  const alert = this.alerts.id(alertId);
  if (alert) {
    alert.isActive = false;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
  }
  return this;
};

// Static methods
inventorySchema.statics.getLowStockProducts = async function() {
  return await this.find({
    $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
    isActive: true
  }).populate('product', 'name sku');
};

inventorySchema.statics.getOutOfStockProducts = async function() {
  return await this.find({
    currentStock: 0,
    isActive: true
  }).populate('product', 'name sku');
};

inventorySchema.statics.getActiveAlerts = async function() {
  return await this.find({
    'alerts.isActive': true,
    isActive: true
  }).populate('product', 'name sku');
};

module.exports = mongoose.model('Inventory', inventorySchema);
