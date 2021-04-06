const { parse } = require("../router");
const giphy = require("@giphy/js-fetch-api");
const Player = require("../game-objects/player");
const State = require("../game-objects/state");
const Submission = require("../game-objects/submission");
const Captions = require("../game-objects/captions");

describe("Test suite for router object", () => {
  test("Parse a empty action and game object", async () => {
    const game = {};
    const method = "";
    let r = await parse(method, game);
    expect(r.status).toBe(400);
  });

  describe("getgif action", () => {
    test("Get a GIF for a game with the default theme", async () => {
      // Set up mocked data
      const trendingURL = "giphy.com/a/trending/gif/url";
      giphy.__setResultURL(trendingURL);

      // Set up other test data and run the test
      const game = {
        state: {
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
      const request = { action: "getgif" };
      let r = await parse(request, game);
      expect(r.status).toBe(200);
      expect(game.getState().gif).toBe(trendingURL);
    });

    test("Get a GIF for a game with a custom theme", async () => {
      // Set up mocked data
      const searchURL = "giphy.com/a/search/gif/url";
      giphy.__setResultURL(searchURL);

      // Set up other test data and run the test
      const game = {
        state: {
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
      const method = { action: "getgif" };
      let r = await parse(method, game);
      expect(r.status).toBe(200);
      expect(game.getState().gif).toBe(searchURL);
    });
  });

  test("Submit a caption", async () => {
    // Set up other test data and run the test
    const game = {
      state: {
        submissions: [],
        clearSubmissions() { }, //Don't clear so we can see if it was added
        addSubmission(newSub) {
          this.submissions.push(newSub);
        }
      },
      captions: {
        getCaption() {
          return "A fake new caption";
        }
      },
      players: [{ id: "123456", send(_) { } }],
      getTheme() {
        return "default";
      },
      getState() {
        return this.state;
      },
      setGif(url) {
        this.state.gif = url;
      },
      sendToHost(_) { },
      sendToJudge(_) { },
      sendToPlayer(_, _2) { }
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
    const sendAllPlayersMock = jest.fn();
    const sendToJudgeMock = jest.fn();
    const getJudgeMock = jest.fn();
    const game = {
      sendAllPlayers: sendAllPlayersMock,
      sendToHost: sendToHostMock,
      sendToJudge: sendToJudgeMock,
      getJudge: getJudgeMock,
      getTheme() {
        return "default";
      },
      state: {
        judge: new Player("UUID", "Player Name", "socket")
      },
      getState() {
        return this.state;
      },
      setGif(_) { }
    };
    const payload = {
      action: "playersready",
      gameID: "XYZZ"
    };
    const response = await parse(payload, game);
    expect(response.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledWith({
      judge: game.state.judge.getSelf(),
      playState: "awaitingGifSelection"
    });
    expect(sendAllPlayersMock).toHaveBeenCalledWith({
      playState: "awaitingGifSelection"
    });
    expect(getJudgeMock).toHaveBeenCalled();
    expect(sendToJudgeMock).toHaveBeenCalledWith({
      judge: true
    });
  });

  describe("newgame action", () => {
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
  });

  describe("eliminatecaption action", () => {
    test("sends updated submissions to host", async () => {
      const sendToHostMock = jest.fn();
      const state = new State("default");
      const one = new Submission("1", "A");
      state.addSubmission(one);
      const two = new Submission("2", "B");
      state.addSubmission(two);
      const game = {
        sendToHost: sendToHostMock,
        state
      };
      const payload = {
        action: "eliminatecaption",
        submission: two,
        gameID: "XXXX"
      };
      const r = await parse(payload, game);
      expect(r.status).toBe(200);
      expect(sendToHostMock).toHaveBeenCalledWith({
        submissions: [
          one
        ]
      });
    });

    test("doesn't allow eliminating the last caption", async () => {
      const sendToHostMock = jest.fn();
      const sendToJudgeMock = jest.fn();
      const state = new State("default");
      const one = new Submission("1", "A");
      state.addSubmission(one);
      const game = {
        sendToHost: sendToHostMock,
        sendToJudge: sendToJudgeMock,
        state
      };
      const payload = {
        action: "eliminatecaption",
        submission: one,
        gameID: "XXXX"
      };
      const r = await parse(payload, game);
      expect(r.status).toBe(200);
      expect(sendToHostMock).not.toHaveBeenCalled();
      expect(sendToJudgeMock).toHaveBeenCalledWith({ "error": "You can't eliminate the last caption" });
    });
  });

  test("choosewinner updates player score and chooses next judge", async () => {
    // Setup
    const sendToHostMock = jest.fn();
    const sendToJudgeMock = jest.fn();
    const getJudgeMock = jest.fn();
    const incScoreMock = jest.fn();
    const clearSubmissionsMock = jest.fn();
    const sendAllPlayersMock = jest.fn();
    const game = {
      players: [
        { id: 1, name: "mary", score: 0, incScore: incScoreMock },
        { id: 2, name: "alice", score: 1, incScore: incScoreMock },
        { id: 3, name: "bob", score: 0, incScore: incScoreMock }
      ],
      sendToHost: sendToHostMock,
      getJudge: getJudgeMock,
      sendToJudge: sendToJudgeMock,
      state: {
        clearSubmissions: clearSubmissionsMock,
        judge: new Player("UUID", "Player Name", "socket")
      },
      sendAllPlayers: sendAllPlayersMock
    };

    // Run test
    const payload = {
      action: "choosewinner",
      winningSubmission: { playerID: 2, caption: "winning caption" }
    };
    const response = await parse(payload, game);

    // Validate results
    expect(response.status).toBe(200);
    expect(incScoreMock).toHaveBeenCalledTimes(1);
    expect(sendToHostMock).toHaveBeenCalledWith({
      judge: game.state.judge.getSelf(),
      playState: "awaitingGifSelection",
      winningSubmission: payload.winningSubmission,
      scores: {
        1: 0,
        2: 1,
        3: 0
      }
    });
    expect(clearSubmissionsMock).toHaveBeenCalledTimes(1);
    expect(getJudgeMock).toHaveBeenCalledTimes(1);
    expect(sendAllPlayersMock).toHaveBeenCalledWith({
      playState: "awaitingGifSelection"
    });
    expect(sendToJudgeMock).toHaveBeenCalledWith({
      judge: true
    });
  });

  test("replacecaption action", async () => {
    // Setup
    const sendToPlayerMock = jest.fn();
    const game = {
      players: [
        new Player(1, "one", "conn")
      ],
      sendToPlayer: sendToPlayerMock,
      captions: new Captions("./__tests__/test-captions.txt")
    };

    // Run test
    const payload = {
      action: "replacecaption",
      playerID: 1
    };
    const response = await parse(payload, game);

    // Validate results
    expect(response.status).toBe(200);
    expect(sendToPlayerMock).toHaveBeenCalledWith({
      caption: game.captions.contents[game.captions.next - 1]
    }, 1);
  });

  test("continueplay action", async () => {
    // Setup
    const sendAllPlayersMock = jest.fn();
    const sendToJudgeMock = jest.fn();
    const sendToHostMock = jest.fn();
    const game = {
      players: [
        new Player(1, "one", "conn"),
        new Player(2, "two", "conn"),
        new Player(3, "three", "conn")
      ],
      state: {
        submissions: [
          new Submission(1, 'caption')
        ]
      },
      sendAllPlayers: sendAllPlayersMock,
      sendToJudge: sendToJudgeMock,
      sendToHost: sendToHostMock,
    };

    // Run test
    const payload = {
      action: "continueplay"
    };
    const response = await parse(payload, game);

    // Validate results
    expect(response.status).toBe(200);
    expect(sendToHostMock).toHaveBeenCalledWith({
      submissions: game.state.submissions,
      playState: "selectWinnerPending"
    });
    expect(sendAllPlayersMock).toHaveBeenCalledWith({
      playState: "selectWinnerPending"
    });
    expect(sendToJudgeMock).toHaveBeenCalledWith({
      submissions: game.state.submissions
    });
  });
});
