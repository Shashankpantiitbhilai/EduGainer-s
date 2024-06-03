const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate");

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

// Define submodels for different 'pos_res' types


const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  shift: {
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
}

);



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
}

);




const User = mongoose.model("user", userSchema);
const Student = mongoose.model("Student", studentSchema);
const Class = mongoose.model("Class", classesSchema);

module.exports = {
  Student,
Class,
  User,
};
