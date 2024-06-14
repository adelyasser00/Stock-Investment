const fs = require('fs');
const redis = require('redis');
const client = redis.createClient();

async function updateTickersFromFile(filePath) {
    try {
        // Read file content
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n');

    //     const response = await fetch('http://your-model-api.com/tickers');
    // const tickers = await response.json(); // Assuming this returns an array of tickers sorted from best to worst


        // Extract tickers marked as True
        const tickers = lines
            // .filter(line => line.split(' ')[2] === 'True')
            .map(line => line.split(' ')[1].replace('.csv', '')); // Remove the .csv part

        // Update tickers in Redis
        await client.set('sortedTickers', JSON.stringify(tickers));
        console.log('Tickers updated in Redis:', tickers);
    } catch (error) {
        console.error('Error updating tickers from file:', error);
    }
}
