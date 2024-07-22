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
        const bookings = await BookingModel.find({ seat: seat, status: { $ne: "Empty" } })
            .select('name seat shift image reg');
console.log(bookings)

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const getStudentInfo = async (req, res) => {
    const { reg } = req.params;
    try {
        const data = await LibStudent.findOne({ reg: reg }).select('-_id -__v').lean();
        const BookingModel = getCurrentMonthBookingModel();
        const bookings = await BookingModel.findOne({ reg })
            .select(' seat shift ').lean();
        const student={...data,...bookings}
     
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
    


    try {
        let BookingModel;
        const year = new Date().getFullYear(); // Use the current year

        if (month && month.toLowerCase() !== 'all') {
            // If a specific month is selected, use the corresponding model
            BookingModel = getModelForMonth(month);
        
        } else {
            // If no month is selected or "all" is selected, use the current month's model
            BookingModel = getCurrentMonthBookingModel();
          
        }

        const bookings = await BookingModel.find({});
       
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const addBookingData = async (req, res) => {
    const { reg, name, seat, date, cash, online, shift, fee, remarks, status, total, due, advance } = req.body;

    try {
        const BookingModel = getCurrentMonthBookingModel();

        let statusColor;
        if (status === "Paid") {
            statusColor = "green";
        } else if (status === "Confirmed") {
            statusColor = "yellow";
        } else {
            statusColor = "red";
        }

        const newBooking = new BookingModel({
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
            total,
            due,
            advance,
            status,
            colors: {
                [status]: statusColor
            }
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

        let colorUpdate = {};
        if (status === "Paid") {
            colorUpdate = { $set: { [`colors.status`]: "green" } };
        } else if (status === "Confirmed") {
            colorUpdate = { $set: { [`colors.status`]: "yellow" } };
        } else {
            colorUpdate = { $set: { [`colors.status`]: "red" } };
        }

        const newBooking = await BookingModel.findOneAndUpdate(
            { reg },
            {
                $set: {
                    reg,
                    name,
                    seat,
                    date,
                    cash,
                    online,
                    shift,
                    status,
                    fee,
                    remarks,
                    due,
                    advance,
                    receipt,
                    TotalMoney,
                    Payment_detail,
                    ...colorUpdate.$set // Ensure color update is properly merged
                }
            },
            { new: true, upsert: true }
        );

       

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
    const { seat, status, shift } = req.body;
  

    try {
        const BookingModel = getCurrentMonthBookingModel();
        const currentDate = new Date().toISOString().split('T')[0];

        if (status === "Empty") {
            await BookingModel.findOneAndDelete({ reg });
            return res.status(200).json({ message: 'Booking deleted successfully' });
        } else if (status === "Paid" || !status) {
            const student = await LibStudent.findOne({ reg });
            const updatedBooking = await BookingModel.findOneAndUpdate(
                { reg },
                {
                    name: student?.name,
                    seat,
                    reg: reg,
                    status: "Paid",
                    shift,
                    date: currentDate,
                    $set: { 'colors.status': 'green' }  // Set color for 'status' column to green
                },
                { new: true, upsert: true }
            );
            return res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
        } else if (status === "Confirmed") {
            const updatedBooking = await BookingModel.findOneAndUpdate(
                { reg },
                {
                    status: "Confirmed",
                    date: currentDate,
                    $set: { 'colors.status': 'yellow' }  // Set color for 'status' column to yellow
                },
                { new: true }
            );
            return res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
        }
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};



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