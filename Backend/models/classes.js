const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for admin class
const BatchSchema = new Schema({
    name: {
        type: String,
        // Ensure name is provided
        unique: true     // Ensure name is unique
    },
    duration: {
        type: String,
        // Ensure duration is provided
    },
    facultyName: {
        type: String,
        // Ensure faculty name is provided
    },
    description: {
        type: String,
        // Ensure description is provided
    },
    timing: {
        type: String,     // Format as per your needs, e.g., 'Monday 10:00 - 12:00'
        // Ensure timing is provided
    },
    contents: {
        type: [String],   // Array of strings to list the contents of the class

    }, image: {
        publicId: {
            type: String,

        },
        url: {
            type: String,

        }
    },
    additionalDetails: {
        type: String      // Additional information (optional)
    }
    ,
    amount: {
        type: Number
    },
    studentIds: [{
        type: Schema.Types.ObjectId,  // Use ObjectId to reference another model
        ref: 'ClassReg',              // Reference the ClassReg model
    }]
});
const ClassRegSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model

    },
    name: {
        type: String,
        // Ensure name is provided
    },
    amount: {
        type: Number,

    },
    reg: {
        type: String,
        // Ensure registration number is provided
        // Ensure registration number is unique
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],  // Options for gender

    },
    class: {
        type: String,
        // Ensure class is provided
    },
    subject: {
        type: String,
        // Ensure subject is provided
    },
    board: {
        type: String,
        // Ensure board (e.g., CBSE, ICSE) is provided
    },
    faculty: {
        type: String,
        // Ensure faculty name is provided
    },
    school: {
        type: String,
        // Ensure school name is provided
    },
    dob: {
        type: Date,
        // Ensure date of birth is provided
    },
    fatherName: {
        type: String,
        // Ensure father's name is provided
    },
    motherName: {
        type: String,
        // Ensure mother's name is provided
    },
    contact1: {
        type: String,
        // Ensure primary contact number is provided
    },
    contact2: {
        type: String    // Optional secondary contact number
    },
    address: {
        type: String,
        // Ensure address is provided
    },
    date: {
        type: String,
    },
    aadharNo: {
        type: String,
        // Ensure Aadhar number is provided
        unique: true    // Ensure Aadhar number is unique
    },
    preparingForExam: {
        type: String    // Exam the student is preparing for (optional)
    },
    email: {
        type: String,
        // Ensure email is provided
        // Ensure email is unique
    },
    image: {
        publicId: {
            type: String,

        },
        url: {
            type: String,

        }
    },
    Payment_detail: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
    },
    Consent: {
        type: String,
        default: "Agreed"
    }

});

// Create and export model based on schema
const ClassReg = mongoose.model('ClassReg', ClassRegSchema);

// Create and export model based on schema
const AdminClass = mongoose.model('AdminClass', BatchSchema);

module.exports = {
    AdminClass,
    ClassReg
};
