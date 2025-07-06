const axios = require('axios');

// Test the separated services that match backend structure
const BASE_URL = 'http://localhost:8000';

// Session cookies for admin authentication
const ADMIN_SESSION_COOKIE = "s%3A52Q_c3ndMkQ8y_Zb4JjuXvvn0Vbxvkbq.3%2F45jyxkndufOnfoi2JN1tDkltDF5I6FkC47ZIqOQ3k";

// Create axios instances
const publicAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const adminAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cookie': `connect.sid=${ADMIN_SESSION_COOKIE}`
  }
});

// Test function
async function makeRequest(api, method, url, data, description) {
  try {
    const response = await api.request({ method, url, data });
    console.log(`✅ ${description}: PASS ${response.status}`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    const message = error.response?.data?.message || error.message;
    console.log(`❌ ${description}: FAIL ${status} - ${message}`);
    return { success: false, error: message, status };
  }
}

async function testSeparatedServices() {
  console.log('🔍 TESTING SEPARATED FRONTEND SERVICES (MATCHING BACKEND STRUCTURE)');
  console.log('='.repeat(80));
  
  console.log('\n📦 USER/PUBLIC PRODUCT SERVICES (Frontend: userProductService)');
  console.log('-'.repeat(60));
  await makeRequest(publicAPI, 'get', '/ecommerce/products', null, 'User: Get All Products');
  await makeRequest(publicAPI, 'get', '/ecommerce/products/featured', null, 'User: Get Featured Products');
  await makeRequest(publicAPI, 'get', '/ecommerce/products/686a091febde6959c9d067fa', null, 'User: Get Product by ID');
  await makeRequest(publicAPI, 'get', '/ecommerce/products?search=laptop', null, 'User: Search Products');
  
  console.log('\n👑 ADMIN PRODUCT SERVICES (Frontend: adminProductService)');
  console.log('-'.repeat(60));
  await makeRequest(adminAPI, 'get', '/ecommerce/admin/products', null, 'Admin: Get All Products');
  await makeRequest(adminAPI, 'get', '/ecommerce/admin/products/686a091febde6959c9d067fa', null, 'Admin: Get Product by ID');
  
  // Test admin product creation
  const testProduct = {
    name: 'Test Service Product',
    slug: 'test-service-product',
    description: 'Testing separated services',
    shortDescription: 'Test product',
    category: '686a02f2d4ecc62dc768a37b', // Electronics category
    sku: 'TESTSVC001',
    productType: 'physical',
    price: { original: 99.99, selling: 89.99, currency: 'INR' },
    inventory: { quantity: 10, lowStockThreshold: 2, trackQuantity: true },
    status: 'active',
    visibility: 'public',
    createdBy: '68699b01a0b369027411f329',
    images: [{ url: 'https://via.placeholder.com/400x300', altText: 'Test', isPrimary: true }]
  };
  
  await makeRequest(adminAPI, 'post', '/ecommerce/admin/products', testProduct, 'Admin: Create Product');
  
  console.log('\n📂 USER/PUBLIC CATEGORY SERVICES (Frontend: userCategoryService)');
  console.log('-'.repeat(60));
  await makeRequest(publicAPI, 'get', '/ecommerce/categories', null, 'User: Get All Categories');
  await makeRequest(publicAPI, 'get', '/ecommerce/categories/hierarchy', null, 'User: Get Category Hierarchy');
  await makeRequest(publicAPI, 'get', '/ecommerce/categories/686a02f2d4ecc62dc768a37b', null, 'User: Get Category by ID');
  
  console.log('\n👑 ADMIN CATEGORY SERVICES (Frontend: adminCategoryService)');
  console.log('-'.repeat(60));
  await makeRequest(adminAPI, 'get', '/ecommerce/categories', null, 'Admin: Get All Categories');
  
  // Test admin category creation
  const testCategory = {
    name: 'Test Service Category',
    description: 'Testing separated services',
    isActive: true
  };
  
  await makeRequest(adminAPI, 'post', '/ecommerce/categories', testCategory, 'Admin: Create Category');
  await makeRequest(adminAPI, 'get', '/ecommerce/categories/686a02f2d4ecc62dc768a37b', null, 'Admin: Get Category by ID');
  
  console.log('\n🎉 FRONTEND SERVICES TESTING COMPLETED');
  console.log('='.repeat(80));
  console.log('✅ = API endpoint working correctly');
  console.log('❌ = API endpoint has issues');
  console.log('\nNow the frontend components should use:');
  console.log('👤 User Components: userProductService, userCategoryService');
  console.log('👑 Admin Components: adminProductService, adminCategoryService');
}

testSeparatedServices();
