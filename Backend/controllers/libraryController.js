const { Booking } = require('../models/student');

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

module.exports = {
    getCurrentMonthBookings
};
