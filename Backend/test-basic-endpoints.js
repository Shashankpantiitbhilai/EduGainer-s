const axios = require('axios');

const BASE_URL = 'http://localhost:8000/ecommerce';

async function testBasicEndpoints() {
    console.log('🚀 Testing Basic E-Commerce Endpoints (No Auth Required)\n');

    // Test health endpoint
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
        console.log('❌ Health check: FAIL -', error.message);
    }

    // Test get categories
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        console.log('✅ Get categories:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
        console.log('❌ Get categories: FAIL -', error.response?.data?.message || error.message);
    }

    // Test create category (no auth required for testing)
    try {
        const testCategory = {
            name: `Test Electronics ${Date.now()}`,
            description: 'Electronics and gadgets for testing'
        };
        const response = await axios.post(`${BASE_URL}/categories`, testCategory);
        console.log('✅ Create category:', response.status === 201 ? 'PASS' : 'FAIL');
        
        if (response.data.data) {
            console.log('  Created category ID:', response.data.data._id);
            
            // Test get single category
            try {
                const getCatResponse = await axios.get(`${BASE_URL}/categories/${response.data.data._id}`);
                console.log('✅ Get single category:', getCatResponse.status === 200 ? 'PASS' : 'FAIL');
            } catch (error) {
                console.log('❌ Get single category: FAIL -', error.response?.data?.message || error.message);
            }
        }
    } catch (error) {
        console.log('❌ Create category: FAIL -', error.response?.data?.message || error.message);
        if (error.response?.data?.error) {
            console.log('  Error details:', error.response.data.error);
        }
    }

    // Test get products
    try {
        const response = await axios.get(`${BASE_URL}/products`);
        console.log('✅ Get products:', response.status === 200 ? 'PASS' : 'FAIL');
    } catch (error) {
        console.log('❌ Get products: FAIL -', error.response?.data?.message || error.message);
    }

    // Test validate coupon (with no coupon existing)
    try {
        const response = await axios.post(`${BASE_URL}/coupons/validate`, {
            code: 'NONEXISTENT',
            orderAmount: 100
        });
        console.log('✅ Validate non-existent coupon:', response.status === 404 ? 'PASS' : 'FAIL');
    } catch (error) {
        if (error.response?.status === 404) {
            console.log('✅ Validate non-existent coupon: PASS (404 expected)');
        } else {
            console.log('❌ Validate coupon: FAIL -', error.response?.data?.message || error.message);
        }
    }

    console.log('\n✅ Basic endpoint tests completed!');
}

testBasicEndpoints();
