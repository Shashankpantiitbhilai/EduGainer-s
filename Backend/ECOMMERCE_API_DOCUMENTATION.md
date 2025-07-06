# EduGainer's E-Commerce API Endpoints Documentation

## Base URL
```
Production: https://api.edugainers.com/api/v1/ecommerce
Development: http://localhost:5000/api/v1/ecommerce
```

## Authentication
- **JWT Token**: Required for protected routes
- **Header**: `Authorization: Bearer <token>`
- **Admin Routes**: Require admin privileges
- **User Routes**: Require user authentication

## API Endpoints Overview

### 1. Authentication & User Management

#### POST /auth/register
Register a new user account
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "+91-9876543210",
  "userType": "student"
}
```

#### POST /auth/login
User login
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### POST /auth/logout
User logout (invalidate token)

#### GET /auth/profile
Get current user profile

#### PUT /auth/profile
Update user profile

#### POST /auth/forgot-password
Request password reset

#### POST /auth/reset-password
Reset password with token

### 2. Product Management

#### GET /products
Get all products with filtering and pagination
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `category` (ObjectId)
  - `minPrice` (Number)
  - `maxPrice` (Number)
  - `status` (active, inactive)
  - `featured` (true, false)
  - `search` (String)
  - `sort` (price_asc, price_desc, name_asc, name_desc, newest, oldest)

#### GET /products/:id
Get single product by ID

#### GET /products/slug/:slug
Get product by slug

#### POST /products [Admin Only]
Create new product
```json
{
  "name": "Advanced Mathematics Course",
  "description": "Comprehensive mathematics course for grade 12",
  "shortDescription": "Grade 12 Math Course",
  "category": "60f7b3b3b3b3b3b3b3b3b3b3",
  "price": {
    "original": 2999,
    "selling": 1999,
    "currency": "INR"
  },
  "productType": "digital",
  "digitalContent": {
    "accessDuration": 365,
    "downloadLimit": 3
  },
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "altText": "Course Preview",
      "isPrimary": true
    }
  ],
  "inventory": {
    "quantity": 100,
    "trackQuantity": false
  },
  "status": "active",
  "featured": true,
  "tags": ["mathematics", "grade12", "advanced"]
}
```

#### PUT /products/:id [Admin Only]
Update product

#### DELETE /products/:id [Admin Only]
Delete product

#### GET /products/:id/reviews
Get product reviews

#### POST /products/:id/reviews [Auth Required]
Add product review

### 3. Categories Management

#### GET /categories
Get all categories

#### GET /categories/:id
Get category by ID

#### POST /categories [Admin Only]
Create new category

#### PUT /categories/:id [Admin Only]
Update category

#### DELETE /categories/:id [Admin Only]
Delete category

### 4. Cart Management

#### GET /cart [Auth Required]
Get user's cart

#### POST /cart/add [Auth Required]
Add item to cart
```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantity": 2,
  "variant": "Large"
}
```

#### PUT /cart/update/:itemId [Auth Required]
Update cart item quantity

#### DELETE /cart/remove/:itemId [Auth Required]
Remove item from cart

#### DELETE /cart/clear [Auth Required]
Clear entire cart

#### GET /cart/guest/:sessionId
Get guest cart

#### POST /cart/guest/:sessionId/add
Add item to guest cart

### 5. Wishlist Management

#### GET /wishlist [Auth Required]
Get user's wishlist

#### POST /wishlist/add [Auth Required]
Add product to wishlist
```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

#### DELETE /wishlist/remove/:productId [Auth Required]
Remove product from wishlist

### 6. Order Management

#### GET /orders [Auth Required]
Get user's orders
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (pending, confirmed, shipped, delivered, cancelled)

#### GET /orders/:id [Auth Required]
Get specific order details

#### POST /orders/create [Auth Required]
Create new order
```json
{
  "items": [
    {
      "product": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 1,
      "variant": "Premium"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postalCode": "400001",
    "phone": "+91-9876543210"
  },
  "paymentMethod": "card",
  "couponCode": "SAVE20"
}
```

#### PUT /orders/:id/cancel [Auth Required]
Cancel order

#### GET /orders/:id/invoice [Auth Required]
Download order invoice

#### PUT /orders/:id/status [Admin Only]
Update order status

### 7. Payment Management

#### POST /payments/create-order [Auth Required]
Create payment order (Razorpay)
```json
{
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "amount": 1999
}
```

#### POST /payments/verify [Auth Required]
Verify payment signature

#### GET /payments/:orderId [Auth Required]
Get payment details

#### POST /payments/refund [Admin Only]
Process refund

### 8. Coupon Management

#### GET /coupons/validate/:code [Auth Required]
Validate coupon code

#### GET /coupons [Admin Only]
Get all coupons

#### POST /coupons [Admin Only]
Create new coupon
```json
{
  "code": "SAVE20",
  "name": "20% Off Summer Sale",
  "discountType": "percentage",
  "discountValue": 20,
  "minimumAmount": 1000,
  "usageLimit": 100,
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": "2024-12-31T23:59:59Z",
  "isActive": true
}
```

#### PUT /coupons/:id [Admin Only]
Update coupon

#### DELETE /coupons/:id [Admin Only]
Delete coupon

### 9. Reviews & Ratings

#### GET /reviews
Get all reviews with filtering

#### GET /reviews/:id
Get specific review

#### POST /reviews [Auth Required]
Create review (after purchase)

#### PUT /reviews/:id [Auth Required]
Update review (by reviewer)

#### DELETE /reviews/:id [Auth Required/Admin]
Delete review

#### POST /reviews/:id/helpful [Auth Required]
Mark review as helpful

### 10. Address Management

#### GET /addresses [Auth Required]
Get user addresses

#### POST /addresses [Auth Required]
Add new address

#### PUT /addresses/:id [Auth Required]
Update address

#### DELETE /addresses/:id [Auth Required]
Delete address

#### PUT /addresses/:id/default [Auth Required]
Set default address

### 11. Search & Filtering

#### GET /search
Advanced product search
- **Query Parameters:**
  - `q` (search query)
  - `category` (category filter)
  - `minPrice`, `maxPrice` (price range)
  - `rating` (minimum rating)
  - `availability` (in_stock, out_of_stock)
  - `brand` (brand filter)
  - `sort` (relevance, price_asc, price_desc, rating)

#### GET /search/suggestions
Get search suggestions

#### GET /search/filters
Get available filters for current search

### 12. Analytics & Reports [Admin Only]

#### GET /admin/analytics/dashboard
Get dashboard analytics

#### GET /admin/analytics/sales
Get sales analytics
- **Query Parameters:**
  - `startDate`, `endDate`
  - `granularity` (daily, weekly, monthly)

#### GET /admin/analytics/products
Get product performance analytics

#### GET /admin/analytics/users
Get user analytics

#### GET /admin/reports/orders
Get orders report

#### GET /admin/reports/inventory
Get inventory report

#### GET /admin/reports/revenue
Get revenue report

### 13. Inventory Management [Admin Only]

#### GET /admin/inventory
Get inventory overview

#### GET /admin/inventory/:productId
Get product inventory details

#### PUT /admin/inventory/:productId
Update inventory

#### POST /admin/inventory/:productId/adjustment
Make inventory adjustment

#### GET /admin/inventory/low-stock
Get low stock products

### 14. User Management [Admin Only]

#### GET /admin/users
Get all users with pagination

#### GET /admin/users/:id
Get specific user details

#### PUT /admin/users/:id/status
Update user status

#### GET /admin/users/:id/orders
Get user's order history

### 15. Digital Content Delivery

#### GET /digital/download/:orderId/:productId [Auth Required]
Download digital product

#### GET /digital/stream/:orderId/:productId [Auth Required]
Stream digital content

#### GET /digital/access/:orderId/:productId [Auth Required]
Get access to digital content

### 16. Subscription Management

#### GET /subscriptions [Auth Required]
Get user subscriptions

#### POST /subscriptions/create [Auth Required]
Create new subscription

#### PUT /subscriptions/:id/cancel [Auth Required]
Cancel subscription

#### PUT /subscriptions/:id/pause [Auth Required]
Pause subscription

#### PUT /subscriptions/:id/resume [Auth Required]
Resume subscription

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Status Codes

- **200**: OK - Successful GET, PUT
- **201**: Created - Successful POST
- **204**: No Content - Successful DELETE
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **422**: Unprocessable Entity - Validation errors
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

## Rate Limiting

- **General API**: 100 requests per minute per IP
- **Authentication**: 5 requests per minute per IP
- **Search API**: 50 requests per minute per IP
- **Payment API**: 10 requests per minute per user

## Error Codes

- **AUTH_001**: Invalid credentials
- **AUTH_002**: Token expired
- **AUTH_003**: Insufficient permissions
- **PROD_001**: Product not found
- **PROD_002**: Insufficient inventory
- **ORDER_001**: Order not found
- **ORDER_002**: Order cannot be cancelled
- **PAYMENT_001**: Payment failed
- **PAYMENT_002**: Invalid payment signature
- **COUPON_001**: Invalid coupon code
- **COUPON_002**: Coupon expired
- **CART_001**: Cart is empty
- **CART_002**: Invalid cart item

## Webhook Endpoints

### POST /webhooks/payment
Razorpay payment webhook

### POST /webhooks/shipping
Shipping status webhook

### POST /webhooks/inventory
Inventory update webhook

## API Versioning

- Current version: v1
- Version in URL: `ecommerce`
- Backward compatibility maintained for at least 2 major versions
- Deprecation notices provided 6 months before version retirement

This comprehensive API documentation provides all the necessary endpoints for a fully functional e-commerce system integrated with the EduGainer platform.
