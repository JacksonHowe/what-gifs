var WebSocket = require("ws");

describe("Testing the host socket endpoints", () => {
  it("Connect host to /startgame with no paramters and receive gameID back", done => {
    expect.assertions(1);

    const ws = new WebSocket(`ws://localhost:8080/startgame`)
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Connect host to /startgame with default theme and receive gameID back", done => {
    expect.assertions(1);

    const ws = new WebSocket(`ws://localhost:8080/startgame?theme=default`)
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Connect host to /startgame with custom theme and receive gameID back", done => {
    expect.assertions(1);

    const ws = new WebSocket(`ws://localhost:8080/startgame?theme=sports`)
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Connect host to /startgame with bad paramter and receive gameID back", done => {
    expect.assertions(1);

    const ws = new WebSocket(`ws://localhost:8080/startgame?fakeParam=sports`)
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });

  it("Connect host to /startgame with more parameters than requried and receive gameID back", done => {
    expect.assertions(1);

    const ws = new WebSocket(
      `ws://localhost:8080/startgame?theme=sports&extra=extraArg`
    )
      .on("message", msg => {
        expect(JSON.parse(msg).gameID).toBeDefined();
        ws.close();
      })
      .on("close", () => done());
  });
});
