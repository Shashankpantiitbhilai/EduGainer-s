const axios = require('axios');

const BASE_URL = 'http://localhost:8000/ecommerce';
let testCategoryId = null;
let testProductId = null;

// Test data
const testCategory = {
  name: 'Test Electronics',
  description: 'Test category for electronics',
  slug: 'test-electronics'
};

const testProduct = {
  name: 'Test Laptop',
  description: 'High-performance test laptop',
  price: 999.99,
  category: '', // Will be set after category creation
  sku: 'TEST-LAPTOP-001',
  stock: 50,
  images: ['https://example.com/laptop.jpg'],
  specifications: {
    brand: 'TestBrand',
    model: 'TB-001',
    processor: 'Intel i7',
    ram: '16GB',
    storage: '512GB SSD'
  },
  features: ['Fast performance', 'Long battery life', 'Lightweight'],
  isActive: true
};

console.log('🧪 Running E-Commerce Data Operations Tests\n');

async function testDataOperations() {
  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  // Helper function to record test results
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
    // Test 1: Create Category
    console.log('📂 Testing Category Operations...');
    try {
      const categoryResponse = await axios.post(`${BASE_URL}/categories`, testCategory);
      testCategoryId = categoryResponse.data._id;
      recordTest('Create category', true, `ID: ${testCategoryId}`);
    } catch (error) {
      recordTest('Create category', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get Category by ID
    if (testCategoryId) {
      try {
        const getCategoryResponse = await axios.get(`${BASE_URL}/categories/${testCategoryId}`);
        const category = getCategoryResponse.data;
        recordTest('Get category by ID', 
          category._id === testCategoryId && category.name === testCategory.name,
          `Name: ${category.name}`);
      } catch (error) {
        recordTest('Get category by ID', false, error.response?.data?.message || error.message);
      }
    }

    // Test 3: Update Category
    if (testCategoryId) {
      try {
        const updatedCategory = { ...testCategory, name: 'Updated Test Electronics' };
        const updateResponse = await axios.put(`${BASE_URL}/categories/${testCategoryId}`, updatedCategory);
        recordTest('Update category', 
          updateResponse.data.name === 'Updated Test Electronics',
          `New name: ${updateResponse.data.name}`);
      } catch (error) {
        recordTest('Update category', false, error.response?.data?.message || error.message);
      }
    }

    // Test 4: Create Product
    console.log('\n📦 Testing Product Operations...');
    if (testCategoryId) {
      testProduct.category = testCategoryId;
      try {
        const productResponse = await axios.post(`${BASE_URL}/products`, testProduct);
        testProductId = productResponse.data._id;
        recordTest('Create product', true, `ID: ${testProductId}`);
      } catch (error) {
        recordTest('Create product', false, error.response?.data?.message || error.message);
      }
    }

    // Test 5: Get Product by ID
    if (testProductId) {
      try {
        const getProductResponse = await axios.get(`${BASE_URL}/products/${testProductId}`);
        const product = getProductResponse.data;
        recordTest('Get product by ID', 
          product._id === testProductId && product.name === testProduct.name,
          `Name: ${product.name}, Price: $${product.price}`);
      } catch (error) {
        recordTest('Get product by ID', false, error.response?.data?.message || error.message);
      }
    }

    // Test 6: Search Products
    try {
      const searchResponse = await axios.get(`${BASE_URL}/products/search?q=Test`);
      recordTest('Search products', 
        Array.isArray(searchResponse.data) && searchResponse.data.length >= 0,
        `Found ${searchResponse.data.length} products`);
    } catch (error) {
      recordTest('Search products', false, error.response?.data?.message || error.message);
    }

    // Test 7: Filter Products by Category
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

    // Test 8: Test Product Pagination
    try {
      const paginationResponse = await axios.get(`${BASE_URL}/products?page=1&limit=5`);
      recordTest('Product pagination', 
        Array.isArray(paginationResponse.data) && paginationResponse.data.length <= 5,
        `Returned ${paginationResponse.data.length} products`);
    } catch (error) {
      recordTest('Product pagination', false, error.response?.data?.message || error.message);
    }

    // Test 9: Test Invalid Operations
    console.log('\n🚨 Testing Error Handling...');
    try {
      await axios.get(`${BASE_URL}/categories/invalid-id`);
      recordTest('Invalid category ID handling', false, 'Should have returned error');
    } catch (error) {
      recordTest('Invalid category ID handling', 
        error.response?.status === 400 || error.response?.status === 404,
        `Status: ${error.response?.status}`);
    }

    try {
      await axios.get(`${BASE_URL}/products/invalid-id`);
      recordTest('Invalid product ID handling', false, 'Should have returned error');
    } catch (error) {
      recordTest('Invalid product ID handling', 
        error.response?.status === 400 || error.response?.status === 404,
        `Status: ${error.response?.status}`);
    }

    // Test 10: Test Coupon Validation
    console.log('\n🎫 Testing Coupon Operations...');
    try {
      const couponResponse = await axios.get(`${BASE_URL}/coupons/validate/NONEXISTENT`);
      recordTest('Validate non-existent coupon', false, 'Should return 404');
    } catch (error) {
      recordTest('Validate non-existent coupon', 
        error.response?.status === 404,
        `Status: ${error.response?.status}`);
    }

    // Test 11: Test Subscription Plans
    console.log('\n💳 Testing Subscription Operations...');
    try {
      const subscriptionResponse = await axios.get(`${BASE_URL}/subscriptions/plans`);
      recordTest('Get subscription plans', 
        Array.isArray(subscriptionResponse.data),
        `Found ${subscriptionResponse.data.length} plans`);
    } catch (error) {
      recordTest('Get subscription plans', false, error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
  }

  // Cleanup: Delete test data
  console.log('\n🧹 Cleaning up test data...');
  
  if (testProductId) {
    try {
      await axios.delete(`${BASE_URL}/products/${testProductId}`);
      recordTest('Delete test product', true, 'Cleanup successful');
    } catch (error) {
      recordTest('Delete test product', false, 'Cleanup failed (this is okay)');
    }
  }

  if (testCategoryId) {
    try {
      await axios.delete(`${BASE_URL}/categories/${testCategoryId}`);
      recordTest('Delete test category', true, 'Cleanup successful');
    } catch (error) {
      recordTest('Delete test category', false, 'Cleanup failed (this is okay)');
    }
  }

  // Summary
  console.log('\n==================================================');
  console.log('📊 DATA OPERATIONS TEST SUMMARY');
  console.log('==================================================');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${passedTests + failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.name}: ${r.details}`);
    });
  }

  console.log('\n✅ Data operations test completed!');
}

// Run the tests
testDataOperations().catch(console.error);
