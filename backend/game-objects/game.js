const logger = require("../logger")(module);
const Captions = require("./captions");
const State = require("./state");
const CAPTION_FILE = "./../files/captions.txt";
const HAND_SIZE = 5;

module.exports = function Game(gameID, conn, theme) {
  this.id = gameID;
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

  this.getPlayers = function() {
    var arr = [];
    for (var i = 0; i < this.players.length; i++) {
      arr.push(this.players[i].getSelf());
    }
    return arr;
  };

  this.addPlayer = function(newPlayer) {
    if (this.players.length === 1) {
      this.getJudge();
    }
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

  this.getState = function() {
    return this.state;
  };

  this.sendAllPlayers = function(object) {
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].send(object);
    }
  };

  this.sendToJudge = function(object) {
    this.state.judge.send(object);
  };

  this.sendToPlayer = function(object, playerID) {
    const player = this.players.find(function(player) {
      return player.id === playerID
    })
    player.send(object);
  };

  this.sendToHost = function(object) {
    this.host.send(JSON.stringify(object));
  };

  this.setId = function(id) {
    this.id = id;
  };

  this.getTheme = function() {
    return this.state.getTheme();
  };
  this.setTheme = function(t) {
    this.state.setTheme(t);
  };

  this.setGif = function(url) {
    this.state.setGif(url);
  };
};
