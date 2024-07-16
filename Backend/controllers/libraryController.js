const { Booking, LibStudent } = require('../models/student');

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
        const bookingsCount = await LibStudent.countDocuments({ userId:user_id });

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


module.exports = {
    getCurrentMonthBookings,
    eligibleForRegistration,
    getStudentLibSeat
};
