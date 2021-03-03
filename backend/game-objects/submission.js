const logger = require("../logger")(module);

module.exports = function Submission(uuid, caption) {
  this.playerId = uuid;
  this.caption = caption;
};
