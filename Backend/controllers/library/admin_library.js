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


const addBookingData = async (req, res) => {
    const { reg, name, seat, date, cash, online, shift, fee, remarks, status } = req.body;;

    try {
        // Create a new booking instance
        const newBooking = new Booking({
            reg,
            name,
            seat,
            date,
            cash,
            online,
            shift,
            fee,
            remarks,
            status
        });
console.log(newBooking)
        // Save the new booking to the database
        await newBooking.save();

        // Send a success response
        res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Failed to add booking' });
    }
};

const updateBookingData = async (req, res) => {
    console.log("Request body:", req.body);

    const { reg, name, seat, date, cash, online, shift, fee, remarks, status } = req.body;
    console.log("Reg value from request body:", reg);

    try {
        // Check if the booking exists before updating
        const booking = await Booking.findOne({ reg });
        console.log("Booking found:", booking);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the booking with new data
        const newBooking = await Booking.findOneAndUpdate(
            { reg },
            { reg, name, seat, date, cash, online, shift, fee, remarks, status },
            { new: true } // Return the updated document
        );

        console.log("Updated booking:", newBooking);

        // Check if the booking was found and updated
        if (!newBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Send a success response
        res.status(200).json({ message: 'Booking updated successfully', booking: newBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking' });
    }
};

const deleteBookingData = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the booking by ID and delete it
        const deletedBooking = await Booking.findByIdAndDelete(id);

        // Check if the booking was found and deleted
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Send a success response
        res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
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
    updateBookingColor,
    addBookingData,
    updateBookingData,
    deleteBookingData
};
