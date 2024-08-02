const { LibStudent } = require('../models/student');
const { createOrder, verifyPaymentSignature } = require("../routes/payment");
const { getModelForMonth } = require('../models/student'); // Assume the function is defined in utils/modelUtils.js
const { ConsoleMessage } = require('puppeteer');
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
// console.log(bookingsByShift,"KKKKKK")
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
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        const Booking = getModelForMonth(currentMonth);

        // Find the student in the LibStudent collection
        const student = await LibStudent.findOne({ reg });

        if (!student) {
            return res.status(404).json({ error: 'Student not found in LibStudent collection' });
        }

        // Function to convert Date to YYYY-MM-DD string
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        // Function to subtract months from a date
        const subtractMonths = (date, months) => {
            const newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() - months);
            return newDate;
        };

        // Check if the student has been inactive for 3 months
        let lastFeeDate, threeMonthsAgo;
        try {
            lastFeeDate = student.lastfeedate ? new Date(student.lastfeedate) : null;
            if (lastFeeDate) {
                lastFeeDate = formatDate(lastFeeDate);
            }
            threeMonthsAgo = formatDate(subtractMonths(currentDate, 3));
        } catch (dateError) {
            console.error("Error processing dates:", dateError);
            return res.status(500).json({ error: 'Error processing date information' });
        }

        const bookingData = await Booking.findOne({ reg }).select('name shift due advance');
       
        if (lastFeeDate && lastFeeDate <= threeMonthsAgo) {

            return res.status(200).json({
                message: 'Student is not active for 3 months straight',
                student: {
                    name: student?.name,
                    email: student?.email,
                    shift: student?.shift,
                    due: bookingData?.due,
                    advance: bookingData?.advance,
                    isActive: false
                }
            });
        }
        // console.log(bookingData, "booking")
        // Try to find the student in the Booking collection

        if (bookingData) {

            // If student is found in Booking, respond with their details
            res.status(200).json({
                message: 'Student sent successfully',
                student: {
                    name: bookingData.name,
                    shift: bookingData.shift,
                    email: student?.email,
                    due: bookingData.due,
                    advance: bookingData.advance,
                    isActive: true
                },
            });
        } else {
            // If student is not found in Booking, use data from LibStudent
            res.status(200).json({
                message: 'Student sent successfully',
                student: {
                    name: student.name,
                    shift: student.shift,
                    email: student?.email,
                    due: 0,
                    advance: 0,
                    isActive: true
                },
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
const verifyLibfeePayment = async (req, res) => {
    const { order_id, payment_id, signature, formData, status } = req.body;
    const { user_id } = req.params;
    const { name, shift, reg, fee, advancePaymentPeriod } = formData;
    console.log(status, "statushs",formData)
    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);

    if (!isSignatureValid) {
        return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    try {
        const currentMonth = new Date().getMonth() + 1;
        const Booking = getModelForMonth(currentMonth);
        const currentDate = new Date().toISOString().split('T')[0];

        if (status === 'Reregistration') {
    
            const student = await Booking.findOneAndUpdate(
                { reg },
                { regFee: fee, name, shift: "NULL", remarks: "Reregistration fee 50 Rs" },
                { new: true ,upsert:true}
            );
            const updateOld = await LibStudent.findOneAndUpdate(
                { reg },
                { lastfeedate: currentDate },
                { new: true }
            );
           
        } else {
            const user = await LibStudent.findOne({ userId: user_id });
            console.log(user)
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            await LibStudent.findOneAndUpdate({ reg }, { lastfeedate: currentDate });

            const updatedBooking = await Booking.findOneAndUpdate(
                { reg },
                {
                    reg,
                    name,
                    shift,
                    website: fee,
                    date: currentDate,
                    fee,
                    remarks: advancePaymentPeriod,
                    status: "Paid",
                    'Payment_detail.razorpay_order_id': order_id,
                    'Payment_detail.razorpay_payment_id': payment_id
                },
                { new: true, upsert: true }
            );

            return res.status(200).json({ success: true, message: 'Payment verified successfully', booking: updatedBooking });
        }

        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error("Error updating student record:", error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const sendFeeData = async (req, res) => {
    const { amount } = req.body;
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
    const { status } = req.body;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        let colorUpdate = {};
        const currentDate = new Date().toISOString().split('T')[0];
        if (status === "Confirmed") {
            colorUpdate = { $set: { [`colors.status`]: "yellow" } };
        } else if (status === "discontinue") {
            colorUpdate = { $set: { [`colors.status`]: "grey" } };
        }

        const updatedBooking = await BookingModel.findOneAndUpdate(
            { reg },
            {
                status,
                ...colorUpdate,
                date: currentDate

            },
            { new: true }

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
