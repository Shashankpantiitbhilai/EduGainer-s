const { LibStudent, getModelForMonth } = require('../../models/student');

// Helper function to get the current month's Booking model
const getCurrentMonthBookingModel = () => {
    const now = new Date();
    return getModelForMonth(now.getMonth() + 1);
};

const getSeatInfo = async (req, res) => {
    const { seat } = req.params;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const bookings = await BookingModel.find({ seat: seat, status: { $ne: "Left" } })
            .select('name seat shift image reg');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the seat' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const getStudentInfo = async (req, res) => {
    const { reg } = req.params;
    try {
        const student = await LibStudent.findOne({ reg: reg }).select('-_id -__v');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student' });
    }
};

const getBookingData = async (req, res) => {
    const { month } = req.params;
    console.log("Requested month:", month);

    try {
        let BookingModel;
        const year = new Date().getFullYear(); // Use the current year

        if (month && month.toLowerCase() !== 'all') {
            // If a specific month is selected, use the corresponding model
            BookingModel = getModelForMonth(month);
            console.log("Using specific month model:", month);
        } else {
            // If no month is selected or "all" is selected, use the current month's model
            BookingModel = getCurrentMonthBookingModel();
            console.log("Using current month model");
        }

        const bookings = await BookingModel.find({});
        console.log("Fetched bookings:", bookings.length);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const addBookingData = async (req, res) => {
    const { reg, name, seat, date, cash, online, shift, fee, remarks, status ,total,due,advance} = req.body;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const newBooking = new BookingModel({
            reg, name, seat, date, cash, online, shift, fee, remarks, status, total, due, advance
        });
        await newBooking.save();
        res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Failed to add booking' });
    }
};

const updateBookingData = async (req, res) => {
    const { reg, name, seat, date, cash, online, shift, fee, remarks, status, due, advance, receipt, TotalMoney, Payment_detail } = req.body;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const newBooking = await BookingModel.findOneAndUpdate(
            { reg },
            {
                reg,
                name,
                seat,
                date,
                cash,
                online,
                shift,
                fee,
                remarks,
                status,
                due,
                advance,
                receipt,
                TotalMoney,
                Payment_detail,
                
            },
            { new: true }
        );
        console.log(newBooking)
        if (!newBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking updated successfully', booking: newBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking' });
    }
};

const deleteBookingData = async (req, res) => {
    const { id } = req.params;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const deletedBooking = await BookingModel.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
};

const updateBookingColor = async (req, res) => {
    const { id, column, color } = req.body;
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const booking = await BookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (!booking.colors) {
            booking.colors = {};
        }
        booking.colors.set(column, color);
        await booking.save();
        const updatedBooking = await BookingModel.findById(id);
        res.status(200).json({ message: 'Color updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error("Error updating color:", error);
        res.status(500).json({ error: 'Failed to update color' });
    }
};

const updateSeatStatus = async (req, res) => {
    const { reg } = req.params;
    const { seat, status ,shift} = req.body; // assuming these are sent in the request body
console.log(req.body,"jjjjjjjjjjjjjjj")
    try {
        const BookingModel = getCurrentMonthBookingModel();

        // Find the booking by reg
    //   const booking=await BookingModel.findOne({reg})

    //     if (!booking) {
    //         return res.status(404).json({ error: 'Booking not found' });
    //     }

        if (status=="Empty") {
            // If status is empty, delete the booking
            await BookingModel.findOneAndDelete({ reg });
            return res.status(200).json({ message: 'Booking deleted successfully' });
        } else {
            // Update the 

            const currentDate = new Date().toISOString().split('T')[0];
            const student = await LibStudent.findOne({ reg });
            const updatedBooking = await BookingModel.findOneAndUpdate(
                { reg },
                { name:student?.name,seat, reg: reg, status: "Paid",shift ,date:currentDate},
                { new: true ,upsert:true}
            );
console.log(updatedBooking,"kkkkkkkkkkkkkk")
            return res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
        }
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

module.exports = updateSeatStatus;

module.exports = {
    getBookingData,
    updateBookingColor,
    addBookingData,
    updateBookingData,
    deleteBookingData,
    getSeatInfo,
    getStudentInfo,
    updateSeatStatus,
};