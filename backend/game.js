const Captions = require("./convert-captions");
const CAPTION_FILE = "../files/captions.txt";
module.exports = function Game() {
  this.id = "";
  this.socket = {};
  this.host = {};
  this.players = [];
  this.captions = new Captions(CAPTION_FILE);
  this.state = {};
};
