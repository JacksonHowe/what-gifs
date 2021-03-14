const logger = require("../logger")(module);

module.exports = function Submission(uuid, caption) {
  this.playerID = uuid;
  this.caption = caption;
};
