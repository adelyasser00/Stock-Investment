// import cors from "cors";
// import express from "express";
import Post from "../database/models/post.model"
import User from "../database/models/user.model"
import { connectToDatabase } from "../database/mongoose";
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
// "https://www.youm7.com/rss/SectionRss?SectionID=297"
const feedURLs = ["https://www.almasryalyoum.com/rss/rssfeed"];
const parser = new RSSParser();
let articles = [];
export { articles };

// Function to parse and store the feeds
const parseAndStoreFeeds = async urls => {
    try {
        console.log("inside parseAndStoreFeeds")
        for (const url of urls) {
            console.log("inside for loop", url)
            const feed = await parser.parseURL(url);
            console.log("feed obtained");
            console.log(feed);
            feed.items.forEach(item => {
                articles.push(item);
            });
            console.log(articles);
        }
        console.log(articles)
        console.log("Done Parsing feed")
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

    // if (lastFetched && (Date.now() - Number(lastFetched) < cacheDuration)) {
    //     // Load from cache if it's not too old
    //     loadFeedFromCache();
    // } else {
    //     // Fetch and parse the feeds if not cached or cache is too old
    //     await parseAndStoreFeeds(feedURLs);
    // }
    await parseAndStoreFeeds(feedURLs);
    console.log(articles);
    return articles;
}
// checkAndUpdateFeed();


