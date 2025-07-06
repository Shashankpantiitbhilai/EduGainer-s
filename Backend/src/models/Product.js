const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  productType: {
    type: String,
    enum: ['digital', 'physical', 'subscription'],
    required: true
  },

  // Pricing
  price: {
    original: {
      type: Number,
      required: true,
      min: 0
    },
    selling: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed']
      },
      value: {
        type: Number,
        min: 0
      }
    }
  },

  // Digital Product Specific
  digitalContent: {
    fileUrl: String,
    fileSize: Number, // in bytes
    fileType: String,
    downloadLimit: {
      type: Number,
      default: -1 // -1 for unlimited
    },
    accessDuration: {
      type: Number,
      default: -1 // in days, -1 for lifetime
    },
    isStreamable: {
      type: Boolean,
      default: false
    }
  },

  // Physical Product Specific
  physical: {
    weight: Number, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String
  },

  // Subscription Specific
  subscription: {
    duration: Number, // in days
    recurringType: {
      type: String,
      enum: ['monthly', 'yearly', 'weekly']
    },
    trialPeriod: Number, // in days
    features: [String]
  },

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number // in seconds
  }],

  // Variants
  variants: [{
    name: String, // e.g., "Size", "Color"
    options: [String], // e.g., ["S", "M", "L"]
    price: Number, // additional price
    sku: String,
    inventory: Number
  }],

  // Inventory
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    }
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  // Status and Visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'password_protected'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  },

  // Relationships
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  tags: [String],

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'price.selling': 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ tags: 1, status: 1 });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });

// Text search index
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Virtual for calculating discount amount
productSchema.virtual('discountAmount').get(function() {
  if (this.price.discount && this.price.discount.type && this.price.discount.value) {
    if (this.price.discount.type === 'percentage') {
      return (this.price.original * this.price.discount.value) / 100;
    } else {
      return this.price.discount.value;
    }
  }
  return 0;
});

// Virtual for calculating final price
productSchema.virtual('finalPrice').get(function() {
  return this.price.selling;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
