const logger = require("../logger")(module);

module.exports = function Player(uuid, name, conn) {
  this.id = uuid;
  this.name = name;
  this.connectionId = conn;
  this.score = 0;

  this.incScore = function() {
    this.score++;
  };
  this.setConnectionId = function(conn) {
    this.connectionId = conn;
  };

  this.getSelf = function() {
    return { id: this.id, name: this.name, score: this.score };
  };
  this.send = function(obj) {
    this.connectionId.send(JSON.stringify(obj));
  };
};
