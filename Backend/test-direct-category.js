const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Category = require('./src/models/Category');

async function testCategoryDirectly() {
    try {
        console.log('Testing category creation directly...');
        
        const categoryData = {
            name: 'Test Electronics Direct',
            description: 'Electronics and gadgets for testing',
            slug: 'test-electronics-direct'
        };
        
        const category = new Category(categoryData);
        console.log('Category before save:', category);
        
        await category.save();
        console.log('✅ Category created successfully!');
        console.log('Created category:', category);
        
    } catch (error) {
        console.log('❌ Category creation failed:', error.message);
        console.log('Full error:', error);
    }
    
    mongoose.connection.close();
}

testCategoryDirectly();
