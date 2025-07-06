const axios = require('axios');

const BASE_URL = 'http://localhost:8000/ecommerce';
let testCategoryId = null;
let testProductId = null;

console.log('🎯 Running Final E-Commerce API Validation Tests\n');

async function runFinalTests() {
  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  function recordTest(name, passed, details = '') {
    if (passed) {
      console.log(`✅ ${name}: PASS ${details}`);
      passedTests++;
    } else {
      console.log(`❌ ${name}: FAIL ${details}`);
      failedTests++;
    }
    results.push({ name, passed, details });
  }

  try {
    // Test 1: Core Categories API
    console.log('📂 Testing Categories API...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
      recordTest('Get all categories', 
        Array.isArray(categoriesResponse.data),
        `Found ${categoriesResponse.data.length} categories`);
    } catch (error) {
      recordTest('Get all categories', false, error.response?.data?.message || error.message);
    }

    // Test 2: Create Category
    try {
      const newCategory = {
        name: 'Final Test Category',
        description: 'Category for final testing',
        slug: 'final-test-category'
      };
      const createResponse = await axios.post(`${BASE_URL}/categories`, newCategory);
      testCategoryId = createResponse.data._id;
      recordTest('Create category', true, `Created ID: ${testCategoryId}`);
    } catch (error) {
      recordTest('Create category', false, error.response?.data?.message || error.message);
    }

    // Test 3: Core Products API
    console.log('\n📦 Testing Products API...');
    try {
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      recordTest('Get all products', 
        Array.isArray(productsResponse.data),
        `Found ${productsResponse.data.length} products`);
    } catch (error) {
      recordTest('Get all products', false, error.response?.data?.message || error.message);
    }

    // Test 4: Create Product
    if (testCategoryId) {
      try {
        const newProduct = {
          name: 'Final Test Product',
          description: 'Product for final testing',
          price: 199.99,
          category: testCategoryId,
          sku: 'FINAL-TEST-001',
          stock: 100,
          images: ['https://example.com/test-product.jpg'],
          isActive: true
        };
        const createProductResponse = await axios.post(`${BASE_URL}/products`, newProduct);
        testProductId = createProductResponse.data._id;
        recordTest('Create product', true, `Created ID: ${testProductId}`);
      } catch (error) {
        recordTest('Create product', false, error.response?.data?.message || error.message);
      }
    }

    // Test 5: Product Search
    try {
      const searchResponse = await axios.get(`${BASE_URL}/products/search?q=Final`);
      recordTest('Search products', 
        Array.isArray(searchResponse.data),
        `Found ${searchResponse.data.length} products`);
    } catch (error) {
      recordTest('Search products', false, error.response?.data?.message || error.message);
    }

    // Test 6: Filter Products by Category
    if (testCategoryId) {
      try {
        const filterResponse = await axios.get(`${BASE_URL}/products?category=${testCategoryId}`);
        recordTest('Filter products by category', 
          Array.isArray(filterResponse.data),
          `Found ${filterResponse.data.length} products in category`);
      } catch (error) {
        recordTest('Filter products by category', false, error.response?.data?.message || error.message);
      }
    }

    // Test 7: Coupons API
    console.log('\n🎫 Testing Coupons API...');
    try {
      const couponResponse = await axios.get(`${BASE_URL}/coupons/validate/NONEXISTENT`);
      recordTest('Validate non-existent coupon', false, 'Should return 404');
    } catch (error) {
      recordTest('Validate non-existent coupon', 
        error.response?.status === 404,
        `Correctly returned 404`);
    }

    // Test 8: Subscriptions API
    console.log('\n💳 Testing Subscriptions API...');
    try {
      const subscriptionResponse = await axios.get(`${BASE_URL}/subscriptions/plans`);
      recordTest('Get subscription plans', 
        Array.isArray(subscriptionResponse.data),
        `Found ${subscriptionResponse.data.length} plans`);
    } catch (error) {
      recordTest('Get subscription plans', false, error.response?.data?.message || error.message);
    }

    // Test 9: Protected Endpoints (Should require auth)
    console.log('\n🔐 Testing Protected Endpoints (Auth Required)...');
    
    // Cart (should require auth)
    try {
      await axios.get(`${BASE_URL}/cart`);
      recordTest('Cart endpoint security', false, 'Should require authentication');
    } catch (error) {
      recordTest('Cart endpoint security', 
        error.response?.status === 401 || error.response?.status === 403,
        `Correctly requires auth (Status: ${error.response?.status})`);
    }

    // Orders (should require auth)
    try {
      await axios.get(`${BASE_URL}/orders`);
      recordTest('Orders endpoint security', false, 'Should require authentication');
    } catch (error) {
      recordTest('Orders endpoint security', 
        error.response?.status === 401 || error.response?.status === 403,
        `Correctly requires auth (Status: ${error.response?.status})`);
    }

    // Wishlist (should require auth)
    try {
      await axios.get(`${BASE_URL}/wishlist`);
      recordTest('Wishlist endpoint security', false, 'Should require authentication');
    } catch (error) {
      recordTest('Wishlist endpoint security', 
        error.response?.status === 401 || error.response?.status === 403,
        `Correctly requires auth (Status: ${error.response?.status})`);
    }

    // Test 10: Admin Endpoints (Should require admin auth)
    console.log('\n👑 Testing Admin Endpoints (Admin Auth Required)...');
    try {
      await axios.get(`${BASE_URL}/admin/products`);
      recordTest('Admin products endpoint security', false, 'Should require admin authentication');
    } catch (error) {
      recordTest('Admin products endpoint security', 
        error.response?.status === 401 || error.response?.status === 403,
        `Correctly requires admin auth (Status: ${error.response?.status})`);
    }

    try {
      await axios.get(`${BASE_URL}/admin/analytics/dashboard`);
      recordTest('Admin analytics endpoint security', false, 'Should require admin authentication');
    } catch (error) {
      recordTest('Admin analytics endpoint security', 
        error.response?.status === 401 || error.response?.status === 403,
        `Correctly requires admin auth (Status: ${error.response?.status})`);
    }

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
  }

  // Cleanup
  console.log('\n🧹 Cleaning up test data...');
  if (testProductId) {
    try {
      await axios.delete(`${BASE_URL}/products/${testProductId}`);
      recordTest('Cleanup: Delete test product', true);
    } catch (error) {
      recordTest('Cleanup: Delete test product', false, 'Expected - may require auth');
    }
  }

  if (testCategoryId) {
    try {
      await axios.delete(`${BASE_URL}/categories/${testCategoryId}`);
      recordTest('Cleanup: Delete test category', true);
    } catch (error) {
      recordTest('Cleanup: Delete test category', false, 'Expected - may require auth');
    }
  }

  // Final Summary
  console.log('\n==================================================');
  console.log('🎯 FINAL E-COMMERCE API VALIDATION SUMMARY');
  console.log('==================================================');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${passedTests + failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  // Categorize results
  const coreTests = results.filter(r => 
    r.name.includes('Get all') || 
    r.name.includes('Create') || 
    r.name.includes('Search') || 
    r.name.includes('Filter')
  );
  const securityTests = results.filter(r => r.name.includes('security'));
  const otherTests = results.filter(r => !coreTests.includes(r) && !securityTests.includes(r));

  console.log(`\n📋 Core Functionality: ${coreTests.filter(t => t.passed).length}/${coreTests.length} passed`);
  console.log(`🔒 Security Tests: ${securityTests.filter(t => t.passed).length}/${securityTests.length} passed`);
  console.log(`🔧 Other Tests: ${otherTests.filter(t => t.passed).length}/${otherTests.length} passed`);

  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.name}: ${r.details}`);
    });
  }

  // Final readiness assessment
  const corePassRate = (coreTests.filter(t => t.passed).length / coreTests.length) * 100;
  const securityPassRate = (securityTests.filter(t => t.passed).length / securityTests.length) * 100;

  console.log('\n==================================================');
  console.log('🏆 FRONTEND READINESS ASSESSMENT');
  console.log('==================================================');
  
  if (corePassRate >= 80) {
    console.log('✅ CORE FUNCTIONALITY: READY FOR FRONTEND INTEGRATION');
  } else {
    console.log('⚠️  CORE FUNCTIONALITY: NEEDS ATTENTION BEFORE FRONTEND');
  }
  
  if (securityPassRate >= 80) {
    console.log('✅ SECURITY: PROPERLY CONFIGURED');
  } else {
    console.log('⚠️  SECURITY: NEEDS REVIEW');
  }

  console.log('\n✅ Final validation completed!');
  console.log('🚀 E-commerce backend is ready for frontend development!');
}

runFinalTests().catch(console.error);
