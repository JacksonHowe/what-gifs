const State = require("../game-objects/state");
const Player = require("../game-objects/player");
const Game = require("../game-objects/game");
const Submission = require("../game-objects/captions");
const WebSocket = require("ws");
const HAND_SIZE = 5;
const GAME_ID = "WDTY";
const ID = "1a2b3c";
const NAME = "Testing BOT";
const ID2 = "qazwsx";
const NAME2 = "Alice Smith";
const ECHO_SERVER = "ws://echo.websocket.org";
const OBJECT = {
  message: "testing message",
  status: 200,
  data: [1, 2, 3, 4, 5]
};
var temp = {};

describe("Testing the game object", () => {
  beforeEach(() => {});
  test("Test if the game object creates properly", () => {});

  it("Test if the game object can create with a socket object", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(GAME_ID, ws, "default");
        game.host.send(JSON.stringify(OBJECT));
      })
      .on("message", msg => {
        expect(JSON.parse(msg)).toEqual(OBJECT);
        ws.close();
      })
      .on("close", () => done());
  });

  it("Test if the game object creates the state properly", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(GAME_ID, ws, "default");
        expect(game.state.theme).toBe("default");
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });

  it("Test if the game object can set a Judge", done => {
    expect.assertions(4);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(GAME_ID, ws, "default");
        let p1 = new Player(ID, NAME, {});
        let p2 = new Player(ID2, NAME2, {});
        game.addPlayer(p1);
        game.addPlayer(p2);
        expect(game.state.judge).toBeDefined();
        expect(game.state.judge).toEqual(p1);
        game.getJudge();
        expect(JSON.stringify(game.state.judge)).toEqual(JSON.stringify(p2));
        game.getJudge(); //This should cause rollover in the counter
        expect(game.state.judge).toEqual(p1);
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });

  it("Test if the state object can deal hand", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(GAME_ID, ws, "default");
        expect(game.dealFirstHand().length).toBe(HAND_SIZE);
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });
});
