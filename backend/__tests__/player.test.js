const Player = require("../game-objects/player");
const WebSocket = require("ws");

const ID = "1a2b3c";
const NAME = "Testing BOT";
const ECHO_SERVER = "ws://echo.websocket.org";
const OBJECT = {
  message: "testing message",
  status: 200,
  data: [1, 2, 3, 4, 5]
};

var player = "";
var connection = {};
describe("Verify the Captions objects", () => {
  it("Test if the Player object create properly", done => {
    expect.assertions(1);

    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        player = new Player(ID, NAME, ws);
        player.send(OBJECT);
      })
      .on("message", msg => {
        expect(JSON.parse(msg)).toEqual(OBJECT);
        ws.close();
      })
      .on("close", () => done());
  });

  it("Test the score incrementing", done => {
    expect.assertions(1);

    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        player = new Player(ID, NAME, ws);

        var score = player.score;
        for (var i = 0; i < 100; i++) {
          player.incScore();
          score++;
        }
        expect(score).toBe(player.score);
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });

  it("Test setConnectionId() method", done => {
    expect.assertions(3);
    player = new Player(ID, NAME, undefined);
    expect(player.connectionId).not.toBeDefined();

    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        player.setConnectionId(ws);
        expect(player.connectionId).toBeDefined();
        player.send(OBJECT);
      })
      .on("message", msg => {
        expect(JSON.parse(msg)).toEqual(OBJECT);
        ws.close();
      })
      .on("close", () => done());
  });
});
