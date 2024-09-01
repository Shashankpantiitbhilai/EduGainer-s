const cron = require('node-cron');
const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student'); // Adjust the path to your models file


cron.schedule('0 1 1 * *', async () => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Get the current month (1-12)
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Calculate the previous month
        const currentMonthModel = getModelForMonth(currentMonth); // Get the model for the current month
        const previousMonthModel = getModelForMonth(previousMonth); // Get the model for the previous month

        // Fetch all bookings from the previous month's collection
        const previousMonthBookings = await previousMonthModel.find({});

        // Filter out records with nextMonthStatus of 'DisContinue'
        const validBookings = previousMonthBookings.filter(
            booking => booking?.nextMonthStatus?.toLowerCase() !== 'discontinue'
        );

        if (validBookings.length > 0) {
            // Clear the current month's collection
            await currentMonthModel.deleteMany({});

            // Prepare records for insertion into the current month's collection
            const updatedBookings = validBookings.map(booking => {
                let status = booking.nextMonthStatus;
                let color = 'white'; // Default color

                if (!status) {
                    status = 'Temporary'; // Default status if nextMonthStatus is empty
                    color = '#989898'; // Default color if nextMonthStatus is empty
                } else if (status === 'Confirmed') {
                    color = '#FFEA00'; // Yellow color for 'Confirmed' status
                }

                return {
                    ...booking.toObject(),
                    status, // Set status
                    nextMonthStatus: '', // Clear nextMonthStatus for the current month
                    colors: { ...booking.colors.toObject(), status: color } // Update the colors map with the new color for status
                };
            });

            // Insert updated records into the current month's collection
            await currentMonthModel.insertMany(updatedBookings);

            console.log(`Successfully updated ${currentMonthModel.collection.name} with ${updatedBookings.length} bookings from ${previousMonthModel.collection.name}.`);
        } else {
            console.log(`No valid bookings found to move for ${previousMonthModel.collection.name}.`);
        }
    } catch (error) {
        console.error('Error during the monthly booking transition:', error);
    }
});
