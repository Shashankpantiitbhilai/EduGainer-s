const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for Budget
const BudgetSchema = new Schema({
    date: {
        type: Date,
         // Ensure date is provided
        default: Date.now // Default to the current date
    },
    totalCash: {
        type: Number,
         // Ensure total cash is provided
       default:0          // Ensure total cash is non-negative
    },
    website: {
        type: String,
         // Ensure website is provided
        default: 0       // Trim whitespace
    },
  Diary: {
        type: String,
         // Ensure online diary is provided
        default: 0      // Trim whitespace
    },
    
    expenses: {
        type: Number,
         // Ensure expenses are provided
        default: 0           // Ensure the expenses are non-negative
    },
    Online: {
        type: Number,
        default:0
    }
});

// Create and export the Budget model
const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = { Budget };
