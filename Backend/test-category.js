const axios = require('axios');

async function testCategoryCreation() {
    try {
        const testCategory = {
            name: 'Test Electronics',
            description: 'Electronics and gadgets for testing'
        };
        
        const response = await axios.post('http://localhost:8000/ecommerce/categories', testCategory, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Category created successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Category creation failed');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testCategoryCreation();
