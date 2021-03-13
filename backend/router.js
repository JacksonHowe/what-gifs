const getGif = require("./giphy");
const logger = require("./logger")(module);

const parse = async (method, game) => {
  var ret = { status: 200 };
  switch (method) {
    case "getgif":
      const gifUrl = await getGif(game.getTheme(), game.getState().gifOffset++);
      game.setGif(gifUrl);
      game.sendToHost({ gifUrl });
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
