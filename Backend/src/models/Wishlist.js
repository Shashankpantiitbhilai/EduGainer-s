const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    notes: {
      type: String,
      maxlength: 500
    },
    priceWhenAdded: {
      type: Number,
      min: 0
    },
    notifyOnPriceDrop: {
      type: Boolean,
      default: false
    },
    priceDropThreshold: {
      type: Number,
      min: 0
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'My Wishlist',
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  sharedWith: [{
    email: String,
    sharedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  totalEstimatedValue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });
wishlistSchema.index({ isPublic: 1 });
wishlistSchema.index({ shareToken: 1 });
wishlistSchema.index({ 'items.addedAt': -1 });

// Virtual for items count
wishlistSchema.virtual('itemsCount').get(function() {
  return this.items.length;
});

// Virtual for high priority items count
wishlistSchema.virtual('highPriorityCount').get(function() {
  return this.items.filter(item => item.priority === 'high').length;
});

// Methods
wishlistSchema.methods.addItem = function(productId, priority = 'medium', notes = '', notifyOnPriceDrop = false, priceDropThreshold = null) {
  // Check if item already exists
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (existingItem) {
    throw new Error('Product already exists in wishlist');
  }

  const newItem = {
    product: productId,
    priority: priority,
    notes: notes,
    notifyOnPriceDrop: notifyOnPriceDrop,
    priceDropThreshold: priceDropThreshold
  };

  this.items.push(newItem);
  return newItem;
};

wishlistSchema.methods.removeItem = function(productId) {
  const itemIndex = this.items.findIndex(item => item.product.toString() === productId.toString());
  
  if (itemIndex === -1) {
    throw new Error('Product not found in wishlist');
  }

  return this.items.splice(itemIndex, 1)[0];
};

wishlistSchema.methods.updateItem = function(productId, updates) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (!item) {
    throw new Error('Product not found in wishlist');
  }

  // Update allowed fields
  const allowedUpdates = ['priority', 'notes', 'notifyOnPriceDrop', 'priceDropThreshold'];
  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      item[field] = updates[field];
    }
  });

  return item;
};

wishlistSchema.methods.moveToCart = async function(productId, quantity = 1) {
  const Cart = mongoose.model('Cart');
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (!item) {
    throw new Error('Product not found in wishlist');
  }

  // Add to cart
  let cart = await Cart.findOne({ user: this.user });
  if (!cart) {
    cart = new Cart({ user: this.user, items: [] });
  }

  cart.addItem(productId, quantity);
  await cart.save();

  // Remove from wishlist
  this.removeItem(productId);
  
  return { cart, removedItem: item };
};

wishlistSchema.methods.generateShareToken = function() {
  if (!this.shareToken) {
    this.shareToken = require('crypto').randomBytes(32).toString('hex');
  }
  return this.shareToken;
};

wishlistSchema.methods.shareWith = function(email, permissions = 'view') {
  // Check if already shared with this email
  const existingShare = this.sharedWith.find(share => share.email === email);
  
  if (existingShare) {
    existingShare.permissions = permissions;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      email: email,
      permissions: permissions
    });
  }

  // Generate share token if not exists
  this.generateShareToken();
  
  return this.shareToken;
};

wishlistSchema.methods.revokeShare = function(email) {
  const shareIndex = this.sharedWith.findIndex(share => share.email === email);
  
  if (shareIndex !== -1) {
    return this.sharedWith.splice(shareIndex, 1)[0];
  }
  
  throw new Error('Share not found for this email');
};

wishlistSchema.methods.updateEstimatedValue = async function() {
  const Product = mongoose.model('Product');
  let totalValue = 0;

  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product && product.isActive) {
      totalValue += product.price.current;
    }
  }

  this.totalEstimatedValue = totalValue;
  return totalValue;
};

wishlistSchema.methods.getItemsByCategory = function(categoryId) {
  return this.items.filter(item => {
    // This would require populated product data
    return item.product.category && item.product.category.toString() === categoryId.toString();
  });
};

wishlistSchema.methods.getItemsByPriority = function(priority) {
  return this.items.filter(item => item.priority === priority);
};

wishlistSchema.methods.sortItems = function(sortBy = 'addedAt', order = 'desc') {
  this.items.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'addedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (order === 'desc') {
      return bValue > aValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });

  return this.items;
};

wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  this.totalEstimatedValue = 0;
  return this;
};

wishlistSchema.methods.getRecentItems = function(limit = 5) {
  return this.items
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, limit);
};

// Static methods
wishlistSchema.statics.findByShareToken = async function(shareToken) {
  return await this.findOne({ shareToken: shareToken })
    .populate('user', 'firstName lastName email')
    .populate({
      path: 'items.product',
      select: 'name price images category isActive',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
};

wishlistSchema.statics.getMostWishedProducts = async function(limit = 10) {
  const result = await this.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        wishlistCount: { $sum: 1 },
        averagePriority: { $avg: { $switch: {
          branches: [
            { case: { $eq: ['$items.priority', 'low'] }, then: 1 },
            { case: { $eq: ['$items.priority', 'medium'] }, then: 2 },
            { case: { $eq: ['$items.priority', 'high'] }, then: 3 }
          ]
        }}}
      }
    },
    { $sort: { wishlistCount: -1 } },
    { $limit: limit },
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
        product: 1,
        wishlistCount: 1,
        averagePriority: 1
      }
    }
  ]);

  return result;
};

wishlistSchema.statics.getWishlistStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalWishlists: { $sum: 1 },
        totalItems: { $sum: { $size: '$items' } },
        averageItemsPerWishlist: { $avg: { $size: '$items' } },
        publicWishlists: {
          $sum: {
            $cond: [{ $eq: ['$isPublic', true] }, 1, 0]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalWishlists: 0,
    totalItems: 0,
    averageItemsPerWishlist: 0,
    publicWishlists: 0
  };
};

// Pre-save middleware to update estimated value
wishlistSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    await this.updateEstimatedValue();
  }
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
