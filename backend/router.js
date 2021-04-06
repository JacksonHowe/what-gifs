const getGif = require("./giphy");
const logger = require("./logger")(module);
const Submission = require("./game-objects/submission");
const PlayState = require("./game-objects/play-state");
const player = require("./game-objects/player");

const playersReady = (request, game) => {
  //Select a judge and send that state to judge
  game.getJudge();
  game.sendAllPlayers({ playState: PlayState.Player.awaitingGifSelection })
  game.sendToJudge({ judge: true });
  //Send awaitGifSelection state and new judge to Host
  game.sendToHost({
    playState: PlayState.Host.awaitingGifSelection,
    judge: game.state.judge.getSelf()
  })
};

const recordSubmission = (request, game) => {
  var submission = new Submission(request.playerID, request.caption);
  logger.debug(`Submission to add ${JSON.stringify(submission)}`);
  //Check if this player already submitted a caption
  game.state.submissions.find(element => element.playerID === request.playerID)
    ? logger.info("Player attempted to resubmit, ignoring")
    : game.state.addSubmission(submission);
  game.sendToPlayer({ playState: PlayState.Player.selectWinnerPending }, request.playerID)

  if (game.state.submissions.length >= game.players.length - 1) {
    // Start the judging, but don't update all player play states since
    // they've already been updated by this function.
    startJudging(request, game, false);
    //Send submissions to Host
    // game.sendToHost({
    //   submissions: game.state.submissions,
    //   playState: PlayState.Host.selectWinnerPending
    // });
    //Send to the judge
    // game.sendToJudge({
    //   submissions: game.state.submissions,
    //   playState: PlayState.Player.selectWinnerPending
    // });
  }
  logger.info(`Sending new caption back to player`);
  replaceCaption(request, game);
};

const startJudging = (request, game, updateAllPlayersPlayState) => {
  // Send submissions to Host
  game.sendToHost({
    submissions: game.state.submissions,
    playState: PlayState.Host.selectWinnerPending
  });
  // Update all players to "selectWinnerPending" game state to ensure
  // no more submissions are sent and send submissions to Judge.
  // If the players have already been updated, just update the Judge.
  if (updateAllPlayersPlayState) {
    game.sendAllPlayers({ playState: PlayState.Player.selectWinnerPending });
    game.sendToJudge({
      submissions: game.state.submissions
    });
  } else {
    game.sendToJudge({
      submissions: game.state.submissions,
      playState: PlayState.Player.selectWinnerPending
    });
  }
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
  // Choose new judge and let them know they need to choose a GIF
  game.state.clearSubmissions();
  game.getJudge();
  game.sendAllPlayers({ playState: PlayState.Player.awaitingGifSelection })
  game.sendToJudge({ judge: true });
  // Send new round play state, winning submission, scores, and new judge to host
  game.sendToHost({
    playState: PlayState.Host.awaitingGifSelection,
    winningSubmission: request.winningSubmission,
    scores,
    judge: game.state.judge.getSelf()
  });
};

const replaceCaption = (request, game) => {
  game.sendToPlayer({ caption: game.captions.getCaption() }, request.playerID);
};

const setGif = (request, game) => {
  // Don't need to save any info about finalizing the gif, just send a message to
  // the host and players saying its time to start submitting captions
  game.sendToHost({ playState: PlayState.Host.awaitingSubmissions });
  game.sendAllPlayers({ playState: PlayState.Player.awaitingSubmissions });
};

const getNewGif = async game => {
  const gifUrl = await getGif(game.getTheme());
  game.setGif(gifUrl);
  game.sendToHost({ gifUrl });
};

const eliminateCaption = (request, game) => {
  if (game.state.submissions.length < 2) {
    game.sendToJudge(objects.error(400, "You can't eliminate the last caption"));
    return;
  }
  // Remove all submissions from game state with the requested caption
  game.state.removeSubmission(request.submission.caption);
  // Now send the updated list to the host
  game.sendToHost({ submissions: game.state.submissions });
};

const parse = async (request, game) => {
  var ret = { status: 200 };
  switch (request.action) {
    case "getgif":
      logger.info("New gif requested");
      await getNewGif(game);
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
      await getNewGif(game);
      playersReady(request, game);
      break;
    case "continueplay":
      startJudging(request, game, true);
      break;
    default:
      ret.status = 400;
      break;
  }
  return ret;
};

module.exports = { parse };
