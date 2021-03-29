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
  beforeEach(() => { });
  test("Test if the game object creates properly", () => { });

  it("Test if the game object can create with a socket object", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(ws, "default");
        game.setId(GAME_ID);
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
        game.setId(GAME_ID);
        expect(game.state.theme).toBe("default");
        ws.close();
      })
      .on("message", msg => { })
      .on("close", () => done());
  });

  it("Test if the game object can set a Judge", done => {
    expect.assertions(4);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(ws, "default");
        game.setId(GAME_ID);
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
      .on("message", msg => { })
      .on("close", () => done());
  });

  it("Test if the state object can deal hand", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let game = new Game(ws, "default");
        game.setId(GAME_ID);
        expect(game.dealFirstHand().length).toBe(HAND_SIZE);
        ws.close();
      })
      .on("message", msg => { })
      .on("close", () => done());
  });
});

describe("Test the Game object's UUID generator", () => {
  it("Tests that the UUIDs are random", done => {
    expect.assertions(3);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let one = new Game(ws, "default").getId();
        let two = new Game(ws, "default").getId();
        let three = new Game(ws, "default").getId();
        expect(one).not.toEqual(two);
        expect(one).not.toEqual(three);
        expect(two).not.toEqual(three);
        ws.close();
      })
      .on("message", _ => { })
      .on("close", () => done());
  });

  it("Tests that the game IDs are of length 4", done => {
    expect.assertions(1);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        let one = new Game(ws, "default").getId();
        expect(one).toHaveLength(4);
        ws.close();
      })
      .on("message", _ => { })
      .on("close", () => done());
  });
});
