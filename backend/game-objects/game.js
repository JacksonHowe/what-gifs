const logger = require("../logger")(module);
const Captions = require("./captions");
const State = require("./state");
const CAPTION_FILE = "./../files/captions.txt";
const HAND_SIZE = 5;

module.exports = function Game(conn, theme) {
  this.id = "";
  this.host = conn; //Websocket connection
  this.players = [];
  this.nextJudge = 0;
  this.captions = new Captions(CAPTION_FILE);
  this.state = new State(theme);

  this.getJudge = function() {
    if (this.players.length !== 0) {
      if (this.nextJudge > this.players.length - 1) {
        //All players have been judge, start over

        this.nextJudge = 0;
      }
      this.state.setJudge(this.players[this.nextJudge++]);
    }
  };

  this.addPlayer = function(newPlayer) {
    this.players.push(newPlayer);
  };

  this.dealFirstHand = function() {
    var hand = [];
    for (var i = 0; i < HAND_SIZE; i++) {
      hand.push(this.captions.getCaption());
    }
    return hand;
  };

  this.setState = function(theme) {
    this.state = new State(theme);
  };

  this.sendAllPlayers = function(object) {
    for (var i = 0; i < players.length; i++) {
      this.players[i].send(object);
    }
  };

  this.sendToJudge = function(object) {
    this.state.judge.send(object);
  };

  this.sendToHost = function(object) {
    this.host.send(JSON.stringify(object));
  };

  this.setId = function(id) {
    this.id = id;
  };
};
