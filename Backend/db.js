const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const connectDB = async () => {
  try {
    const connectDB = async () => {
      const connectURI = process.env.MONGODB_URI;

      await mongoose.connect(connectURI, {
        useNewUrlParser: true, // Parses connection strings correctly
        useUnifiedTopology: true, // Handles server discovery and monitoring
        serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds if no server is available
      });

      console.log("MongoDB Connected successfully.");
    };
    await connectDB();
 
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