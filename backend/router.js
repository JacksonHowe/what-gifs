const getGif = require("./giphy");
const logger = require("./logger")(module);
const Submission = require("./game-objects/submission");
const PlayState = require("./game-objects/play-state");
const player = require("./game-objects/player");

const getPlayerById = (players, id) => {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
};

const playersReady = (request, game) => {
  //Send awaitGifSelection state to Host
  game.sendToHost({ playState: PlayState.Host.awaitingGifSelection });
  //Select a judge and send that state to judge
  game.getJudge();
  game.sendToJudge({ playState: PlayState.Player.judge });
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

const chooseWinner = (request, game) => {
  // Update score of winner and prepare scores to be sent to host
  let scores = {};
  for (let player of game.players) {
    if (player.id == request.winningSubmission.playerID) {
      player.incScore();
    }
    scores[player.id] = player.score;
  }
  // Send new round play state, winning submission, and scores to host
  game.sendToHost({
    playState: PlayState.Host.awaitingGifSelection,
    winningSubmission: request.winningSubmission,
    scores
  });
  // Choose new judge and let them know they need to choose a GIF
  game.getJudge();
  game.sendToJudge({ playState: PlayState.Player.judge });
};

const replaceCaption = (request, game) => {
  var player = getPlayerById(game.players, request.playerID);
  const new_caption = game.captions.getCaption();
  player.send({ caption: new_caption });
};

const setGif = (request, game) => {
  // Don't need to save any info about finalizing the gif, just send a message to
  // the host and players saying its time to start submitting captions
  game.sendToHost({ playState: PlayState.Host.awaitingSubmissions });
  game.sendAllPlayers({ playState: PlayState.Player.awaitingSubmissions });
};

const eliminateCaption = (request, game) => {
  // Remove all submissions from game state with the requested caption
  game.state.removeSubmission(request.submission);
  // Now send the updated list to the host
  game.sendToHost({ submissions: game.state.submissions });
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
    case "setgif":
      logger.info("Gif is confirmed");
      setGif(request, game);
      break;
    case "submitcaption":
      logger.info("Player submitting caption");
      recordSubmission(request, game);
      break;
    case "choosewinner":
      logger.info("Winner was chosen");
      chooseWinner(request, game);
      break;
    case "eliminatecaption":
      logger.info("Caption eliminated");
      eliminateCaption(request, game);
      break;
    case "newgame":
      logger.info("New game initiated");
      //Update theme string if provided
      if (request.theme) {
        game.setTheme(request.theme);
      }
      //Send players list to Host
      game.sendToHost({ players: game.getPlayers() });
      //Send 5 captions to each player
      for (var i = 0; i < game.players.length; i++) {
        var hand = game.dealFirstHand();
        game.players[i].send(hand);
      }

      break;
    case "replacecaption":
      logger.info("Player requested new caption");
      replaceCaption(request, game);
      break;
    case "playersready":
      playersReady(request, game);
      break;
    default:
      ret.status = 400;
      break;
  }
  return ret;
};

module.exports = { parse };
