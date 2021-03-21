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
      sendToHost(_) {}
    };
    const method = { action: "getgif" };
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
      sendToHost(_) {}
    };
    const method = { action: "getgif" };
    let r = await parse(method, game);
    expect(r.status).toBe(200);
    expect(game.getState().gifOffset).toBe(1);
    expect(game.getState().gif).toBe(searchURL);
  });

  test("Submit a caption", async () => {
    // Set up other test data and run the test
    const game = {
      state: {
        submissions: [],
        clearSubmissions() {}, //Don't clear so we can see if it was added
        addSubmission(newSub) {
          this.submissions.push(newSub);
        }
      },
      captions: {
        getCaption() {
          return "A fake new caption";
        }
      },
      players: [{ id: "123456", send(_) {} }],
      getTheme() {
        return "default";
      },
      getState() {
        return this.state;
      },
      setGif(url) {
        this.state.gif = url;
      },
      sendToHost(_) {},
      sendToJudge(_) {}
    };
    const object = {
      action: "submitcaption",
      caption: "Fake caption",
      playerID: "123456",
      gameID: "XXXX"
    };
    let r = await parse(object, game);
    expect(r.status).toBe(200);
    expect(game.getState().submissions.length).toBe(1);
  });

  test("setgif action sends playState update messages to host and all players", async () => {
    const sendToHostMock = jest.fn();
    const sendAllPlayersMock = jest.fn();
    const game = {
      sendToHost: sendToHostMock,
      sendAllPlayers: sendAllPlayersMock
    };
    const payload = {
      action: "setgif",
      playerID: "123456",
      gameID: "XXXX"
    };
    const r = await parse(payload, game);
    expect(r.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledWith({playState: 'awaitingSubmissions'});
    expect(sendAllPlayersMock).toHaveBeenCalledWith({playState: 'awaitingSubmissions'});
  });
});
