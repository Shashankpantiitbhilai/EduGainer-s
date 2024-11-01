const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

// Define the user schema


// Define the user schema
const userSchema = new mongoose.Schema({
  strategy: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
   
  },
  lastName: {
    type: String,
   
  },
  address: {
    type: String,
   
  },
  bio: {
    type: String,
   
  },
  photoUpload: {
    type: String, // Adjust type as per your requirement
   
  },
  role: {
    type: String,
    enum: ["user", "admin", "employee"], // Added "employee" role
    default: "user",
    required: true,
  },

  status: {
    type: String,
    default: "active",
  },
  // Change refAccount to an array to hold multiple sub-account IDs
  refAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to other user documents
  }],
  isTeamAccount: {
    type: Boolean,
    default: false, // Default to false for sub-accounts
  }
});

// Apply plugins


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const libStudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  
  },
  name: { type: String },
  reg: { type: String, unique: true }, // Make reg field unique
  email: { type: String },
  amount: { type: Number ,default:0},
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
  
  lastfeedate: {
    type: String
  },
  gender: { type: String },
  dob: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  contact1: { type: String },
  Mode: {
    type: String,
    default: "offline"
  },
  contact2: { type: String },
  aadhaar: { type: String },
  examPreparation: { type: String },
  consent: { type: String, default: "Agreed" }
});

libStudentSchema.pre('save', async function (next) {
  if (this.isNew && this.Mode === 'Online') {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'studentReg' }, // Find the counter with name 'studentReg'
        { $inc: { seq: 1 } }, // Increment the seq field by 1
        { new: true, upsert: true } // Create the document if it doesn't exist
      );
      this.reg = `EDULUK${counter.seq}`; // Assign the incremented seq value to reg
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
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
      // This will be updated after payment verification
    }
  }
});

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LibStudent', // Reference to the LibStudent model
  },
  reg: {
    type: String,
    required: true, // Ensure the reg field is provided
  },
  due: { type: Number, default: 0 },
  receipt: { type: String },
  advance: { type: Number, default: 0 },

  name: { type: String},
  seat: { type: String },
  date: { type: String },
  cash: { type: Number, default: 0 },
 
  website: {
    type: Number,
    default: 0
   },
  TotalMoney: {
    type: Number,
    default: 0
  },
  regFee: {
    type: Number,
    default:0
  },
  online: { type: Number, default: 0 },
  shift: { type: String, default: '' },
 
  remarks: { type: String, default: '' },
  Payment_detail: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String, required: false },
  },
  status: { type: String, default: '' },
  nextMonthStatus:{
    type: String,
  },
  colors: { type: Map, of: String, default: {} }
});
bookingSchema.pre('save', async function (next) {
  try {
    // Ensure advance and due are numbers
    console.log(this.advance, this.due, this.fee);
    const website = this.website;
    const online = this.online;
    const cash = this.cash;
    const regFee = this.regFee;
    this.TotalMoney = website+cash+online+regFee;

    // Verify if the reg field corresponds to a LibStudent reg
    const libStudent = await mongoose.model('LibStudent').findOne({ reg: this.reg });
    if (!libStudent) {
      const err = new Error('Invalid reg reference');
      return next(err);
    }

    next();
  } catch (err) {
    next(err);
  }
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