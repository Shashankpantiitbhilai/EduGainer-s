const mongoose = require('mongoose');
const { getModelForMonth } = require('./models/student');
const fs = require('fs').promises;
const path = require('path');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

// Logging setup
async function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    console.log(logMessage); // Console output for GitHub Actions

    try {
        const logDir = path.join(__dirname, 'logs');
        await fs.mkdir(logDir, { recursive: true });
        await fs.appendFile(
            path.join(logDir, `monthly-task-${new Date().toISOString().split('T')[0]}.log`),
            logMessage
        );
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

// Database connection
async function connectToDatabase() {
    try {
        await logToFile('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        await logToFile('Successfully connected to MongoDB');
    } catch (error) {
        await logToFile(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
}

async function executeMonthlyTask() {
    try {
        await logToFile('========== MONTHLY TASK EXECUTION START ==========');

        // Ensure database connection
        await connectToDatabase();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        await logToFile(`Processing: Previous Month (${previousMonth}) → Current Month (${currentMonth})`);

        const currentMonthModel = getModelForMonth(currentMonth);
        const previousMonthModel = getModelForMonth(previousMonth);

        await logToFile(`Models initialized: Current (${currentMonthModel.collection.name}), Previous (${previousMonthModel.collection.name})`);

        // Fetch previous month bookings
        await logToFile('Fetching previous month bookings...');
        const previousMonthBookings = await previousMonthModel.find({}).exec();
        await logToFile(`Total bookings found: ${previousMonthBookings.length}`);

        // Filter valid bookings
        const validBookings = previousMonthBookings.filter(
            booking => booking?.nextMonthStatus?.toLowerCase() !== 'discontinue'
        );
        await logToFile(`Valid bookings (excluding discontinued): ${validBookings.length}`);

        if (validBookings.length > 0) {
            // Clear current month collection
            await logToFile('Clearing current month collection...');
            await currentMonthModel.deleteMany({});
            await logToFile('Current month collection cleared successfully');

            // Prepare updated bookings
            await logToFile('Preparing bookings for transfer...');
            const updatedBookings = validBookings.map(booking => {
                let status = booking.nextMonthStatus;
                let color = 'white';

                if (!status) {
                    status = 'Temporary';
                    color = '#989898';
                } else if (status === 'Confirmed') {
                    color = '#FFEA00';
                }

                return {
                    ...booking.toObject(),
                    status,
                    nextMonthStatus: '',
                    colors: { ...booking.colors.toObject(), status: color },
                    regFee: 0,
                    cash: 0,
                    online: 0,
                    website: 0,
                    TotalMoney: 0
                };
            });

            // Insert updated bookings
            await logToFile('Inserting updated bookings into current month collection...');
            await currentMonthModel.insertMany(updatedBookings);
            await logToFile(`Successfully transferred ${updatedBookings.length} bookings to ${currentMonthModel.collection.name}`);

            // Log sample of transferred data
            await logToFile('Sample of transferred bookings:');
            const sampleSize = Math.min(3, updatedBookings.length);
            for (let i = 0; i < sampleSize; i++) {
                await logToFile(JSON.stringify(updatedBookings[i], null, 2));
            }

        } else {
            await logToFile(`No valid bookings found to transfer from ${previousMonthModel.collection.name}`);
        }

        await logToFile('========== MONTHLY TASK EXECUTION COMPLETED SUCCESSFULLY ==========');

    } catch (error) {
        await logToFile('========== ERROR IN MONTHLY TASK ==========');
        await logToFile(`Error message: ${error.message}`);
        await logToFile(`Stack trace: ${error.stack}`);
        throw error;
    } finally {
        // Clean up database connection
        if (mongoose.connection.readyState !== 0) {
            await logToFile('Closing database connection...');
            await mongoose.connection.close();
            await logToFile('Database connection closed');
        }
    }
}

// Export for use in GitHub Actions
module.exports = {
    executeMonthlyTask
};

// If running directly
if (require.main === module) {
    executeMonthlyTask()
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}