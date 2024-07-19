const { Booking, LibStudent } = require('../models/student');
const { createOrder,verifyPaymentSignature } = require("../routes/payment");
const getCurrentMonthBookings = async (req, res) => {
    try {
        // Fetch all booking data
        const bookings = await Booking.find({}, 'seat status shift'); // Fetch all fields
        // console.log(bookings)
        // Transform the data into an object with Shift as key and array of objects as value
        const bookingsByShift = bookings.reduce((acc, booking) => {
            const { seat, status, shift } = booking;
            if (!acc[shift]) {
                acc[shift] = [];
            }
            acc[shift].push({ seat, status });
            return acc;
        }, {});

        // console.log(bookingsByShift);

        // Send the transformed data as a response
        res.status(200).json(bookingsByShift);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};
const eligibleForRegistration = async (req, res) => {
    const { user_id } = req.params;
    try {
        // Check if any booking data exists for the user_id
        // console.log(user_id)
        const bookingsCount = await LibStudent.countDocuments({ userId: user_id });

        // If bookingsCount > 0, user is not eligible (send false), otherwise user is eligible (send true)
        const eligible = bookingsCount === 0;
        // console.log(eligible,bookingsCount)
        res.status(200).json({ eligible });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ message: 'Failed to check eligibility' });
    }
};



const getStudentLibSeat = async (req, res) => {

    const { id } = req.params;
    // console.log(id,"id")
    try {
        // First, find the student in LibStudent collection
       
        const student = await LibStudent.findOne({ userId: id });
        // console.log(student)
        if (!student) {
            return res.status(404).json({ error: 'Student not found in LibStudent collection' });
        }

        // If student is found, find and update the corresponding booking
        const findBooking = await Booking.findOne(
            { reg: student.reg }
        );
        // console.log(findBooking,student.reg,"found user booking")
        if (!findBooking) {
            return res.status(404).json({ error: 'Booking not found for this student' });
        }

        res.status(200).json({
            message: 'Status updated successfully',
            booking: findBooking,

        });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};



const getLibStudentData = async (req, res) => {
    const { reg } = req.params;
    
console.log(reg)
   
    // console.log(id,"id")
    try {
        // First, find the student in LibStudent collection

        const student = await LibStudent.findOne({ reg }).select("name shift");
        // console.log(student)
        if (!student) {
            return res.status(404).json({ error: 'Student not found in LibStudent collection' });
        }

        // If student is found, find and update the corresponding booking
      
        // console.log(findBooking,student.reg,"found user booking")
      
console.log(student)
        res.status(200).json({
            message: 'Student sent successfully',
           student:student

        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

const verifyLibfeePayment = async (req, res) => {
    const { order_id, payment_id, signature, amount,formData } = req.body;
    const { user_id } = req.params; // Capture user ID from URL parameters
    console.log(formData)
    const { name, shift, reg, online, fee, advancePaymentPeriod } = formData;
  
    // Verify the payment signature
    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);
    console.log(isSignatureValid, "payment verify");

    if (isSignatureValid) {
        try {
            // Find the user in the LibStudent collection by userId
            const user = await LibStudent.findOne({ userId: user_id });
            console.log(user)
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Add Razorpay order ID and payment ID to the user record
           

            // Save the updated user record
          

            // Find and update an existing booking, or create a new booking if it doesn't exist
            const currentDate = new Date();

            const formattedDate = currentDate.toISOString().split('T')[0];
 // Use current date as needed
          
             


            const updatedBooking = await Booking.findOneAndUpdate(
                { reg },
                {
                    reg,
                    name,
                    shift,
                    Online: fee,
                    date: formattedDate,
                    fee,
                    TotalMoney: fee, // Use existing cash value if available
                    DueOrAdvance: advancePaymentPeriod,
                    'Payment_detail.razorpay_order_id': order_id,
                    'Payment_detail.razorpay_payment_id': payment_id
                },

                { new: true }
            );

            console.log(updatedBooking);
          
            res.status(200).json({ success: true, message: 'Payment verified successfully', booking: updatedBooking });
        } catch (error) {
            console.error("Error updating student record:", error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        // Signature does not match, payment is not verified
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
};

const sendFeeData = async (req, res) => {
    const { reg,name ,shift,amount} = req.body;
    // console.log(req.body);
    console.log(req.body,"kkkkk");
  
        // Generate Razorpay order first
        const order = await createOrder(amount);
        console.log(order)
        // Create user with the order ID
        // const user = await Booking.create({
        //     consent,
        //     reg,
        //     userId,
        //     name,
        //     email,
        //     shift,
        //     mobile,
        //     address,
        //     amount,
        //     image: {
        //         publicId: imageData.publicId,
        //         url: imageData.url,
        //     }, Payment_detail: {
        //         razorpay_order_id: order.id,
        //         razorpay_payment_id: "" // Payment ID will be updated after payment verification
        //     }
        // });

        // console.log(user);

        res.status(200).json({
            success: true,
            order,
         
            key: process.env.KEY_ID_RZRPAY
        });
    } 
// Route integration




const feePayment = async (req, res) => {
    try {
        const { reg, month, fee, amount, seat, shift, DueOrAdvance } = req.body;
        const id = req.user._id;
        console.log(id);

        // Find the student record
        const student = await LibStudent.findOne({ userId: id });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Generate Razorpay order first
        const order = await createOrder(amount);
        console.log(order);

        // Get the current date
        const currentDate = new Date();

        // Update the booking entry with the order ID
        const updatedBooking = await Booking.findOneAndUpdate(
            { userId: student._id },
            {
                reg,
                name: student.name,
              
                shift,
                amount,
                online: amount,
                date: currentDate,
                DueOrAdvance// Add the current date to the details
            },
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            order,
            user: updatedBooking,
            key: process.env.KEY_ID_RZRPAY
        });
    } catch (error) {
        console.error("Error creating user or processing payment:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};



// routes/feeRoutes.js



module.exports = {
    getCurrentMonthBookings,
    eligibleForRegistration,
    getStudentLibSeat,
    feePayment,
   verifyLibfeePayment,
    getLibStudentData,
    sendFeeData
};
