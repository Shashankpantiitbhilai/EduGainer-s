const cron = require('node-cron');
const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student'); // Adjust the path to your models file

// Cron job to run at the start of every month
cron.schedule('0 0 1 * *', async () => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Get the current month (1-12)
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Calculate the previous month
        const currentMonthModel = getModelForMonth(currentMonth); // Get the model for the current month

        // Fetch all bookings from the previous month's collection
        const previousMonthModel = getModelForMonth(previousMonth);
        const previousMonthBookings = await previousMonthModel.find({});

        if (previousMonthBookings.length > 0) {
            // Insert previous month's bookings into the current month's collection
            await currentMonthModel.insertMany(previousMonthBookings);

            console.log(`Successfully moved ${previousMonthBookings.length} bookings from the ${previousMonthModel.collection.name} collection to the ${currentMonthModel.collection.name} collection.`);
        } else {
            console.log(`No bookings found to move for ${previousMonthModel.collection.name}.`);
        }
    } catch (error) {
        console.error('Error during the monthly booking transition:', error);
    }
});
