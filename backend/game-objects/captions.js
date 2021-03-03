var fs = require("fs");
DEFAULT_CAPTION_FILE_PATH = "./../files/captions.txt";

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = function Captions(caption_file = DEFAULT_CAPTION_FILE_PATH) {
  //Read in the captions file as an array
  var text = fs.readFileSync(caption_file, "utf-8");
  var textByLine = text.split("\n");
  textByLine.pop(); //Remove the end line ''
  shuffle(textByLine);

  this.contents = textByLine;
  this.next = 0;
  this.getCaption = function() {
    if (this.next >= this.contents.length - 1) {
      //All cards used up
      shuffle(this.contents); //Reshuffle and begin again
      this.next = 0;
    }
    return this.contents[this.next++];
  };
};
