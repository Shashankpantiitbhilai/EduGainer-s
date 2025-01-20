const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student'); // Adjust the path to your models file

async function executeMonthlyTask() {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Get the current month (1-12)
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Calculate the previous month
        const currentMonthModel = getModelForMonth(currentMonth); // Get the model for the current month
        const previousMonthModel = getModelForMonth(previousMonth); // Get the model for the previous month

        // Fetch all bookings from the previous month's collection
        const previousMonthBookings = await previousMonthModel.find({});

        // Filter out records with nextMonthStatus of 'Discontinue'
        const validBookings = previousMonthBookings.filter(
            booking => booking?.nextMonthStatus?.toLowerCase() !== 'discontinue'
        );

        // Log people who paid their fee (i.e., where regFee, cash, online, or TotalMoney > 0)
        const paidBookings = validBookings.filter(
            booking => booking.regFee > 0 || booking.cash > 0 || booking.online > 0 || booking.TotalMoney > 0
        );

        if (paidBookings.length > 0) {
            paidBookings.forEach(booking => {
                console.log(`Paid booking: ${booking.name}, Reg Fee: ${booking.regFee}, Cash: ${booking.cash}, Online: ${booking.online}, Total Money: ${booking.TotalMoney}`);
            });
        } else {
            console.log('No paid bookings found for the previous month.');
        }

    } catch (error) {
        console.error('Error during the monthly booking transition:', error);
    }
}

module.exports = {
    executeMonthlyTask
};
