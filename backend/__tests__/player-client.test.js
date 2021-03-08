var WebSocket = require("ws");
const URL = "ws://localhost:8080/";
const ID = "123";
const GAMEID = "WDTY";

describe("Testing the player socket endpoints", () => {
  //I'm not sure how to test the positive cases of this
  //It depends on a game being started prior
  it("Attempt to join game without any parameters", done => {
    expect.assertions(1);

    const ws = new WebSocket(URL)
      .on("message", msg => {
        expect(JSON.parse(msg).status).toBe(400);

        ws.close();
      })
      .on("close", () => done());
  });
});
