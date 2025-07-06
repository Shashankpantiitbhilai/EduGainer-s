const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:8000';

// Session cookies from browser - UPDATED
const ADMIN_SESSION_COOKIE = "s%3A52Q_c3ndMkQ8y_Zb4JjuXvvn0Vbxvkbq.3%2F45jyxkndufOnfoi2JN1tDkltDF5I6FkC47ZIqOQ3k";
const USER_SESSION_COOKIE = "s%3Asmvihngrw8Xk-iGvnCY90mt9bKkdB0Ei.pXXyRy7OkjOiWyOWqnfCW5CUX1JJPYNoj%2FjNvBkySfk";

// Create axios instances
const publicAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const userAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cookie': `connect.sid=${USER_SESSION_COOKIE}`
  }
});

// Known product IDs from our created products
const KNOWN_PRODUCT_IDS = [
  '686a091febde6959c9d067fa', // Wireless Mouse
  '686a091febde6959c9d067f1', // Notebook Set  
  '686a091febde6959c9d067e8', // Mathematics Textbook
  '686a091febde6959c9d067df'  // Laptop Computer
];

// Function to make API requests with error handling
async function makeRequest(apiInstance, method, url, data, description) {
  try {
    const response = await apiInstance.request({ method, url, data });
    console.log(`✅ ${description}: PASS ${response.status}`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    const message = error.response?.data?.message || error.message;
    console.log(`❌ ${description}: FAIL ${status} - ${message}`);
    return { success: false, error: message, status };
  }
}

// Test only the APIs that the frontend services use
async function testFrontendApis() {
  console.log('🚀 TESTING FRONTEND E-COMMERCE APIS');
  console.log('='.repeat(60));
  console.log('Testing only APIs that are implemented in frontend services...');
  console.log('='.repeat(60));

  let results = {
    public: { passed: 0, failed: 0 },
    user: { passed: 0, failed: 0 }
  };

  // =================
  // PUBLIC APIs (ProductService & CategoryService)
  // =================
  console.log('\\n📱 TESTING PUBLIC APIs (Frontend ProductService & CategoryService)');
  console.log('='.repeat(50));

  // ProductService public methods
  let result = await makeRequest(publicAPI, 'get', '/ecommerce/products', null, 'ProductService.getProducts()');
  result.success ? results.public.passed++ : results.public.failed++;
  
  result = await makeRequest(publicAPI, 'get', '/ecommerce/products/search', null, 'ProductService.searchProducts()');
  result.success ? results.public.passed++ : results.public.failed++;

  // Test with a known product ID
  const testProductId = KNOWN_PRODUCT_IDS[0];
  result = await makeRequest(publicAPI, 'get', `/ecommerce/products/${testProductId}`, null, 'ProductService.getProduct(id)');
  result.success ? results.public.passed++ : results.public.failed++;

  result = await makeRequest(publicAPI, 'get', `/ecommerce/products/${testProductId}/reviews`, null, 'ProductService.getProductReviews()');
  result.success ? results.public.passed++ : results.public.failed++;

  result = await makeRequest(publicAPI, 'get', `/ecommerce/products/${testProductId}/related`, null, 'ProductService.getRelatedProducts()');
  result.success ? results.public.passed++ : results.public.failed++;

  // CategoryService public methods
  result = await makeRequest(publicAPI, 'get', '/ecommerce/categories', null, 'CategoryService.getCategories()');
  result.success ? results.public.passed++ : results.public.failed++;

  result = await makeRequest(publicAPI, 'get', '/ecommerce/categories/hierarchy', null, 'CategoryService.getCategoryHierarchy()');
  result.success ? results.public.passed++ : results.public.failed++;

  // Get a category ID from the categories response
  const categoriesResponse = await makeRequest(publicAPI, 'get', '/ecommerce/categories', null, 'Get categories for testing');
  let testCategoryId = null;
  if (categoriesResponse.success && categoriesResponse.data?.data?.length > 0) {
    testCategoryId = categoriesResponse.data.data[0]._id;
    
    result = await makeRequest(publicAPI, 'get', `/ecommerce/categories/${testCategoryId}`, null, 'CategoryService.getCategory(id)');
    result.success ? results.public.passed++ : results.public.failed++;

    result = await makeRequest(publicAPI, 'get', `/ecommerce/categories/${testCategoryId}/products`, null, 'CategoryService.getCategoryProducts()');
    result.success ? results.public.passed++ : results.public.failed++;
  }

  // =================
  // USER APIs (CartService, WishlistService, OrderService)
  // =================
  console.log('\\n👤 TESTING USER APIs (Frontend CartService, WishlistService, OrderService)');
  console.log('='.repeat(50));

  // CartService methods
  result = await makeRequest(userAPI, 'get', '/ecommerce/cart', null, 'CartService.getCart()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'post', '/ecommerce/cart/add', { 
    productId: testProductId, 
    quantity: 1 
  }, 'CartService.addToCart()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'put', `/ecommerce/cart/item/${testProductId}`, { 
    quantity: 2 
  }, 'CartService.updateCartItem()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'delete', `/ecommerce/cart/item/${testProductId}`, null, 'CartService.removeFromCart()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'delete', '/ecommerce/cart/clear', null, 'CartService.clearCart()');
  result.success ? results.user.passed++ : results.user.failed++;

  // WishlistService methods
  result = await makeRequest(userAPI, 'get', '/ecommerce/wishlist', null, 'WishlistService.getWishlist()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'post', '/ecommerce/wishlist/add', { 
    productId: testProductId 
  }, 'WishlistService.addToWishlist()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'delete', `/ecommerce/wishlist/item/${testProductId}`, null, 'WishlistService.removeFromWishlist()');
  result.success ? results.user.passed++ : results.user.failed++;

  // OrderService methods
  result = await makeRequest(userAPI, 'get', '/ecommerce/orders', null, 'OrderService.getUserOrders()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'post', '/ecommerce/orders/create', {
    items: [{ 
      productId: testProductId, 
      quantity: 1, 
      price: 29.99 
    }],
    totalAmount: 29.99,
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'India'
    }
  }, 'OrderService.createOrder()');
  result.success ? results.user.passed++ : results.user.failed++;

  result = await makeRequest(userAPI, 'post', '/ecommerce/orders/verify-payment', {
    orderId: 'test-order-id',
    paymentId: 'test-payment-id',
    signature: 'test-signature'
  }, 'OrderService.verifyPayment()');
  result.success ? results.user.passed++ : results.user.failed++;

  // =================
  // SUMMARY REPORT
  // =================
  console.log('\\n📊 FRONTEND API TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\\n📱 PUBLIC APIs (ProductService & CategoryService):`);
  console.log(`   ✅ Passed: ${results.public.passed}`);
  console.log(`   ❌ Failed: ${results.public.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((results.public.passed / (results.public.passed + results.public.failed)) * 100)}%`);
  
  console.log(`\\n👤 USER APIs (CartService, WishlistService, OrderService):`);
  console.log(`   ✅ Passed: ${results.user.passed}`);
  console.log(`   ❌ Failed: ${results.user.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((results.user.passed / (results.user.passed + results.user.failed)) * 100)}%`);
  
  const totalPassed = results.public.passed + results.user.passed;
  const totalFailed = results.public.failed + results.user.failed;
  const overallSuccess = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);
  
  console.log(`\\n🎯 OVERALL RESULTS:`);
  console.log(`   ✅ Total Passed: ${totalPassed}`);
  console.log(`   ❌ Total Failed: ${totalFailed}`);
  console.log(`   📈 Overall Success Rate: ${overallSuccess}%`);
  
  if (overallSuccess >= 80) {
    console.log('\\n🎉 EXCELLENT! Frontend APIs are working well!');
  } else if (overallSuccess >= 60) {
    console.log('\\n⚠️ GOOD! Most frontend APIs are working, some need fixes.');
  } else {
    console.log('\\n❌ NEEDS WORK! Many frontend APIs are not working properly.');
  }
  
  console.log('\\n='.repeat(60));
  console.log('✅ = Frontend service method working');
  console.log('❌ = Frontend service method needs fixing');
}

// Run the frontend API tests
testFrontendApis().catch(error => {
  console.error('❌ Test runner error:', error.message);
});
