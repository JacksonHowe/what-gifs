const State = require("../state");
const Player = require("../player");
const Game = require("../game");
const Submission = require("../captions");
const WebSocket = require("ws");
const HAND_SIZE = 5;
const ID = "1a2b3c";
const NAME = "Testing BOT";
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
        let game = new Game(ws, "default");
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
        let game = new Game(ws, "default");
        expect(game.state.theme).toBe("default");
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });

  it("Test if the game object can set a Judge", done => {
    expect.assertions(2);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(ws, "default");
        let p1 = new Player(ID, NAME, {});
        let p2 = new Player(ID, NAME, {});
        game.addPlayer(p1);
        game.addPlayer(p2);
        game.getJudge();
        expect(game.state.judge).toBeDefined();
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
        let game = new Game(ws, "default");
        expect(game.dealFirstHand().length).toBe(HAND_SIZE);
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });
});
