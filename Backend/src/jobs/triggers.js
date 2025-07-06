const mongoose = require('mongoose');
const { Log } = require("../models/EventLogs"); // Import the Log model

async function setupChangeStreams(currentUser) {
    logEvent('Initiating Change Stream Monitoring', currentUser);

    const models = mongoose.modelNames();
    logEvent(`Tracked Models: ${models.join(', ')}`, currentUser);

    models.forEach(modelName => {
        // Skip ChangeLog model to avoid logging its changes
        if (modelName === 'Log') {
            return;
        }

        const Model = mongoose.model(modelName);
        const changeStream = Model.watch([], { fullDocument: 'updateLookup' });

        changeStream.on('change', async (change) => {
            const logMessage = `${currentUser} Database Change Detected - Model: ${modelName}, Operation: ${change.operationType.toUpperCase()}`;
            console.log('\n--- ' + logMessage + ' ---');

            // Save log to database only for operation changes
            if (change.operationType !== 'system') {
                await logEvent(logMessage, currentUser, {
                    modelName,
                    operationType: change.operationType,
                    documentDetails: change.fullDocument || change.documentKey
                });
            }
        });

        changeStream.on('error', (error) => {
            console.error(`🚨 Error in ${modelName} Change Stream:`, error);
        });
    });
}

/**
 * Enhanced log event function to save to database
 */
async function logEvent(message, user, additionalData = null) {
    try {
        // Log entry creation only for relevant operation messages
        if (additionalData?.operationType) {
            const logEntry = new Log({
                message,
                user,
                additionalData,
                operationType: additionalData.operationType,
                modelName: additionalData.modelName
            });

            await logEntry.save();

            // Console logging
            console.log(`${new Date().toISOString()} - ${user}: ${message}`);
            if (additionalData) {
                console.log('Additional Data:', additionalData);
            }
        }
    } catch (error) {
        console.error('Error logging event:', error);
    }
}

module.exports = {
    setupChangeStreams,
    logEvent
};
