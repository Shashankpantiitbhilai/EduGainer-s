const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student');
const fs = require('fs').promises;
const path = require('path');

async function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;

    // Ensure both console and file logging
    console.log(logMessage);

    try {
        const logDir = path.join(__dirname, 'logs');
        await fs.mkdir(logDir, { recursive: true });
        await fs.appendFile(path.join(logDir, 'monthly-task.log'), logMessage);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

async function executeMonthlyTask() {
    try {
        await logToFile('========== MONTHLY TASK EXECUTION START ==========');

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        await logToFile(`Current Month: ${currentMonth}, Previous Month: ${previousMonth}`);

        const currentMonthModel = getModelForMonth(currentMonth);
        const previousMonthModel = getModelForMonth(previousMonth);

        await logToFile('Fetching previous month bookings...');
        const previousMonthBookings = await previousMonthModel.find({});
        await logToFile(`Total bookings found: ${previousMonthBookings.length}`);

        const validBookings = previousMonthBookings.filter(
            booking => booking?.nextMonthStatus?.toLowerCase() !== 'discontinue'
        );
        await logToFile(`Valid bookings (excluding discontinued): ${validBookings.length}`);

        const paidBookings = validBookings.filter(
            booking => booking.regFee > 0 || booking.cash > 0 ||
                booking.online > 0 || booking.TotalMoney > 0
        );

        await logToFile('\n----- PAID BOOKINGS DETAILS -----');
        if (paidBookings.length > 0) {
            for (const booking of paidBookings) {
                await logToFile(JSON.stringify({
                    name: booking.name,
                    regFee: booking.regFee || 0,
                    cash: booking.cash || 0,
                    online: booking.online || 0,
                    totalMoney: booking.TotalMoney || 0
                }, null, 2));
            }
        } else {
            await logToFile('No paid bookings found for the previous month.');
        }

        await logToFile('========== MONTHLY TASK EXECUTION END ==========');
    } catch (error) {
        await logToFile(`ERROR: ${error.message}`);
        await logToFile(`Stack trace: ${error.stack}`);
        throw error;
    }
}

module.exports = {
    executeMonthlyTask
};