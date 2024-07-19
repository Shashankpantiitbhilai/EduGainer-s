const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

// Define the user schema
const userSchema = new mongoose.Schema({
  strategy: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  photoUpload: {
    type: String, // Adjust type as per your requirement (String for URL or Buffer for storing binary data)
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Define roles as needed
    default: "user", // Default role if not specified
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Define the library student schema
const libStudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name: { type: String },
  reg: { type: String },
  email: { type: String },
  amount: { type: String },
  address: { type: String },
  shift: { type: String },
  image: {
    publicId: { type: String },
    url: { type: String },
  },
  Payment_detail: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  gender: { type: String },
  dob: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  contact1: { type: String },
  contact2: { type: String },
  aadhaar: { type: String },
  examPreparation: { type: String },
  consent: { type: String, default: "Agreed" }
});

// Define the class schema
const classesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  Batch: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  image: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  Payment_detail: {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: false, // This will be updated after payment verification
    }
  }
});

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LibStudent', // Reference to the LibStudent model
  },
  due: { type: Number, default: 0 },
  receipt: { type: String },
  advance: { type: Number, default: 0 },
  reg: { type: String },
  name: { type: String, default: '' },
  seat: { type: String },
  date: { type: String },
  cash: { type: String, default: 0 },
  TotalMoney: { type: String },
  
  online: { type: String, default: 0 },
  shift: { type: String, default: '' },
  fee: { type: String, default: 0 },
  remarks: { type: String, default: '' },
  Payment_detail: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String, required: false },
  },
  status: { type: String, default: '' },
  colors: { type: Map, of: String, default: {} }
});

// Function to get the model for a specific month
const getModelForMonth = (month) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const collectionName = `${monthNames[month - 1]}`;
  return mongoose.model(collectionName, bookingSchema);
};

// Export all models and the getModelForMonth function
module.exports = {
  User: mongoose.model('User', userSchema),
  LibStudent: mongoose.model('LibStudent', libStudentSchema),
  Class: mongoose.model('Class', classesSchema),
  getModelForMonth // Export the function directly
};