// ECommerce API Testing Script
// This script tests all the frontend API endpoints against the backend

const API_BASE = 'http://localhost:8000/ecommerce';

// Test data
const testData = {
  product: {
    name: "Test Product",
    description: "A test product for API testing",
    price: { selling: 999, original: 1299 },
    category: "ObjectId", // Will need actual category ID
    productType: "digital",
    isActive: true
  },
  category: {
    name: "Test Category",
    description: "A test category"
  },
  user: {
    email: "test@example.com",
    password: "testpassword123"
  }
};

// Public APIs (No Authentication Required)
const publicAPIs = [
  // Products
  { method: 'GET', url: '/products', description: 'Get all products' },
  { method: 'GET', url: '/products/featured', description: 'Get featured products' },
  { method: 'GET', url: '/products/sale', description: 'Get sale products' },
  { method: 'GET', url: '/products/search?q=test', description: 'Search products' },
  
  // Categories
  { method: 'GET', url: '/categories', description: 'Get all categories' },
  { method: 'GET', url: '/categories/hierarchy', description: 'Get category hierarchy' },
  
  // Health check
  { method: 'GET', url: '/health', description: 'API health check' }
];

// User APIs (Authentication Required)
const userAPIs = [
  // Cart
  { method: 'GET', url: '/cart', description: 'Get user cart' },
  { method: 'GET', url: '/cart/summary', description: 'Get cart summary' },
  { method: 'POST', url: '/cart/add', body: { productId: 'PRODUCT_ID', quantity: 1 }, description: 'Add to cart' },
  
  // Wishlist
  { method: 'GET', url: '/wishlist', description: 'Get user wishlist' },
  { method: 'POST', url: '/wishlist/add', body: { productId: 'PRODUCT_ID' }, description: 'Add to wishlist' },
  
  // Orders
  { method: 'GET', url: '/orders/user', description: 'Get user orders' },
  { method: 'POST', url: '/orders/create', body: { items: [], shippingAddress: {} }, description: 'Create order' }
];

// Admin APIs (Admin Authentication Required)
const adminAPIs = [
  // Product Management
  { method: 'GET', url: '/admin/products', description: 'Get all products (admin)' },
  { method: 'POST', url: '/admin/products', body: testData.product, description: 'Create product' },
  
  // Category Management (Admin routes in categories)
  { method: 'POST', url: '/categories', body: testData.category, description: 'Create category' },
  
  // Analytics
  { method: 'GET', url: '/admin/analytics/dashboard', description: 'Get dashboard analytics' },
  { method: 'GET', url: '/admin/analytics/sales', description: 'Get sales analytics' },
  
  // Inventory
  { method: 'GET', url: '/admin/inventory/overview', description: 'Get inventory overview' },
  
  // Orders Management
  { method: 'GET', url: '/admin/orders', description: 'Get all orders (admin)' }
];

console.log(`
🚀 ECommerce API Testing Guide
==============================

Backend Server: ${API_BASE}
Frontend Server: http://localhost:3000

📋 API ENDPOINTS STATUS:

1. PUBLIC APIs (No Auth Required):
${publicAPIs.map(api => `   ${api.method} ${API_BASE}${api.url} - ${api.description}`).join('\n')}

2. USER APIs (Auth Required):
${userAPIs.map(api => `   ${api.method} ${API_BASE}${api.url} - ${api.description}`).join('\n')}

3. ADMIN APIs (Admin Auth Required):
${adminAPIs.map(api => `   ${api.method} ${API_BASE}${api.url} - ${api.description}`).join('\n')}

🔑 AUTHENTICATION REQUIREMENTS:

For USER APIs, you need:
- Valid user JWT token in Authorization header
- Bearer token format: "Bearer your_jwt_token"

For ADMIN APIs, you need:
- Admin user JWT token
- Admin role privileges

🧪 TESTING STEPS:

1. Test Public APIs first (should work without auth)
2. Create/login user account for User APIs
3. Create/login admin account for Admin APIs

📝 FIXED API MISMATCHES:
- ✅ Cart: Fixed item vs product ID endpoints
- ✅ Wishlist: Fixed remove endpoint path
- ✅ Products: Admin operations use /admin/products
- ✅ Orders: Fixed user orders endpoint
- ✅ Analytics: Admin-only endpoints
- ✅ Coupons: Fixed parameter naming

🎯 READY TO TEST!

`);

// EXECUTABLE TEST COMMANDS
// Copy these commands to test the APIs directly

// 1. TEST PUBLIC APIs (No Authentication Required)
console.log(`
🧪 COPY AND RUN THESE COMMANDS:

=== PUBLIC API TESTS (Run these first) ===

# Test API Health Check
curl -X GET "http://localhost:8000/ecommerce/health" -H "Content-Type: application/json"

# Test Get All Products  
curl -X GET "http://localhost:8000/ecommerce/products" -H "Content-Type: application/json"

# Test Get Categories
curl -X GET "http://localhost:8000/ecommerce/categories" -H "Content-Type: application/json"

# Test Product Search
curl -X GET "http://localhost:8000/ecommerce/products/search?q=test" -H "Content-Type: application/json"

# Test Featured Products
curl -X GET "http://localhost:8000/ecommerce/products/featured" -H "Content-Type: application/json"

=== AUTHENTICATION REQUIRED TESTS ===

# First, you need to get an auth token:
# 1. Register/Login to get JWT token
curl -X POST "http://localhost:8000/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "your_email@example.com", "password": "your_password"}'

# Replace YOUR_JWT_TOKEN with the token from login response

# Test Get Cart (User Auth Required)
curl -X GET "http://localhost:8000/ecommerce/cart" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test Get Wishlist (User Auth Required)  
curl -X GET "http://localhost:8000/ecommerce/wishlist" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

=== ADMIN API TESTS (Admin Auth Required) ===

# Get All Products (Admin)
curl -X GET "http://localhost:8000/ecommerce/admin/products" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get Dashboard Analytics (Admin)
curl -X GET "http://localhost:8000/ecommerce/admin/analytics/dashboard" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Create Category (Admin - uses main categories endpoint)
curl -X POST "http://localhost:8000/ecommerce/categories" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \\
  -d '{"name": "Test Category", "description": "A test category"}'

=== POWERSHELL COMMANDS (Alternative) ===

# Test Health Check (PowerShell)
Invoke-RestMethod -Uri "http://localhost:8000/ecommerce/health" -Method GET

# Test Get Products (PowerShell)
Invoke-RestMethod -Uri "http://localhost:8000/ecommerce/products" -Method GET

# Test with Auth (PowerShell)
$headers = @{ Authorization = "Bearer YOUR_JWT_TOKEN" }
Invoke-RestMethod -Uri "http://localhost:8000/ecommerce/cart" -Method GET -Headers $headers

=== NODE.JS TEST SCRIPT ===

# To run automated tests, create a test.js file with axios calls
# npm install axios
# node test.js

`);

export { publicAPIs, userAPIs, adminAPIs, testData, API_BASE };
