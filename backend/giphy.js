// Securely load the API Key into process.env
require("dotenv").config();

// Polyfill the Fetch API if it is not already in the environment
// The Giphy SDK will not work without this API.
if (!global.fetch) {
    global.fetch = require("node-fetch");
}

// Set up logger
const logger = require("./logger")(module);

// Import and initialize Giphy
const { GiphyFetch } = require("@giphy/js-fetch-api");
const giphy = new GiphyFetch(process.env.GIPHY_API_KEY);
const PAGE_SIZE = 1; // Can be any number 1-100
const RATING = "g"; // Can be "y", "g", "pg", "pg-13", or "r"

// Generate a random offset in the range [min, max] (both inclusive)
// to use in the Giphy API calls.
function offset(min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
}

// Retrieve a trending GIF
async function getTrending() {
    try {
        const result = await giphy.trending({ limit: PAGE_SIZE, rating: RATING, offset: offset(0, 4999) });
        const url = result.data.map(gif => gif.images.original.webp)[0];
        return url;
    } catch (error) {
        logger.error(`TRENDING`, JSON.stringify(error));
    }
}

// Retrieve a GIF via a search term
async function giphySearch(term) {
    try {
        const result = await giphy.search(term, { sort: "recent", rating: RATING, limit: PAGE_SIZE, offset: offset(0, 4999) });
        const url = result.data.map(gif => gif.images.original.webp)[0];
        return url;
    } catch (error) {
        logger.error(`SEARCH`, JSON.stringify(error));
    }
}

// Request a random GIF
// tag is an optional parameter that specifies a tag value to
// filter on
// Kind of works like a search term, but searches by tag instead
// of by category
// The random endpoint only returns one result.
// This function is currently unused and untested.
async function getRandom(tag = "") {
    try {
        const result = await giphy.random({ rating: RATING, tag });
        return result.data.images.original.webp;
    } catch (error) {
        logger.error(`RANDOM`, JSON.stringify(error));
    }
}

module.exports = async function getGif(theme) {
    let result;
    if (theme !== "default") {
        result = await giphySearch(theme);
    } else {
        result = await getTrending();
    }
    return result;
}