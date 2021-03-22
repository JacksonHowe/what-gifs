const Captions = require("../game-objects/captions");
const randIDObj = require("../custom-objects");
var object = "";
describe("Verify the Captions objects", () => {
  beforeEach(() => {
    object = new Captions("./__tests__/test-captions.txt");
  });

  test("Read test file and verify it has everything it needs", () => {
    expect(object.contents).toBeDefined();
    expect(object.contents.length).toBeGreaterThan(0);
    let c = object.getCaption();
    expect(object.contents).toContain(c);
  });

  test("Test if shuffle really works", () => {
    let arr1 = object.contents;
    object = new Captions("./__tests__/test-captions.txt");
    let arr2 = object.contents;
    expect(arr1).not.toEqual(arr2);
  });

  test("Tests that Game ID's are random", () => {
    let randIdOne = randIDObj.genGameUuid();
    let randIdTwo = randIDObj.genGameUuid();
    let randIdThree = randIDObj.genGameUuid();
    expect(randIdOne).not.toEqual(randIdTwo);
    expect(randIdOne).not.toEqual(randIdThree);
    expect(randIdTwo).not.toEqual(randIdThree);
  });

  test("Test that game ID's are of length 4", () => {
    const randLength = 4;
    let randIdOne = randIDObj.genGameUuid();
    expect(randIdOne).toHaveLength(randLength);
  });

  test("Test corner cases", () => {
    let length = object.contents.length;
    expect(length).toEqual(object.contents.length);
    var double = length * 2;
    //Try too many calls to get Caption
    for (var i = 0; i < double; i++) {
      expect(object.next).toBeLessThan(length);
      try {
        object.getCaption();
      } catch {
        fail();
      }
    }
  });
});







