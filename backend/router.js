const getGif = require("./giphy");
const logger = require("./logger")(module);
const Submission = require("./game-objects/submission");

const getPlayerById = (players, id) => {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
};

const recordSubmission = (request, game) => {
  var submission = new Submission(request.playerID, request.caption);
  logger.debug(`Submission to add ${JSON.stringify(submission)}`);
  //Check if this player already submitted a caption
  game.state.submissions.find(element => element.playerID === request.playerID)
    ? logger.info("Player attempted to resubmit, ignoring")
    : game.state.addSubmission(submission);

  if (game.state.submissions.length >= game.players.length - 1) {
    //Send submissions to Host
    game.sendToHost({ submissions: game.state.submissions });
    //Send to the judge
    game.sendToJudge({ submissions: game.state.submissions });
    game.state.clearSubmissions();
  }
  logger.info(`Sending new caption back to player`);
  replaceCaption(request, game);
};

const replaceCaption = (request, game) => {
  var player = getPlayerById(game.players, request.playerID);
  const new_caption = game.captions.getCaption();
  player.send({ caption: new_caption });
};

const parse = async (request, game) => {
  var ret = { status: 200 };
  switch (request.action) {
    case "getgif":
      logger.info("New gif requested");
      const gifUrl = await getGif(game.getTheme(), game.getState().gifOffset++);
      game.setGif(gifUrl);
      game.sendToHost({ gifUrl });
      break;
    case "submitcaption":
      logger.info("Player submitting caption");
      recordSubmission(request, game);
      break;
    case "choosewinner":
      logger.info("Winner was chosen");
      break;
    case "eliminatecaption":
      logger.info("Caption eliminated");
      break;
    case "newgame":
      logger.info("New game initiated");
      break;
    case "replacecaption":
      logger.info("Player requested new caption");
      replaceCaption(request, game);
      break;
    default:
      ret.status = 400;
      break;
  }
  return ret;
};

module.exports = { parse };
