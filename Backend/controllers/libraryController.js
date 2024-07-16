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



module.exports = {
    getCurrentMonthBookings,
    eligibleForRegistration
};
