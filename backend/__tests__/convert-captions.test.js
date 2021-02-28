const Captions = require("../convert-captions");
var object = "";
describe("Verify the Captions objects", () => {
  beforeEach(() => {
    object = new Captions("./__tests__/test-captions.txt");
    return;
  });
  test("Read test file and verify it has everything it needs", () => {
    expect(object.submissions).toBeDefined();
    expect(object.submissions.length).toBeGreaterThan(0);
    let c = object.getCaption();
    expect(object.submissions).toContain(c);
  });

  test("Test if shuffle really works", () => {
    let arr1 = object.submissions;
    object = new Captions("./__tests__/test-captions.txt");
    let arr2 = object.submissions;
    expect(arr1).not.toEqual(arr2);
  });

  test("Test corner cases", () => {
    let length = object.submissions.length;
    expect(length).toEqual(object.submissions.length);
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
