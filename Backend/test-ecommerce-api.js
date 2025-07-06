const axios = require('axios');

const BASE_URL = 'http://localhost:8000/ecommerce';
const ADMIN_URL = 'http://localhost:8000/ecommerce/admin';

// Test data
const testProduct = {
  name: 'Test Product',
  description: 'A test product for e-commerce',
  price: { current: 99.99, salePrice: 79.99 },
  category: null, // Will be set after creating category
  type: 'physical',
  sku: 'TEST-001',
  isActive: true
};

const testCategory = {
  name: 'Test Category',
  description: 'A test category for e-commerce'
};

class ECommerceAPITester {
  constructor() {
    this.createdIds = {
      categories: [],
      products: [],
      coupons: []
    };
  }

  async runTests() {
    console.log('🚀 Starting E-Commerce API Tests\n');

    try {
      // Test Categories
      await this.testCategories();
      
      // Test Products
      await this.testProducts();
      
      // Test Coupons
      await this.testCoupons();
      
      // Test Analytics
      await this.testAnalytics();
      
      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
      }
    }
  }

  async testCategories() {
    console.log('📂 Testing Categories...');
    
    // Create category
    try {
      const response = await axios.post(`${BASE_URL}/categories`, testCategory);
      console.log('  ✅ Create category:', response.status === 201 ? 'PASS' : 'FAIL');
      this.createdIds.categories.push(response.data.data._id);
      testProduct.category = response.data.data._id;
    } catch (error) {
      console.log('  ❌ Create category: FAIL -', error.response?.data?.message || error.message);
    }

    // Get all categories
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      console.log('  ✅ Get categories:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Get categories: FAIL -', error.response?.data?.message || error.message);
    }
  }

  async testProducts() {
    console.log('\n📦 Testing Products...');
    
    // Get all products
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      console.log('  ✅ Get products:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Get products: FAIL -', error.response?.data?.message || error.message);
    }

    // Admin: Create product
    try {
      const response = await axios.post(`${ADMIN_URL}/products`, testProduct);
      console.log('  ✅ Admin create product:', response.status === 201 ? 'PASS' : 'FAIL');
      if (response.data.data) {
        this.createdIds.products.push(response.data.data._id);
      }
    } catch (error) {
      console.log('  ❌ Admin create product: FAIL -', error.response?.data?.message || error.message);
    }

    // Admin: Get all products
    try {
      const response = await axios.get(`${ADMIN_URL}/products`);
      console.log('  ✅ Admin get products:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Admin get products: FAIL -', error.response?.data?.message || error.message);
    }

    // Test single product
    if (this.createdIds.products.length > 0) {
      const productId = this.createdIds.products[0];
      
      try {
        const response = await axios.get(`${BASE_URL}/products/${productId}`);
        console.log('  ✅ Get single product:', response.status === 200 ? 'PASS' : 'FAIL');
      } catch (error) {
        console.log('  ❌ Get single product: FAIL -', error.response?.data?.message || error.message);
      }

      try {
        const response = await axios.get(`${ADMIN_URL}/products/${productId}`);
        console.log('  ✅ Admin get single product:', response.status === 200 ? 'PASS' : 'FAIL');
      } catch (error) {
        console.log('  ❌ Admin get single product: FAIL -', error.response?.data?.message || error.message);
      }
    }
  }

  async testCoupons() {
    console.log('\n🎫 Testing Coupons...');
    
    const testCoupon = {
      code: 'TEST10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 50,
      maxUses: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    // Admin: Create coupon
    try {
      const response = await axios.post(`${ADMIN_URL}/coupons`, testCoupon);
      console.log('  ✅ Admin create coupon:', response.status === 201 ? 'PASS' : 'FAIL');
      if (response.data.data) {
        this.createdIds.coupons.push(response.data.data._id);
      }
    } catch (error) {
      console.log('  ❌ Admin create coupon: FAIL -', error.response?.data?.message || error.message);
    }

    // Admin: Get all coupons
    try {
      const response = await axios.get(`${ADMIN_URL}/coupons`);
      console.log('  ✅ Admin get coupons:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Admin get coupons: FAIL -', error.response?.data?.message || error.message);
    }

    // Validate coupon
    try {
      const response = await axios.post(`${BASE_URL}/coupons/validate`, {
        code: 'TEST10',
        orderAmount: 100
      });
      console.log('  ✅ Validate coupon:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Validate coupon: FAIL -', error.response?.data?.message || error.message);
    }
  }

  async testAnalytics() {
    console.log('\n📊 Testing Analytics...');
    
    // Dashboard overview
    try {
      const response = await axios.get(`${ADMIN_URL}/analytics/dashboard`);
      console.log('  ✅ Dashboard analytics:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Dashboard analytics: FAIL -', error.response?.data?.message || error.message);
    }

    // Sales analytics
    try {
      const response = await axios.get(`${ADMIN_URL}/analytics/sales`);
      console.log('  ✅ Sales analytics:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Sales analytics: FAIL -', error.response?.data?.message || error.message);
    }

    // Product analytics
    try {
      const response = await axios.get(`${ADMIN_URL}/analytics/products`);
      console.log('  ✅ Product analytics:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('  ❌ Product analytics: FAIL -', error.response?.data?.message || error.message);
    }
  }
}

// Run the tests
const tester = new ECommerceAPITester();
tester.runTests();
