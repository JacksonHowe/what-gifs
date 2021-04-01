// Mock the Giphy SDK
const giphy = require("@giphy/js-fetch-api");

// Import the module we actually want to test.
const getGif = require("../giphy");

describe("Test suite for the Giphy API module", () => {
    test("Get a GIF for games with the default theme (Trending)", async () => {
        // Set up mocked data
        const trendingURL = "giphy.com/a/trending/gif/url";
        giphy.__setResultURL(trendingURL);

        // Run the test
        const result = await getGif("default");
        expect(result).toBe(trendingURL);
    });

    test("Get a GIF for games with a custom theme (Search)", async () => {
        // Set up mocked data
        const searchURL = "giphy.com/a/search/gif/url";
        giphy.__setResultURL(searchURL);

        // Set up other test parameters and run the test
        const result = await getGif("football");
        expect(result).toBe(searchURL);
    });
});