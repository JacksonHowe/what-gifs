const Captions = require("../game-objects/captions");

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
