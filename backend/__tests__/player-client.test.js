var WebSocket = require("ws");
CLIENT_ENDPOINT = "/connect";
describe("Testing the player socket endpoints", () => {
  it(CLIENT_ENDPOINT + " with no paramters and receive error back", done => {
    expect.assertions(1);

    const ws = new WebSocket("ws://localhost:8080" + CLIENT_ENDPOINT)
      .on("message", msg => {
        console.log(msg);
        expect(JSON.parse(msg).status).toBe(400);
        // expect(10).toBe(10);
        ws.close();
      })
      .on("close", () => done());
  });

  it(CLIENT_ENDPOINT + " with fake paramters and receive error back", done => {
    expect.assertions(1);

    const ws = new WebSocket(
      "ws://localhost:8080" + CLIENT_ENDPOINT + "?fakeParam=123"
    )
      .on("message", msg => {
        console.log(msg);
        expect(JSON.parse(msg).status).toBe(400);
        // expect(10).toBe(10);
        ws.close();
      })
      .on("close", () => done());
  });

  it(CLIENT_ENDPOINT + " with not enough params and receive error", done => {
    expect.assertions(1);

    const ws = new WebSocket(
      "ws://localhost:8080" + CLIENT_ENDPOINT + "?gameID=WDYM&name=alice"
    )
      .on("message", msg => {
        console.log(msg);
        expect(JSON.parse(msg).status).toBe(400);

        // expect(10).toBe(10);
        ws.close();
      })
      .on("close", () => done());
  });

  it(
    CLIENT_ENDPOINT + " with correct params and receive captions back",
    done => {
      expect.assertions(2);

      const ws = new WebSocket(
        "ws://localhost:8080" +
          CLIENT_ENDPOINT +
          "?gameID=WDYM&playerID=abc&name=alice"
      )
        .on("message", msg => {
          console.log(msg);
          expect(JSON.parse(msg).status).toBe(200);
          expect(JSON.parse(msg).captions).toBeDefined();
          // expect(10).toBe(10);
          ws.close();
        })
        .on("close", () => done());
    }
  );

  it(
    CLIENT_ENDPOINT +
      " with extra params (ignore them) and receive captions back",
    done => {
      expect.assertions(2);

      const ws = new WebSocket(
        "ws://localhost:8080" +
          CLIENT_ENDPOINT +
          "?gameID=WDYM&playerID=abc&name=alice&oneMore=extra"
      )
        .on("message", msg => {
          console.log(msg);
          expect(JSON.parse(msg).status).toBe(200);
          expect(JSON.parse(msg).captions).toBeDefined();
          // expect(10).toBe(10);
          ws.close();
        })
        .on("close", () => done());
    }
  );
});
