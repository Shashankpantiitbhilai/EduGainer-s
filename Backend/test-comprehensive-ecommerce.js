const axios = require('axios');

const BASE_URL = 'http://localhost:8000/ecommerce';
const ADMIN_URL = 'http://localhost:8000/ecommerce/admin';

class ComprehensiveECommerceAPITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      details: []
    };
    this.createdIds = {
      categories: [],
      products: [],
      coupons: []
    };
  }

  async testEndpoint(name, testFunction) {
    try {
      await testFunction();
      this.results.passed++;
      this.results.details.push(`✅ ${name}: PASS`);
      console.log(`✅ ${name}: PASS`);
    } catch (error) {
      this.results.failed++;
      const errorMsg = error.response?.data?.message || error.message;
      this.results.details.push(`❌ ${name}: FAIL - ${errorMsg}`);
      console.log(`❌ ${name}: FAIL - ${errorMsg}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Running Comprehensive E-Commerce API Tests\n');

    // Test Categories
    console.log('📂 Testing Categories...');
    await this.testEndpoint('Get all categories', () => 
      axios.get(`${BASE_URL}/categories`)
    );

    await this.testEndpoint('Create category', async () => {
      const response = await axios.post(`${BASE_URL}/categories`, {
        name: `Test Category ${Date.now()}`,
        description: 'A test category'
      });
      if (response.data.data) {
        this.createdIds.categories.push(response.data.data._id);
      }
    });

    if (this.createdIds.categories.length > 0) {
      const categoryId = this.createdIds.categories[0];
      await this.testEndpoint('Get single category', () =>
        axios.get(`${BASE_URL}/categories/${categoryId}`)
      );

      await this.testEndpoint('Update category', () =>
        axios.put(`${BASE_URL}/categories/${categoryId}`, {
          name: 'Updated Test Category',
          description: 'Updated description'
        })
      );
    }

    // Test Products
    console.log('\n📦 Testing Products...');
    await this.testEndpoint('Get all products', () =>
      axios.get(`${BASE_URL}/products`)
    );

    await this.testEndpoint('Search products', () =>
      axios.get(`${BASE_URL}/products?search=test&limit=5`)
    );

    await this.testEndpoint('Filter products by category', () =>
      axios.get(`${BASE_URL}/products?category=${this.createdIds.categories[0] || '507f1f77bcf86cd799439011'}`)
    );

    // Test Admin Product Management (these will likely fail due to auth)
    console.log('\n🔐 Testing Admin Product Management...');
    await this.testEndpoint('Admin: Get all products', () =>
      axios.get(`${ADMIN_URL}/products`)
    );

    await this.testEndpoint('Admin: Create product', () =>
      axios.post(`${ADMIN_URL}/products`, {
        name: `Test Product ${Date.now()}`,
        description: 'A test product',
        price: { current: 99.99 },
        type: 'physical',
        sku: `TEST-${Date.now()}`,
        category: this.createdIds.categories[0]
      })
    );

    // Test Cart
    console.log('\n🛒 Testing Cart...');
    await this.testEndpoint('Get cart', () =>
      axios.get(`${BASE_URL}/cart`)
    );

    // Test Orders
    console.log('\n📋 Testing Orders...');
    await this.testEndpoint('Get orders', () =>
      axios.get(`${BASE_URL}/orders`)
    );

    // Test Wishlist
    console.log('\n💝 Testing Wishlist...');
    await this.testEndpoint('Get wishlist', () =>
      axios.get(`${BASE_URL}/wishlist`)
    );

    // Test Reviews
    console.log('\n⭐ Testing Reviews...');
    await this.testEndpoint('Get reviews', () =>
      axios.get(`${BASE_URL}/reviews`)
    );

    // Test Coupons
    console.log('\n🎫 Testing Coupons...');
    await this.testEndpoint('Validate non-existent coupon', async () => {
      try {
        await axios.post(`${BASE_URL}/coupons/validate`, {
          code: 'NONEXISTENT',
          orderAmount: 100
        });
      } catch (error) {
        if (error.response?.status === 404) {
          return; // This is expected
        }
        throw error;
      }
    });

    // Test Admin Coupon Management
    console.log('\n🔐 Testing Admin Coupon Management...');
    await this.testEndpoint('Admin: Get all coupons', () =>
      axios.get(`${ADMIN_URL}/coupons`)
    );

    await this.testEndpoint('Admin: Create coupon', () =>
      axios.post(`${ADMIN_URL}/coupons`, {
        code: `TEST${Date.now()}`,
        type: 'percentage',
        value: 10,
        minOrderAmount: 50,
        maxUses: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
    );

    // Test Inventory
    console.log('\n📦 Testing Inventory...');
    await this.testEndpoint('Get inventory overview', () =>
      axios.get(`${BASE_URL}/inventory`)
    );

    // Test Admin Inventory
    await this.testEndpoint('Admin: Get inventory overview', () =>
      axios.get(`${ADMIN_URL}/inventory/overview`)
    );

    // Test Analytics
    console.log('\n📊 Testing Analytics...');
    await this.testEndpoint('Admin: Dashboard analytics', () =>
      axios.get(`${ADMIN_URL}/analytics/dashboard`)
    );

    await this.testEndpoint('Admin: Sales analytics', () =>
      axios.get(`${ADMIN_URL}/analytics/sales`)
    );

    await this.testEndpoint('Admin: Product analytics', () =>
      axios.get(`${ADMIN_URL}/analytics/products`)
    );

    await this.testEndpoint('Admin: Customer analytics', () =>
      axios.get(`${ADMIN_URL}/analytics/customers`)
    );

    await this.testEndpoint('Admin: Revenue analytics', () =>
      axios.get(`${ADMIN_URL}/analytics/revenue`)
    );

    // Test Subscriptions
    console.log('\n💳 Testing Subscriptions...');
    await this.testEndpoint('Get subscription plans', () =>
      axios.get(`${BASE_URL}/subscriptions/plans`)
    );

    // Test Notifications
    console.log('\n🔔 Testing Notifications...');
    await this.testEndpoint('Get notifications', () =>
      axios.get(`${BASE_URL}/notifications`)
    );

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total: ${this.results.passed + this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.details.filter(d => d.startsWith('❌')).forEach(detail => {
        console.log(`  ${detail}`);
      });
    }

    console.log('\n✅ Test completed successfully!');
  }
}

// Run the comprehensive tests
const tester = new ComprehensiveECommerceAPITester();
tester.runAllTests().catch(console.error);
