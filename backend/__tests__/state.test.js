const State = require("../game-objects/state");
const Player = require("../game-objects/player");
const Submission = require("../game-objects/submission");
const WebSocket = require("ws");

const ID = "1a2b3c";
const NAME = "Testing BOT";
const ECHO_SERVER = "ws://echo.websocket.org";
const OBJECT = {
  message: "testing message",
  status: 200,
  data: [1, 2, 3, 4, 5]
};

describe("Testing the state object", () => {
  test("Test if the state object creates correctly", () => {
    let state = new State("default");
    expect(state.theme).toEqual("default");
  });

  it("Test if the state object can send to a judge", done => {
    expect.assertions(2);
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        judge = new Player(ID, NAME, ws);
        let state = new State("default");
        state.setJudge(judge);
        expect(state.judge).toEqual(judge);
        state.judge.send(OBJECT);
      })
      .on("message", msg => {
        expect(JSON.parse(msg)).toEqual(OBJECT);
        ws.close();
      })
      .on("close", () => done());
  });

  it("Test adding submissions and sending to the judge", done => {
    expect.assertions(1);
    var state = {};
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        judge = new Player(ID, NAME, ws);
        state = new State("default");
        for (var i = 0; i < 6; i++) {
          var submission = new Submission(i + 1, "Submission " + i);
          state.addSubmission(submission);
        }
        state.setJudge(judge);
        state.judge.send(state.submissions);
      })
      .on("message", msg => {
        expect(JSON.parse(msg)).toEqual(state.submissions);
        ws.close();
      })
      .on("close", () => done());
  });

  it("Test adding submissions and clearing them", done => {
    expect.assertions(1);
    var state = {};
    const ws = new WebSocket(ECHO_SERVER)
      .on("open", () => {
        judge = new Player(ID, NAME, ws);
        state = new State("default");
        for (var i = 0; i < 6; i++) {
          var submission = new Submission(i + 1, "Submission " + i);
          state.addSubmission(submission);
        }
        state.clearSubmissions();
        expect(state.submissions).toEqual([]);
        ws.close();
      })
      .on("message", msg => {})
      .on("close", () => done());
  });
});
