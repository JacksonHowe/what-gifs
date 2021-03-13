const { parse } = require("../router");
const giphy = require("@giphy/js-fetch-api");

describe("Test suite for router object", () => {
  test("Parse a empty action and game object", async () => {
    const game = {};
    const method = "";
    let r = await parse(method, game);
    expect(r.status).toBe(400);
  });

  test("Get a GIF for a game with the default theme", async () => {
    // Set up mocked data
    const trendingURL = "giphy.com/a/trending/gif/url";
    giphy.__setResultURL(trendingURL);

    // Set up other test data and run the test
    const game = {
      state: {
        gifOffset: 0,
        gif: ""
      },
      getTheme() {
        return "default";
      },
      getState() {
        return this.state;
      },
      setGif(url) {
        this.state.gif = url;
      },
      sendToHost(_) { }
    };
    const method = "getgif";
    let r = await parse(method, game);
    expect(r.status).toBe(200);
    expect(game.getState().gifOffset).toBe(1);
    expect(game.getState().gif).toBe(trendingURL);
  });

  test("Get a GIF for a game with a custom theme", async () => {
    // Set up mocked data
    const searchURL = "giphy.com/a/search/gif/url";
    giphy.__setResultURL(searchURL);

    // Set up other test data and run the test
    const game = {
      state: {
        gifOffset: 0,
        gif: ""
      },
      getTheme() {
        return "football";
      },
      getState() {
        return this.state;
      },
      setGif(url) {
        this.state.gif = url;
      },
      sendToHost(_) { }
    };
    const method = "getgif";
    let r = await parse(method, game);
    expect(r.status).toBe(200);
    expect(game.getState().gifOffset).toBe(1);
    expect(game.getState().gif).toBe(searchURL);
  });
});
