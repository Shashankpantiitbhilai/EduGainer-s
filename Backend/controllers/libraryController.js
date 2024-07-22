const { LibStudent } = require('../models/student');
const { createOrder, verifyPaymentSignature } = require("../routes/payment");
const { getModelForMonth } = require('../models/student'); // Assume the function is defined in utils/modelUtils.js
const getCurrentMonthBookingModel = () => {
    const now = new Date();
    return getModelForMonth(now.getMonth() + 1);
};

const getCurrentMonthBookings = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;

        const Booking = getModelForMonth(currentMonth);
    
        const bookings = await Booking.find({}, 'seat status shift');
        const bookingsByShift = bookings.reduce((acc, booking) => {
            const { seat, status, shift } = booking;
            if (!acc[shift]) {
                acc[shift] = [];
            }
            acc[shift].push({ seat, status });
            return acc;
        }, {});

        res.status(200).json(bookingsByShift);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const eligibleForRegistration = async (req, res) => {
    const { user_id } = req.params;
    try {
        const bookingsCount = await LibStudent.countDocuments({ userId: user_id });
        const eligible = bookingsCount === 0;
        res.status(200).json({ eligible });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ message: 'Failed to check eligibility' });
    }
};

const getStudentLibSeat = async (req, res) => {
    const { id } = req.params;
    try {
        const currentMonth = new Date().getMonth() + 1;

        const Booking = getModelForMonth(currentMonth);

        const student = await LibStudent.findOne({ userId: id });
        if (!student) {
            return res.status(404).json({ error: 'Student not found in LibStudent collection' });
        }
       
        const findBooking = await Booking.findOne({ reg: student.reg });
        if (!findBooking) {
            return res.status(404).json({ error: 'Booking not found for this student' });
        }
       

        res.status(200).json({
            message: 'Student found monthly sheet successfully',
            booking: findBooking,
        });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};
const getLibStudentData = async (req, res) => {
    const { reg } = req.params;
    try {
        const currentMonth = new Date().getMonth() + 1;

        const Booking = getModelForMonth(currentMonth);

        // Try to find the student in the Booking collection
        const bookingData = await Booking.findOne({ reg }).select('name shift due advance');
     
        if (bookingData) {
            // If student is found in Booking, respond with their details
            res.status(200).json({
                message: 'Student sent successfully',
                student: {
                    name: bookingData.name,
                    shift: bookingData.shift,
                    due: bookingData.due,
                    advance: bookingData.advance,
                },
            });
        } else {
            // If student is not found in Booking, find them in LibStudent
            const student = await LibStudent.findOne({ reg }).select('name shift');

            if (!student) {
                return res.status(404).json({ error: 'Student not found in LibStudent collection' });
            }

            res.status(200).json({
                message: 'Student sent successfully',
                student: {
                    name: student.name,
                    shift: student.shift,
                    due: 0,
                    advance: 0,
                },
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};


const verifyLibfeePayment = async (req, res) => {
    const { order_id, payment_id, signature, formData } = req.body;
   
    const { user_id } = req.params;
    const { name, shift, reg, fee, advancePaymentPeriod } = formData;
    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);

    if (isSignatureValid) {
        try {
            const currentMonth = new Date().getMonth() + 1;

            const Booking = getModelForMonth(currentMonth);

            const user = await LibStudent.findOne({ userId: user_id });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            const currentDate = new Date().toISOString().split('T')[0];
            const updatedBooking = await Booking.findOneAndUpdate(
                { reg },
                {
                    reg,
                    name,
                    shift,
                    Online: fee,
                    date: currentDate,
                    fee,

                    remarks: advancePaymentPeriod,
                    status: "Paid",
                    'Payment_detail.razorpay_order_id': order_id,
                    'Payment_detail.razorpay_payment_id': payment_id
                },
                { new: true, upsert: true }
            );
       
            res.status(200).json({ success: true, message: 'Payment verified successfully', booking: updatedBooking });
        } catch (error) {
            console.error("Error updating student record:", error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
};

const sendFeeData = async (req, res) => {
    const {  amount } = req.body;
    try {
        const order = await createOrder(amount);
        res.status(200).json({
            success: true,
            order,
            key: process.env.KEY_ID_RZRPAY
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};

// const feePayment = async (req, res) => {
//     try {
//         const { reg, month, fee, amount, seat, shift, DueOrAdvance } = req.body;
//         const id = req.user._id;

//         const student = await LibStudent.findOne({ userId: id });
//         if (!student) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         const currentMonth = new Date().getMonth() + 1;

//         const Booking = getModelForMonth(currentMonth);

//         const order = await createOrder(amount);
//         const currentDate = new Date();

//         const updatedBooking = await Booking.findOneAndUpdate(
//             { reg: student.reg },
//             {
//                 reg,
//                 name: student.name,
//                 shift,
//                 amount,
//                 online: amount,
//                 date: currentDate,
//                 DueOrAdvance
//             },
//             { new: true,upsert:true }
//         );

//         if (!updatedBooking) {
//             return res.status(404).json({ error: "Booking not found" });
//         }

//         res.status(200).json({
//             success: true,
//             order,
//             user: updatedBooking,
//             key: process.env.KEY_ID_RZRPAY
//         });
//     } catch (error) {
//         console.error("Error creating user or processing payment:", error);
//         res.status(500).json({ error: "A server error occurred with this request" });
//     }
// };
const updateNotificationStatus = async (req, res) => {
    const { reg } = req.params;

    try {
        const BookingModel = getCurrentMonthBookingModel();
      
       
        const updatedBooking = await BookingModel.findOneAndUpdate(
            { reg },
            { status: "Confirmed" },
            {new:true}
           
        );
      
        // Find the booking by reg
        //   const booking=await BookingModel.findOne({reg})

        //     if (!booking) {
        //         return res.status(404).json({ error: 'Booking not found' });
        //     }

      
        return res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
        // console.log(updatedBooking,"kkkkkkkkkkkkkk")

    }


      

    
    catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
}


module.exports = {
    getCurrentMonthBookings,
    eligibleForRegistration,
    getStudentLibSeat,
    // feePayment,
    verifyLibfeePayment,
    getLibStudentData,
    sendFeeData,
    updateNotificationStatus
};
