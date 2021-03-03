const logger = require("../logger")(module);

module.exports = function Player(uuid, name, connectionId) {
  this.id = uuid;
  this.name = name;
  this.connectionId = connectionId;
  this.score = 0;

  this.incScore = function() {
    this.score++;
    logger.info("Player.score incremented to: " + this.score);
  };
  this.setConnectionId = function(conn) {
    this.connectionId = conn;
  };
  this.send = function(obj) {
    logger.info(">>>> Player.send()");
    this.connectionId.send(JSON.stringify(obj));
  };
};
