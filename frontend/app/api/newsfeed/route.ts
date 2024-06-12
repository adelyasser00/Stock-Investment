// import cors from "cors";
// import express from "express";
import Post from "@/lib/database/models/post.model";
import User from "@/lib/database/models/user.model";
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
// checkAndUpdateFeed();

async function savePostAndUser(postData, userId) {
  try {
    // Create a new post document.
    const newPost = new Post({
      author: postData.link,
      title: postData.title,
      content: postData.content,
      image: postData.image
    });

    // Save the new post to the database.
    const savedPost = await newPost.save();

    // Update the user's saved posts (assuming you have such a field).
    await User.findByIdAndUpdate(
      userId,
      { $push: { savedPosts: savedPost._id } },
      { new: true, safe: true, upsert: false }
    );

    return savedPost;
  } catch (error) {
    console.error('Failed to save post or update user:', error);
    throw error;
  }
}
