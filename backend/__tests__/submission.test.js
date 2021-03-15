const Submission = require("../game-objects/submission");
const ID = "1a2b3c";
const CAPTION =
  "That face you make when you're parents forgot to make you rich";

describe("Test the submission object", () => {
  test("Does thet object properly", () => {
    let object = new Submission(ID, CAPTION);
    expect(object.playerID).toEqual(ID);
    expect(object.caption).toEqual(CAPTION);
  });
});
