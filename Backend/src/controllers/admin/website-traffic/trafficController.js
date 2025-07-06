const { google } = require('googleapis');

// Main function to fetch traffic data
async function getTrafficData(req, res) {
    try {
        // Load credentials from the environment variable and validate it
        const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON2;
        if (!credentialsJson) {
            console.error('Google credentials are missing');
            return res.status(400).json({ message: 'Google credentials missing in environment' });
        }

        const credentials = JSON.parse(credentialsJson);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        const searchConsole = google.searchconsole({ version: 'v1', auth });

        // Define date range (last 3 months)
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3); // Subtract 3 months
        const formattedStartDate = startDate.toISOString().split('T')[0];

        // Call the API
        const response = await searchConsole.searchanalytics.query({
            siteUrl: 'sc-domain:edugainers.com',
            requestBody: {
                startDate: formattedStartDate,
                endDate,
                dimensions: ['query', 'country', 'device'],
                rowLimit: 5000, // Fetch up to 5000 rows of data
            },
        });

        // Defensive check for empty response
        if (!response.data.rows || response.data.rows.length === 0) {
            console.error('No traffic data returned');
            return res.status(404).json({ message: 'No traffic data available' });
        }

        // Extract detailed data and aggregate by different dimensions
        const trafficData = {
            queries: {},
            countries: {},
            devices: {},
            totalClicks: 0,
            totalImpressions: 0,
            totalCTR: 0,
            totalPosition: 0,
        };

        response.data.rows.forEach(row => {
            const [query, country, device] = row.keys;
            const clicks = row.clicks || 0;
            const impressions = row.impressions || 0;
            const ctr = (row.ctr || 0) * 100; // Convert to percentage
            const position = row.position || 0;

            // Aggregate data by query
            if (!trafficData.queries[query]) {
                trafficData.queries[query] = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
            }
            trafficData.queries[query].clicks += clicks;
            trafficData.queries[query].impressions += impressions;
            trafficData.queries[query].ctr = ctr;
            trafficData.queries[query].position = position;

            // Aggregate data by country
            if (!trafficData.countries[country]) {
                trafficData.countries[country] = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
            }
            trafficData.countries[country].clicks += clicks;
            trafficData.countries[country].impressions += impressions;
            trafficData.countries[country].ctr = ctr;
            trafficData.countries[country].position = position;

            // Aggregate data by device
            if (!trafficData.devices[device]) {
                trafficData.devices[device] = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
            }
            trafficData.devices[device].clicks += clicks;
            trafficData.devices[device].impressions += impressions;
            trafficData.devices[device].ctr = ctr;
            trafficData.devices[device].position = position;

            // Aggregate total metrics
            trafficData.totalClicks += clicks;
            trafficData.totalImpressions += impressions;
            trafficData.totalCTR += ctr;
            trafficData.totalPosition += position;
        });

        // Defensive check for dividing by zero when calculating averages
        const totalRows = response.data.rows.length;
        const avgCTR = totalRows > 0 ? (trafficData.totalCTR / totalRows).toFixed(2) : 0;
        const avgPosition = totalRows > 0 ? (trafficData.totalPosition / totalRows).toFixed(2) : 0;

        // Format the response for easy visualization
        const formattedData = {
            queries: Object.entries(trafficData.queries).map(([query, data]) => ({ query, ...data })),
            countries: Object.entries(trafficData.countries).map(([country, data]) => ({ country, ...data })),
            devices: Object.entries(trafficData.devices).map(([device, data]) => ({ device, ...data })),
            total: {
                clicks: trafficData.totalClicks,
                impressions: trafficData.totalImpressions,
                ctr: avgCTR, // Average CTR
                position: avgPosition, // Average position
            },
        };

        // console.log('Formatted Traffic Data:', JSON.stringify(formattedData, null, 2));

        // Send the data as a JSON response
        return res.status(200).json(formattedData);

    } catch (error) {
        console.error('Error fetching traffic data:', error.message);
        return res.status(500).json({ message: 'Error fetching traffic data' });
    }
}

// Exporting the controller function for use in routes
module.exports = { getTrafficData };

// Run the script if executed directly
if (require.main === module) {
    getTrafficData().catch(error => console.error('Script Execution Error:', error));
}
