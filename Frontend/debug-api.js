const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing categories API...');
    const response = await axios.get('http://localhost:8000/ecommerce/categories');
    console.log('Status:', response.status);
    console.log('Response data structure:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }
  }
}

testAPI();
