const getGif = require("./giphy");
const logger = require("./logger")(module);

const parse = async (method, game) => {
  var ret = { status: 200 };
  switch (method) {
    case "getgif":
      logger.info("getgif action submitted");
      const gifURL = await getGif(game.getTheme(), game.getState().gifOffset++);
      logger.info(`New GIF URL: ${gifURL}`);
      game.setGif(gifURL);
      game.sendToHost(gifURL);
      break;
    case "submitcaption":
      break;
    case "choosewinner":
      break;
    case "eliminatecaption":
      break;
    case "newgame":
      break;
    case "replacecaption":
      break;
    default:
      ret.status = 400;
      break;
  }
  return ret;
};

module.exports = { parse };
