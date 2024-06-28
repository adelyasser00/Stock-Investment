const fs = require('fs');

// Function to read the file and extract tickers
export async function extractTickersFromFile() {
    const filePath = 'F:\\Graduation Project\\Demo Website Repo\\Stock-Investment\\frontend\\app\\lib\\recommsys\\predictions.txt';
    // Read the file content synchronously (for simplicity)
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Split the content by new lines
    const lines = fileContent.trim().split('\n');

    // Initialize an array to store the tickers
    const tickers = [];

    // Loop through each line
    for (const line of lines) {
        // Split each line by spaces
        const parts = line.split(' ');

        // Extract the ticker from the second part (index 1) and remove the '.csv' extension
        const ticker = parts[2].replace('.csv', '');

        // Add the ticker to the array
        tickers.push(ticker);
    }
    console.log("tickers:",tickers)
    return tickers;
}

// Define the path to the file


// Call the function and log the result
 // Output the array of tickers