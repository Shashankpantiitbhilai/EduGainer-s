# EduGainer's E-Commerce Database Schema

## Database Schema Overview

This document outlines the complete database schema for the EduGainer's E-Commerce system using MongoDB with Mongoose ODM.

## Core Collections

### 1. Products Collection

```javascript
{
  _id: ObjectId,
  name: String, // Product name
  slug: String, // URL-friendly name
  description: String, // Detailed description
  shortDescription: String, // Brief description
  category: ObjectId, // Reference to Category
  subcategory: ObjectId, // Reference to Subcategory
  brand: String,
  sku: String, // Stock Keeping Unit
  productType: String, // enum: ['digital', 'physical', 'subscription']
  
  // Pricing
  price: {
    original: Number,
    selling: Number,
    currency: String, // default: 'INR'
    discount: {
      type: String, // enum: ['percentage', 'fixed']
      value: Number
    }
  },
  
  // Digital Product Specific
  digitalContent: {
    fileUrl: String,
    fileSize: Number,
    fileType: String,
    downloadLimit: Number, // -1 for unlimited
    accessDuration: Number, // in days, -1 for lifetime
    isStreamable: Boolean
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
    recurringType: String, // enum: ['monthly', 'yearly', 'weekly']
    trialPeriod: Number, // in days
    features: [String]
  },
  
  // Media
  images: [{
    url: String,
    altText: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number
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
    quantity: Number,
    lowStockThreshold: Number,
    trackQuantity: Boolean,
    allowBackorder: Boolean
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Status and Visibility
  status: String, // enum: ['active', 'inactive', 'draft']
  visibility: String, // enum: ['public', 'private', 'password_protected']
  featured: Boolean,
  
  // Relationships
  relatedProducts: [ObjectId],
  tags: [String],
  
  // Analytics
  views: Number,
  salesCount: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId, // Reference to Admin/User
  updatedBy: ObjectId
}
```

### 2. Categories Collection

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  parentCategory: ObjectId, // Reference to parent category
  image: String,
  icon: String,
  isActive: Boolean,
  sortOrder: Number,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Users Collection (Enhanced for E-commerce)

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  
  // User Type
  userType: String, // enum: ['student', 'teacher', 'institution', 'admin']
  
  // Addresses
  addresses: [{
    type: String, // enum: ['home', 'work', 'other']
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
    isDefault: Boolean
  }],
  
  // E-commerce specific
  wishlist: [ObjectId], // Reference to Products
  cart: [{
    product: ObjectId, // Reference to Product
    variant: String,
    quantity: Number,
    addedAt: Date
  }],
  
  // Preferences
  preferences: {
    currency: String,
    language: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    marketing: {
      emailMarketing: Boolean,
      smsMarketing: Boolean
    }
  },
  
  // Loyalty Program
  loyaltyPoints: Number,
  loyaltyTier: String, // enum: ['bronze', 'silver', 'gold', 'platinum']
  
  // Account Status
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  accountStatus: String, // enum: ['active', 'inactive', 'suspended']
  
  // Timestamps
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: String, // Unique order identifier
  user: ObjectId, // Reference to User
  
  // Order Items
  items: [{
    product: ObjectId, // Reference to Product
    variant: String,
    quantity: Number,
    price: Number, // Price at the time of order
    total: Number,
    digitalContent: {
      downloadUrl: String,
      downloadCount: Number,
      downloadExpiry: Date
    }
  }],
  
  // Pricing
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  currency: String,
  
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
  status: String, // enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
  paymentStatus: String, // enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded']
  fulfillmentStatus: String, // enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled']
  
  // Payment Information
  payment: {
    method: String, // enum: ['card', 'upi', 'netbanking', 'wallet', 'cod']
    transactionId: String,
    gatewayResponse: Object,
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
    type: String, // enum: ['percentage', 'fixed']
    value: Number,
    amount: Number
  }],
  
  // Notes
  customerNotes: String,
  internalNotes: String,
  
  // Timestamps
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Cart Collection (Session-based)

```javascript
{
  _id: ObjectId,
  sessionId: String, // For guest users
  user: ObjectId, // Reference to User (for logged-in users)
  
  items: [{
    product: ObjectId, // Reference to Product
    variant: String,
    quantity: Number,
    addedAt: Date
  }],
  
  // Cart totals (calculated)
  subtotal: Number,
  total: Number,
  itemCount: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date // Auto-delete after certain period
}
```

### 6. Coupons Collection

```javascript
{
  _id: ObjectId,
  code: String, // Unique coupon code
  name: String,
  description: String,
  
  // Discount Details
  discountType: String, // enum: ['percentage', 'fixed', 'free_shipping']
  discountValue: Number,
  minimumAmount: Number,
  maximumDiscount: Number, // For percentage discounts
  
  // Usage Limits
  usageLimit: Number, // Total usage limit
  usageLimitPerUser: Number,
  usedCount: Number,
  
  // Validity
  validFrom: Date,
  validUntil: Date,
  
  // Conditions
  applicableProducts: [ObjectId], // Specific products
  applicableCategories: [ObjectId], // Specific categories
  excludeProducts: [ObjectId],
  excludeCategories: [ObjectId],
  firstOrderOnly: Boolean,
  userTypes: [String], // enum: ['student', 'teacher', 'institution']
  
  // Status
  isActive: Boolean,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId
}
```

### 7. Reviews Collection

```javascript
{
  _id: ObjectId,
  product: ObjectId, // Reference to Product
  user: ObjectId, // Reference to User
  order: ObjectId, // Reference to Order (for verified purchases)
  
  rating: Number, // 1-5 stars
  title: String,
  review: String,
  
  // Media
  images: [String],
  videos: [String],
  
  // Status
  isVerifiedPurchase: Boolean,
  status: String, // enum: ['pending', 'approved', 'rejected']
  
  // Helpfulness
  helpfulVotes: Number,
  notHelpfulVotes: Number,
  votedUsers: [ObjectId], // Users who voted
  
  // Response from seller/admin
  response: {
    text: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Inventory Collection

```javascript
{
  _id: ObjectId,
  product: ObjectId, // Reference to Product
  variant: String,
  
  // Stock Information
  quantity: Number,
  reservedQuantity: Number, // Items in pending orders
  availableQuantity: Number, // quantity - reservedQuantity
  
  // Stock Movements
  movements: [{
    type: String, // enum: ['in', 'out', 'adjustment']
    quantity: Number,
    reason: String,
    reference: String, // Order ID, Purchase Order ID, etc.
    timestamp: Date,
    updatedBy: ObjectId
  }],
  
  // Alerts
  lowStockThreshold: Number,
  isLowStock: Boolean,
  
  // Supplier Information
  supplier: {
    name: String,
    contact: String,
    lastOrderDate: Date,
    leadTime: Number // in days
  },
  
  // Timestamps
  lastStockUpdate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 9. Payments Collection

```javascript
{
  _id: ObjectId,
  order: ObjectId, // Reference to Order
  user: ObjectId, // Reference to User
  
  // Payment Details
  amount: Number,
  currency: String,
  method: String, // enum: ['card', 'upi', 'netbanking', 'wallet', 'cod']
  
  // Gateway Information
  gateway: String, // e.g., 'razorpay', 'paypal'
  gatewayTransactionId: String,
  gatewayOrderId: String,
  gatewayResponse: Object,
  
  // Status
  status: String, // enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']
  
  // Refund Information
  refunds: [{
    amount: Number,
    reason: String,
    gatewayRefundId: String,
    status: String,
    processedAt: Date,
    processedBy: ObjectId
  }],
  
  // Timestamps
  initiatedAt: Date,
  completedAt: Date,
  failedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 10. Subscriptions Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  product: ObjectId, // Reference to Product
  
  // Subscription Details
  plan: String,
  status: String, // enum: ['active', 'cancelled', 'expired', 'paused']
  
  // Billing
  billingCycle: String, // enum: ['monthly', 'yearly', 'weekly']
  price: Number,
  currency: String,
  nextBillingDate: Date,
  lastBillingDate: Date,
  
  // Trial
  trialStart: Date,
  trialEnd: Date,
  isTrialActive: Boolean,
  
  // Subscription Period
  startDate: Date,
  endDate: Date,
  
  // Payment Information
  paymentMethod: ObjectId,
  
  // Usage Tracking
  usageData: Object,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  cancelledAt: Date,
  pausedAt: Date
}
```

## Indexes

### Products Collection Indexes
```javascript
// Compound indexes for better query performance
db.products.createIndex({ "category": 1, "status": 1 })
db.products.createIndex({ "price.selling": 1, "status": 1 })
db.products.createIndex({ "featured": 1, "status": 1 })
db.products.createIndex({ "tags": 1, "status": 1 })
db.products.createIndex({ "slug": 1 }, { unique: true })
db.products.createIndex({ "sku": 1 }, { unique: true })

// Text search index
db.products.createIndex({ 
  "name": "text", 
  "description": "text", 
  "tags": "text" 
})
```

### Orders Collection Indexes
```javascript
db.orders.createIndex({ "user": 1, "orderDate": -1 })
db.orders.createIndex({ "status": 1, "orderDate": -1 })
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "payment.transactionId": 1 })
```

### Users Collection Indexes
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 })
```

### Reviews Collection Indexes
```javascript
db.reviews.createIndex({ "product": 1, "status": 1 })
db.reviews.createIndex({ "user": 1, "createdAt": -1 })
db.reviews.createIndex({ "rating": 1, "product": 1 })
```

## Database Relationships

1. **One-to-Many Relationships:**
   - User → Orders
   - User → Reviews
   - Product → Reviews
   - Category → Products

2. **Many-to-Many Relationships:**
   - Users ↔ Products (Wishlist)
   - Products ↔ Tags
   - Orders ↔ Coupons

3. **One-to-One Relationships:**
   - Product → Inventory
   - Order → Payment

## Data Validation Rules

1. **Email validation** for user accounts
2. **Price validation** (must be positive numbers)
3. **Status enum validation** for orders, products, etc.
4. **Required fields validation** for critical data
5. **Unique constraints** for SKUs, order numbers, etc.
6. **Date range validation** for coupons and subscriptions

## Security Considerations

1. **Password hashing** using bcrypt
2. **Input sanitization** to prevent injection attacks
3. **Rate limiting** on API endpoints
4. **Data encryption** for sensitive information
5. **Access control** based on user roles
6. **Audit trails** for critical operations

This schema provides a solid foundation for a comprehensive e-commerce system while maintaining flexibility for future enhancements and integrations with the existing EduGainer platform.
