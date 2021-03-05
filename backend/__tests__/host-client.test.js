var WebSocket = require("ws");
const URL = "ws://localhost:8080/";
describe("action: startgame tests", () => {
  it("Start a default game", done => {
    expect.assertions(1);
    var object = {
      type: "host",
      action: "startgame",
      theme: "default"
    };
    const ws = new WebSocket(
      URL + "?action=" + object.action + "&theme=" + object.theme
    )
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Start game with different theme", done => {
    expect.assertions(1);
    var object = {
      type: "host",
      action: "startgame",
      theme: "trending"
    };
    const ws = new WebSocket(
      URL + "?action=" + object.action + "&theme=" + object.theme
    )
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Start game without theme passed", done => {
    expect.assertions(1);
    var object = {
      type: "host",
      action: "startgame",
      theme: "default"
    };
    const ws = new WebSocket(URL + "?action=" + object.action)
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Attempt to start game with no parameters", done => {
    expect.assertions(1);

    const ws = new WebSocket(URL)
      .on("message", msg => {
        expect(JSON.parse(msg).status).toBe(400);
        ws.close();
      })
      .on("close", () => done());
  });
  it("Attempt to start game with wrong parameters", done => {
    expect.assertions(1);
    var object = {
      type: "host",
      action: "startgame",
      theme: "default"
    };
    const ws = new WebSocket(
      URL + "?fakeParam=" + object.action + "&wrongParam=" + object.theme
    )
      .on("message", msg => {
        expect(JSON.parse(msg).status).toBe(400);
        ws.close();
      })
      .on("close", () => done());
  });

  it("Start game with extra parameters, ignores it", done => {
    expect.assertions(1);
    var object = {
      type: "host",
      action: "startgame",
      theme: "default"
    };
    const ws = new WebSocket(
      URL +
        "?action=" +
        object.action +
        "&theme=" +
        object.theme +
        "&extra=" +
        object.theme
    )
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });
});
