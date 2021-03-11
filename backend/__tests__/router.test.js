const { parse } = require("../router");

describe("Test suite for router object", () => {
  test("Parse a empty action and game object", () => {
    const game = {};
    const method = "";
    let r = parse(method, game);
    expect(r.status).toBe(400);
  });
});
