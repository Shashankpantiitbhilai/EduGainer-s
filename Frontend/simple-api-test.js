const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:8000';

// Test helper function
async function testEndpoint(method, url, data = null, headers = {}, description = '') {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${description}: PASS ${response.status} - ${response.data.message || 'Success'}`);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    const message = error.response?.data?.message || error.message;
    console.log(`❌ ${description}: FAIL ${status} - ${message}`);
    return { success: false, error: message, status };
  }
}

async function runTests() {
  console.log('🚀 TESTING EDUGAINER ECOMMERCE APIs');
  console.log('============================================================\n');

  // STEP 1: Test Public Endpoints
  console.log('🔓 TESTING PUBLIC ENDPOINTS');
  console.log('==================================================');
  
  await testEndpoint('GET', '/ecommerce/health', null, {}, 'API Health Check');
  await testEndpoint('GET', '/ecommerce/products', null, {}, 'Get All Products');
  await testEndpoint('GET', '/ecommerce/categories', null, {}, 'Get All Categories');
  await testEndpoint('GET', '/ecommerce/products/featured', null, {}, 'Get Featured Products');
  await testEndpoint('GET', '/ecommerce/products/search?q=test', null, {}, 'Search Products');
  await testEndpoint('GET', '/ecommerce/categories/hierarchy', null, {}, 'Get Category Hierarchy');

  console.log('\n');

  // STEP 2: Test Authentication Required Endpoints (Should Fail Without Token)
  console.log('🔒 TESTING PROTECTED ENDPOINTS (Should fail without auth)');
  console.log('==================================================');
  
  await testEndpoint('GET', '/ecommerce/cart', null, {}, 'Get Cart (No Auth)');
  await testEndpoint('GET', '/ecommerce/wishlist', null, {}, 'Get Wishlist (No Auth)');
  await testEndpoint('GET', '/ecommerce/admin/products', null, {}, 'Admin Products (No Auth)');

  console.log('\n');

  // STEP 3: Manual Token Testing Instructions
  console.log('🔑 MANUAL TOKEN TESTING');
  console.log('==================================================');
  console.log('To test with authentication, you need to:');
  console.log('1. Login to your app in browser');
  console.log('2. Open browser dev tools');
  console.log('3. Check Network tab or Local Storage for JWT token');
  console.log('4. Copy the token and paste it below');
  console.log('');
  
  // Example of how to test with token (you'll need to provide the actual token)
  const EXAMPLE_TOKEN = 'your_jwt_token_here';
  
  if (EXAMPLE_TOKEN !== 'your_jwt_token_here') {
    console.log('📋 TESTING WITH PROVIDED TOKEN');
    console.log('==================================================');
    
    const authHeaders = { 'Authorization': `Bearer ${EXAMPLE_TOKEN}` };
    
    await testEndpoint('GET', '/ecommerce/cart', null, authHeaders, 'Get Cart (With Token)');
    await testEndpoint('GET', '/ecommerce/wishlist', null, authHeaders, 'Get Wishlist (With Token)');
    await testEndpoint('GET', '/ecommerce/orders/user', null, authHeaders, 'Get User Orders (With Token)');
    
    // Admin endpoints (need admin token)
    await testEndpoint('GET', '/ecommerce/admin/products', null, authHeaders, 'Admin Products (With Token)');
    await testEndpoint('GET', '/ecommerce/admin/analytics/dashboard', null, authHeaders, 'Admin Analytics (With Token)');
  } else {
    console.log('ℹ️ No token provided. Skipping authenticated tests.');
    console.log('   To test authenticated endpoints, replace EXAMPLE_TOKEN with your actual JWT token.');
  }

  console.log('\n');

  // STEP 4: Test Category Management (Admin)
  console.log('📁 TESTING CATEGORY OPERATIONS');
  console.log('==================================================');
  
  const testCategory = {
    name: 'API Test Category',
    description: 'Category created via API test'
  };
  
  await testEndpoint('POST', '/ecommerce/categories', testCategory, {}, 'Create Category (No Auth)');

  console.log('\n');

  // STEP 5: Summary
  console.log('📊 TEST SUMMARY');
  console.log('==================================================');
  console.log('✅ Public endpoints should return 200 OK');
  console.log('❌ Protected endpoints should return 401 Unauthorized without token');
  console.log('🔑 For full testing, provide JWT tokens from browser login');
  console.log('');
  console.log('📝 NEXT STEPS:');
  console.log('1. Open your app in browser: http://localhost:3000');
  console.log('2. Login with your Google account');
  console.log('3. Open dev tools and find JWT token');
  console.log('4. Replace EXAMPLE_TOKEN in this script with your actual token');
  console.log('5. Run this script again for full testing');
}

// Run the tests
runTests().catch(console.error);
