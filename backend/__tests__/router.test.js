const { parse } = require("../router");
const giphy = require("@giphy/js-fetch-api");
const State = require("../game-objects/state");
const Submission = require("../game-objects/submission");

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
    expect(sendToHostMock).toHaveBeenCalledWith({
      playState: "awaitingSubmissions"
    });
    expect(sendAllPlayersMock).toHaveBeenCalledWith({
      playState: "awaitingSubmissions"
    });
  });

  test("PlayersReady state action sends playState update to host and judge", async () => {
    const sendToHostMock = jest.fn();
    const sendToJudgeMock = jest.fn();
    const getJudgeMock = jest.fn();
    const game = {
      sendToHost: sendToHostMock,
      sendToJudge: sendToJudgeMock,
      getJudge: getJudgeMock
    };
    const payload = {
      action: "playersready",
      gameID: "XYZZ"
    };
    const response = await parse(payload, game);
    expect(response.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledWith({
      playState: "awaitingGifSelection"
    });
    expect(getJudgeMock).toHaveBeenCalled();
    expect(sendToJudgeMock).toHaveBeenCalledWith({ playState: "judge" });
  });

  test("newgame action with theme", async () => {
    const setThemeMock = jest.fn();
    const sendToHostMock = jest.fn();
    const dealFirstHandMock = jest.fn();
    const sendMock = jest.fn();
    const getPlayersMock = jest.fn();
    const game = {
      players: [
        { id: 1, name: "mary", send: sendMock },
        { id: 2, name: "alice", send: sendMock },
        { id: 3, name: "bob", send: sendMock }
      ],
      sendToHost: sendToHostMock,
      dealFirstHand: dealFirstHandMock,
      setTheme: setThemeMock,
      getPlayers: getPlayersMock
    };
    const payload = {
      action: "newgame",
      theme: "sports"
    };
    const response = await parse(payload, game);
    expect(response.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledTimes(1);
    expect(getPlayersMock).toHaveBeenCalledTimes(1);
    expect(setThemeMock).toHaveBeenCalledWith(payload.theme);
    expect(dealFirstHandMock).toHaveBeenCalledTimes(game.players.length);
    expect(sendMock).toHaveBeenCalledTimes(game.players.length);
  });

  test("newgame action without theme", async () => {
    const setThemeMock = jest.fn();
    const sendToHostMock = jest.fn();
    const dealFirstHandMock = jest.fn();
    const sendMock = jest.fn();
    const getPlayersMock = jest.fn();
    const game = {
      players: [
        { id: 1, name: "mary", send: sendMock },
        { id: 2, name: "alice", send: sendMock },
        { id: 3, name: "bob", send: sendMock }
      ],
      sendToHost: sendToHostMock,
      dealFirstHand: dealFirstHandMock,
      setTheme: setThemeMock,
      getPlayers: getPlayersMock
    };
    const payload = {
      action: "newgame"
    };
    const response = await parse(payload, game);
    expect(response.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledTimes(1);
    expect(getPlayersMock).toHaveBeenCalledTimes(1);
    expect(setThemeMock).toHaveBeenCalledTimes(0);
    expect(dealFirstHandMock).toHaveBeenCalledTimes(game.players.length);
    expect(sendMock).toHaveBeenCalledTimes(game.players.length);
  });

  test("eliminatecaption action sends updated submissions to host", async () => {
    const sendToHostMock = jest.fn();
    const state = new State('default');
    state.addSubmission(new Submission('1', 'A'));
    state.addSubmission(new Submission('2', 'B'));
    const game = {
      sendToHost: sendToHostMock,
      state
    };
    const payload = {
      action: "eliminatecaption",
      submission: "B",
      gameID: "XXXX"
    };
    const r = await parse(payload, game);
    expect(r.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledWith({
      submissions: [
        {
          playerID: "1",
          caption: "A"
        }
      ]
    });
  });
});
