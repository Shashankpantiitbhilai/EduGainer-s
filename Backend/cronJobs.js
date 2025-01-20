const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student');
const fs = require('fs').promises;
const path = require('path');

// MongoDB connection URI - make sure this matches your configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://your-mongodb-uri';

async function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    console.log(logMessage);

    try {
        const logDir = path.join(__dirname, 'logs');
        await fs.mkdir(logDir, { recursive: true });
        await fs.appendFile(path.join(logDir, 'monthly-task.log'), logMessage);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

async function connectToDatabase() {
    try {
        await logToFile('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds
        });
        await logToFile('Successfully connected to MongoDB');
    } catch (error) {
        await logToFile(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
}

async function executeMonthlyTask() {
    let connection = null;

    try {
        await logToFile('========== MONTHLY TASK EXECUTION START ==========');

        // Connect to database first
        await connectToDatabase();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        await logToFile(`Current Month: ${currentMonth}, Previous Month: ${previousMonth}`);
        await logToFile(`Initializing models for months: ${previousMonth} and ${currentMonth}`);

        const currentMonthModel = getModelForMonth(currentMonth);
        const previousMonthModel = getModelForMonth(previousMonth);

        await logToFile('Fetching previous month bookings...');
        const previousMonthBookings = await previousMonthModel.find({}).exec();
        await logToFile(`Total bookings found: ${previousMonthBookings?.length || 0}`);

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
    } finally {
        // Close the MongoDB connection
        if (mongoose.connection.readyState !== 0) {
            await logToFile('Closing MongoDB connection...');
            await mongoose.connection.close();
            await logToFile('MongoDB connection closed');
        }
    }
}

// If running directly (not as a module)
if (require.main === module) {
    executeMonthlyTask()
        .catch(console.error)
        .finally(() => process.exit());
}

module.exports = {
    executeMonthlyTask
};