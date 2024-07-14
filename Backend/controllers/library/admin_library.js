const { Booking } = require('../../models/student');

const getBookingData = async (req, res) => {
    try {
        // Fetch all booking data
        const bookings = await Booking.find({}); // Fetch all fields

        // Transform the data into an object with Shift as key and array of objects as value


        // console.log(bookings);

        // Send the transformed data as a response
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const updateBookingColor = async (req, res) => {
    const { id, column, color } = req.body;
    // console.log("Request Body:", req.body);

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // console.log("Booking before update:", booking);

        if (!booking.colors) {
            booking.colors = {};
        }

        booking.colors.set(column, color); // Set color as hex string in the Map
        await booking.save();

        const updatedBooking = await Booking.findById(id);
        // console.log("Booking after update:", updatedBooking);

        res.status(200).json({ message: 'Color updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error("Error updating color:", error);
        res.status(500).json({ error: 'Failed to update color' });
    }
};


module.exports = {
    getBookingData,
    updateBookingColor
};
