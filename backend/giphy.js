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
const DEFAULT_RATING = "g"; // Can be "y", "g", "pg", "pg-13", or "r"
// The following values can be found in the Giphy API documentation
const OFFSET_MIN = 0;
const OFFSET_MAX_SEARCH = 4999;
const OFFSET_MAX_TRENDING = 4999;

// Generate a random offset in the range [min, max] (both inclusive)
// to use in the Giphy API calls.
function offset(min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
}

// Retrieve a trending GIF
async function getTrending(rating) {
    try {
        const result = await giphy.trending({ limit: PAGE_SIZE, rating: rating || DEFAULT_RATING, offset: offset(OFFSET_MIN, OFFSET_MAX_TRENDING) });
        const url = result.data.map(gif => gif.images.original.webp)[0];
        return url;
    } catch (error) {
        logger.error(`TRENDING`, JSON.stringify(error));
    }
}

// Retrieve a GIF via a search term
async function giphySearch(term, offsetMax, rating) {
    try {
        const result = await giphy.search(term, { sort: "recent", rating: rating || DEFAULT_RATING, limit: PAGE_SIZE, offset: offset(OFFSET_MIN, offsetMax) });
        const url = result.data.map(gif => gif.images.original.webp)[0];
        return url;
    } catch (error) {
        logger.error(`SEARCH`, JSON.stringify(error));
    }
}

// Make a search request and determine the max search offset from the results.
async function getSearchOffsetMax(term, rating) {
    try {
        const result = await giphy.search(term, { sort: "recent", rating: rating || DEFAULT_RATING, limit: PAGE_SIZE, offset: 0 });
        return Math.min(result.pagination.total_count, OFFSET_MAX_SEARCH);
    } catch (error) {
        logger.error(`GET SEARCH OFFSET MAX`, JSON.stringify(error));
    }
}

// Request a random GIF
// tag is an optional parameter that specifies a tag value to
// filter on
// Kind of works like a search term, but searches by tag instead
// of by category
// The random endpoint only returns one result.
// This function is currently unused and untested.
async function getRandom(rating, tag = "") {
    try {
        const result = await giphy.random({ rating: rating || DEFAULT_RATING, tag });
        return result.data.images.original.webp;
    } catch (error) {
        logger.error(`RANDOM`, JSON.stringify(error));
    }
}

async function getGif(theme, offsetMax, rating) {
    let result;
    if (theme !== "default") {
        result = await giphySearch(theme, offsetMax, rating);
    } else {
        result = await getTrending(rating);
    }
    return result;
}

exports.getGif = getGif;
exports.getOffsetMax = getSearchOffsetMax;
exports.offsetValues = {
    min: OFFSET_MIN,
    searchMax: OFFSET_MAX_SEARCH,
    trendingMax: OFFSET_MAX_TRENDING
};