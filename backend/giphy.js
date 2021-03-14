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

// Retrieve a trending GIF
async function getTrending(offset) {
    try {
        const result = await giphy.trending({ limit: PAGE_SIZE, rating: RATING, offset });
        const url = result.data.map(gif => gif.images.original.webp)[0];
        return url;
    } catch (error) {
        logger.error(`TRENDING`, JSON.stringify(error));
    }
}

// Retrieve a GIF via a search term
// Offset tells the Giphy API how many results to skip; default: 0
async function giphySearch(term, offset) {
    try {
        // May need to add offset?
        // If we do, need to track offset in game object
        // Offset resets to 0 after each round, increments
        // every time the GIF is changed (after each turn,
        // every time the judge requests a new GIF)
        const result = await giphy.search(term, { sort: "recent", rating: RATING, limit: PAGE_SIZE, offset });
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

module.exports = async function getGif(theme, offset) {
    let result;
    if (theme !== "default") {
        result = await giphySearch(theme, offset);
    } else {
        result = await getTrending(offset);
    }
    return result;
}