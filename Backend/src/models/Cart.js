const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    index: true // For guest users
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true // For logged-in users
  },
  
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      type: String // Selected variant option
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true // Price at the time of adding to cart
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Cart totals (calculated fields)
  subtotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  
  // Auto-delete after certain period for guest carts
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index for auto-deletion
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indexes
cartSchema.index({ user: 1, updatedAt: -1 });
cartSchema.index({ sessionId: 1, updatedAt: -1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.itemCount = this.items.length;
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.total = this.subtotal; // Can add tax, shipping later
  next();
});

// Methods
cartSchema.methods.addItem = function(productId, quantity = 1, price, variant = null) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() && 
    item.variant === variant
  );
  
  if (existingItemIndex >= 0) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      variant,
      quantity,
      price
    });
  }
  
  return this.save();
};

cartSchema.methods.updateItem = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      this.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
    return this.save();
  }
  throw new Error('Item not found in cart');
};

cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
