// const fs = require('fs');
// const redis = require('redis');
// const client = redis.createClient();

// async function updateTickersFromFile(filePath) {
//     try {
//         // Read file content
//         const data = fs.readFileSync(filePath, 'utf8');
//         const lines = data.split('\n');

//         // Extract tickers marked as True
//         const tickers = lines
//             // .filter(line => line.split(' ')[2] === 'True')
//             .map(line => line.split(' ')[1].replace('.csv', '')); // Remove the .csv part

//         // Update tickers in Redis
//         await client.set('sortedTickers', JSON.stringify(tickers));
//         console.log('Tickers updated in Redis:', tickers);
//     } catch (error) {
//         console.error('Error updating tickers from file:', error);
//     }
// }

// const fs = require('fs');
const { google } = require('googleapis');
const redis = require('redis');
const client = redis.createClient();

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_PATH = 'token.json';
// Load client secrets from a local file.
 async function runRecommsys(){
    authorize(credentials, updateTickersFromGoogleDriveFolder);

}
    // fs.readFile('credentials.json', (err, content) => {
    //     if (err) return console.log('Error loading client secret file:', err);
    //
    // });


/**
 * Create an OAuth2 client with the given credentials.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return getAccessToken(oAuth2Client, callback);
    // Check if we have previously stored a token.
    // fs.readFile(TOKEN_PATH, (err, token) => {
    //     if (err) return getAccessToken(oAuth2Client, callback);
    //     oAuth2Client.setCredentials(JSON.parse(token));
    //     callback(oAuth2Client);
    // });
}

/**
 * Get and store new token after prompting for user authorization.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            // fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            //     if (err) console.error(err);
            //     console.log('Token stored to', TOKEN_PATH);
            // });
            callback(oAuth2Client);
        });
    });
}

/**
 * Update tickers from Google Drive folder.
 */
async function updateTickersFromGoogleDriveFolder(auth) {
    const drive = google.drive({ version: 'v3', auth });
    const folderId = '1I6jF_2wAbukvgFcDJJqWTgcKA88ZnXKc'; // Replace with your Google Drive folder ID

    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and mimeType='text/csv'`,
            fields: 'files(id, name)',
        });

        const files = res.data.files;
        if (files.length === 0) {
            console.log('No CSV files found in the folder.');
            return;
        }

        // Process each CSV file found in the folder
        for (const file of files) {
            console.log(`Processing file: ${file.name}`);
            await processCSVFile(drive, file.id);
        }
    } catch (error) {
        console.error('Error listing files in Google Drive folder:', error);
    }
}

/**
 * Process a CSV file and update tickers in Redis.
 */
async function processCSVFile(drive, fileId) {
    try {
        const res = await drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' });

        let data = '';
        res.data.on('data', (chunk) => {
            data += chunk;
        });

        res.data.on('end', async () => {
            const lines = data.split('\n');

            // Extract tickers and sort them
            const tickers = lines
                .map(line => line.split(' ')[1].replace('.csv', ''))
                .sort(); // Sort the tickers

            // Update tickers in Redis
            await client.set('sortedTickers', JSON.stringify(tickers));
            console.log('Tickers updated in Redis:', tickers);
        });

    } catch (error) {
        console.error('Error processing CSV file:', error);
    }
}

