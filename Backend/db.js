const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const setupChangeStream = require('./models/changeStreamsetup');

const connectDB = async () => {
  try {
    const ConnectDB = `${process.env.MONGODB_URI}`;
    await mongoose.connect(ConnectDB);
    console.log("MongoDB Connected");
    await setupChangeStream();
    console.log("Change streams set up successfully");
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