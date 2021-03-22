const randIDObj = require("../custom-objects");
describe("Random code generator tests", () => {
  test("Tests that Game ID's are random", () => {
    let randIdOne = randIDObj.genGameUuid().gameID;
    let randIdTwo = randIDObj.genGameUuid().gameID;
    let randIdThree = randIDObj.genGameUuid().gameID;
    expect(randIdOne).not.toEqual(randIdTwo);
    expect(randIdOne).not.toEqual(randIdThree);
    expect(randIdTwo).not.toEqual(randIdThree);
  });

  test("Test that game ID's are of length 4", () => {
    const randLength = 4;
    let randIdOne = randIDObj.genGameUuid().gameID;
    expect(randIdOne).toHaveLength(randLength);
  });
});
