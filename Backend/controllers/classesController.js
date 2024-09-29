const { LibStudent } = require("../models/student");
const { AdminClass, ClassReg } = require("../models/classes");
const { uploadToCloudinary } = require("../cloudinary");
const { createOrder, verifyPaymentSignature } = require("../routes/payment");

const getStudentDetails = async (req, res) => {
    const { id, classId } = req.params; // Get userId from the request body

    try {
        // Fetch the LibStudent details based on userId
        const libStudent = await LibStudent.findOne({ userId: id });
        console.log(libStudent, id)
        const { amount } = await AdminClass.findOne({
            _id: classId
        });
        console.log(amount,"amount");
        console.log(libStudent)
        // Check if the LibStudent record exists
        

        // Send the required details from the LibStudent schema
        res.status(200).json({
            success: true,
            fee: amount,
            studentDetails: {
                name: libStudent?.name,
                reg: libStudent?.reg,
                email: libStudent?.email,
                address: libStudent?.address,
                gender: libStudent?.gender,
                dob: libStudent?.dob,
                fatherName: libStudent?.fatherName,
                motherName: libStudent?.motherName,
                contact1: libStudent?.contact1,
                contact2: libStudent?.contact2,
                aadhaar: libStudent?.aadhaar,
                examPreparation: libStudent?.examPreparation,
                image: {
                    url: libStudent?.image?.url, // The image URL
                    public_id: libStudent?.image?.public_id // The public ID of the image
                },
            }
        });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ success: false, error: "Failed to fetch student details" });
    }
};

const getClassStudentById = async (req, res) => {
    try {
        // Fetch the ID from req.params
        const { id } = req.params;
        console.log(id)
        // Find the class registration by ID
        const classRegistration = await ClassReg.findOne({ userId: id });
console.log(classRegistration)
        // Check if the class registration was found
        if (!classRegistration) {
            return res.status(404).json({ message: 'Class registration not found' });
        }

        // Send the class registration data to the client
        res.status(200).json(classRegistration);
    } catch (error) {
        // Handle any errors that occur
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const paymentVerification = async (req, res) => {
    const { order_id, payment_id, signature, formData } = req.body;

    const {
        name, email,standard, subject, board, Batch,faculty,
        school, dob, father, mother, contact1, contact2,
        address, aadharNo, preparingForExam, image
    } = formData;

    const { user_id } = req.params;
    const currentDate = new Date().toISOString().split('T')[0];

    try {
        // Verify the payment signature
        const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);

        if (isSignatureValid) {
            try {
                // Create new ClassReg document
                const newClassReg = new ClassReg({
                    userId:user_id,
                    name,
                    email,
                    date:currentDate,
class:standard,
                    subject,
                    board,
                    faculty,
                    school,
                    dob,
                    father,
                    mother,
                    contact1,
                    contact2,
                    address,
                    aadharNo,
                    preparingForExam,
                    Payment_detail: {
                        razorpay_order_id: order_id,
                        razorpay_payment_id: payment_id
                    },
                    image: {} // Will be updated after image upload
                });

                // Upload image if it exists
                if (image) {
                    const results = await uploadToCloudinary(image, "Class_Registrations");
                    newClassReg.image.publicId = results.publicId;
                    newClassReg.image.url = results.url;
                }

                // Save the class registration document
                const savedClassReg = await newClassReg.save();

                // Access the ID of the saved document
                const classRegId = savedClassReg._id;
                await newClassReg.save();
                let adminClass = await AdminClass.findOne({ _id: Batch });

                if (!adminClass) {
                    return res.status(404).json({ message: 'Batch not found' });
                }

                // Add the userId to the studentIds array if it's not already there
                if (!adminClass.studentIds.includes(user_id)) {
                    adminClass.studentIds.push(classRegId);
                    await adminClass.save(); // Save changes to the database
                } else {
                    return res.status(400).json({ message: 'User already enrolled in the batch' });
                }
                res.status(200).json({
                    success: true,
                    message: 'Payment verified, class registration created successfully',
                    data: newClassReg
                });
            } catch (error) {
                console.error("Error creating class registration:", error);
                res.status(500).json({ success: false, error: 'Internal server error' });
            }
        } else {
            // Signature does not match, payment is not verified
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error("Error in payment verification process:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const order = async (req, res) => {
    console.log("jiii")
    const { amount } = req.body;
    try {
        const order = await createOrder(amount)
        // console.log(user);

        res.status(200).json({
            success: true,
            order,

            key: process.env.KEY_ID_RZRPAY
        });
    } catch (error) {
        console.error("Error creating user or processing payment:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
}
const createClassRegistration = async (req, res) => {
    const { name, email, image, mobile, Batch, address, amount, userId } = req.body;
    console.log(Batch, req.body);
    try {
        let imageData = {};
        if (image) {
            const results = await uploadToCloudinary(image, "Class_Students");
            imageData = results;
        }

        // Generate Razorpay order first
        const order = await createOrder(amount);

        // Create user with the order ID
        const user = await Class.create({
            userId,
            name,
            email,
            Batch,
            mobile,
            address,
            amount,
            image: {
                publicId: imageData.publicId,
                url: imageData.url,
            },
            Payment_detail: {
                razorpay_order_id: order.id,
                razorpay_payment_id: "" // Payment ID will be updated after payment verification
            }
        });

        console.log(user);

        res.status(200).json({
            success: true,
            order,
            user,
            key: process.env.KEY_ID_RZRPAY
        });
    } catch (error) {
        console.error("Error creating user or processing payment:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id, req.params);

    try {
        const user = await Class.findOne({ userId: user_id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};

const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const { user_id } = req.params;
    console.log(user_id, "paymentverify");

    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);
    console.log(isSignatureValid, "payment verify");
    if (isSignatureValid) {
        try {
            const user = await Class.findOne({ userId: user_id });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            user.Payment_detail.razorpay_order_id = order_id;
            user.Payment_detail.razorpay_payment_id = payment_id;

            await user.save();
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } catch (error) {
            console.error("Error updating student record:", error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
}



const checkEligibility = async (req, res) => {
    const { user_id } = req.body;
    const { classId } = req.params; // Assuming you're passing the classId in the request params
    console.log(req.body, "ppppppppppppppp", classId)
    try {
        // Find the class by its ID
        const classData = await AdminClass.findById(classId);

        if (!classData) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Check if the user_id exists in the studentIds array
        const isEligible = !classData.studentIds.includes(user_id);

        if (isEligible) {
            res.status(200).json({ eligible: true, message: "Student is eligible for registration" });
        } else {
            res.status(200).json({ eligible: false, message: "Student is already registered for this class" });
        }

    } catch (error) {
        console.error("Error checking eligibility:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {

    getClassStudentById, paymentVerification, verifyPayment, getUserById,  checkEligibility, getStudentDetails, order
}
// Other controller functions for generating and sending PDFs, handling updates, etc.
