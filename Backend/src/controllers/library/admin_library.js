
const { LibStudent, getModelForMonth } = require("../../models/student");
const {Budget}=require("../../models/budget")
// Helper function to get the current month's Booking model
const getCurrentMonthBookingModel = () => {
    const now = new Date();
    return getModelForMonth(now.getMonth() + 1);
};
const addMoneyInfo = async (req, res) => {
    try {
        // Create a new Budget document with the data provided in the request body
        const newBudget = new Budget(req.body);

        // Save the new budget entry to the database
        const savedBudget = await newBudget.save();

        // Respond with the newly created budget entry
        res.status(201).json({
            message: "Financial information added successfully.",
            data: savedBudget
        });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error adding money info:", error);
        res.status(500).json({
            error: "An error occurred while adding financial information."
        });
    }
};
const getSeatInfo = async (req, res) => {
    const { seat } = req.params;
    try {

        const BookingModel = getCurrentMonthBookingModel();
        const bookings = await BookingModel.find({ seat: seat, status: { $ne: "Empty" } })
            .select('name seat shift image reg');


        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const getStudentInfo = async (req, res) => {
    const { reg } = req.params;
    try {
        const data = await LibStudent.findOne({ reg: reg }).select('-_id -__v -userId').lean();
        const BookingModel = getCurrentMonthBookingModel();
        const bookings = await BookingModel.findOne({ reg })
            .select(' seat shift ').lean();
        const student = { ...data, ...bookings }

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

        // Fetch fine amounts for each booking

        // console.log(bookings)
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

const addBookingData = async (req, res) => {
    try {
        const BookingModel = getCurrentMonthBookingModel();

        // Remove _id and __v if they exist in req.body (to prevent conflicts)
        delete req.body._id;
        delete req.body.__v;

        // Determine the color for the status and nextMonthStatus based on req.body
        const colors = {};

        if (req.body.status === "Paid") {
            colors.status = "green";
        } else if (req.body.status === "Confirmed") {
            colors.status = "yellow";
        } else {
            colors.status = "red";
        }

        if (req.body.nextMonthStatus === "discontinue") {
            colors.nextMonthStatus = "grey";
        } else if (req.body.nextMonthStatus === "Confirmed") {
            colors.nextMonthStatus = "yellow";
        }

        // Create a new booking document using req.body and add the colors object
        const newBooking = new BookingModel({
            ...req.body, // Spread all fields from req.body
            colors       // Add the colors object
        });

        // Save the new booking to the database
        await newBooking.save();

        // Send success response
        res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Failed to add booking' });
    }
};


const updateBookingData = async (req, res) => {
    try {
        const BookingModel = getCurrentMonthBookingModel();
        const { reg, status, nextMonthStatus } = req.body;

        console.log(req.body);

        // Remove _id and __v from req.body if they exist
        delete req.body._id;
        delete req.body.__v;

        // Initialize color updates
        let colorUpdate = {};

        // Determine the color based on the status
        if (status === "Paid") {
            colorUpdate['status'] = "green";
        } else if (status === "Confirmed") {
            colorUpdate['status'] = "yellow";
        } else if (status === "discontinue") {
            colorUpdate['status'] = "grey";
        }

        // Determine the color based on the nextMonthStatus
        if (nextMonthStatus === "discontinue") {
            colorUpdate['nextMonthStatus'] = "grey";
        } else if (nextMonthStatus === "Confirmed") {
            colorUpdate['nextMonthStatus'] = "yellow";
        }

        // If any color updates were determined, set them in the req.body
        if (Object.keys(colorUpdate).length > 0) {
            req.body.colors = { ...req.body.colors, ...colorUpdate };
        }

        // Update the student record
        const updatedStudent = await LibStudent.findOneAndUpdate(
            { reg },
            { ...req.body, lastfeedate: req.body.date },
            { new: true }
        );

        // Update the booking record
        const newBooking = await BookingModel.findOneAndUpdate(
            { reg },
            { ...req.body },  // Spread all fields from req.body
            { new: true, upsert: true }
        );

        await newBooking.save();

        console.log(newBooking);

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
            const updateStudent = await LibStudent.findOneAndUpdate({ reg }, { shift }, { new: true })

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
            )
        }
        else if (status === "discontinue") {
            const updatedBooking = await BookingModel.findOneAndUpdate(
                { reg },
                {
                    status: "discontinue",
                    date: currentDate,
                    $set: { 'colors.status': 'grey' }  // Set color for 'status' column to yellow
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
    addMoneyInfo
};