const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    // Choose MongoDB URI based on environment
    const connectURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI_DEV;

    console.log(`Connecting to MongoDB in ${process.env.NODE_ENV} mode...`);
    console.log(`Connection URI: ${connectURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    console.log(`Database name: ${connectURI.split('/').pop().split('?')[0]}`);
console.log(connectURI)
    await mongoose.connect(connectURI, {
      useNewUrlParser: true, // Parses connection strings correctly
      useUnifiedTopology: true, // Handles server discovery and monitoring
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds if no server is available
    });

    console.log("MongoDB Connected successfully.");
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
 
    // Note: CSV imports are handled separately and can be called as needed
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

const closeDB = () => {
  mongoose.connection.close()
    .then(() => {
      console.log('MongoDB connection closed');
    })
    .catch((err) => {
      console.error('Error while closing MongoDB connection:', err);
    });
};

module.exports = { connectDB, closeDB };
