// import cors from "cors";
// import express from "express";
import RSSParser from "rss-parser";

let localStorage = {
    store: {},
    getItem: function(key) {
        return this.store[key] || null;
    },
    setItem: function(key, value) {
        this.store[key] = value.toString();
    },
    removeItem: function(key) {
        delete this.store[key];
    },
    clear: function() {
        this.store = {};
    }
};

const feedURLs = ["https://www.almasryalyoum.com/rss/rssfeed", "https://www.youm7.com/rss/SectionRss?SectionID=297"];
const parser = new RSSParser();
let articles = [];

// Function to parse and store the feeds
const parseAndStoreFeeds = async urls => {
    try {
        for (const url of urls) {
            const feed = await parser.parseURL(url);
            console.log(feed);
            feed.items.forEach(item => {
                articles.push(item);
            });
        }
        // Store the combined feeds in localStorage
        localStorage.setItem('cachedFeed', JSON.stringify(articles));
        // Update the last fetched time
        localStorage.setItem('lastFetched', Date.now().toString());
    } catch (error) {
        console.error('Error parsing feeds:', error);
    }
}

// Function to load feed from localStorage
const loadFeedFromCache = () => {
    const cachedFeed = localStorage.getItem('cachedFeed');
    if (cachedFeed) {
        articles = JSON.parse(cachedFeed);
        console.log('Loaded articles from cache:', articles);
    } else {
        console.log('No cached feed found.');
    }
}

// Check if feed is in localStorage and not too old
export const checkAndUpdateFeed = async () => {
    const lastFetched = localStorage.getItem('lastFetched');
    const cacheDuration = 60 * 60 * 1000; // 1 hour

    if (lastFetched && (Date.now() - Number(lastFetched) < cacheDuration)) {
        // Load from cache if it's not too old
        loadFeedFromCache();
    } else {
        // Fetch and parse the feeds if not cached or cache is too old
        await parseAndStoreFeeds(feedURLs);
    }
    console.log(articles);
}
checkAndUpdateFeed();



// export async function POST(request) {
//   console.log(request);

//   try {

// // Run the check and update function on page load
// checkAndUpdateFeed();
//     return NextResponse.json("", { status: 200 });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     // Handle the error appropriately, e.g., return an error response
//     return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
//   }
// }
