const mongoose = require('mongoose');
const { LibStudent, getModelForMonth } = require('./student');

const setupChangeStream = async () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    monthNames.forEach(async (month, index) => {
        const MonthlyBooking = getModelForMonth(index + 1);
        const changeStream = MonthlyBooking.watch();

        changeStream.on('change', async (change) => {
           
            if (change.operationType === 'insert' || change.operationType === 'update') {
                const bookingDoc = change.fullDocument;

                if (bookingDoc && bookingDoc.reg && bookingDoc.date) {
                    try {
                        await LibStudent.findOneAndUpdate(
                            { reg: bookingDoc.reg },
                            { lastfeedate: new Date(bookingDoc.date), shift: bookingDoc.shift },
                           
                            { upsert: true, new: true }
                        );
                      
                    } catch (error) {
                        console.error(`Error updating lastfeedate for ${month} collection:`, error);
                    }
                }
            }
        });

        // console.log(`Change stream set up for ${month} collection`);
    });
};

module.exports = setupChangeStream;