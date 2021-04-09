const WebSocket = require("ws");
const Game = require("./game-objects/game");
const Player = require("./game-objects/player");
const PlayState = require("./game-objects/play-state");
const { parse } = require("./router");
const _ = require("lodash");
const logger = require("./logger")(module);
const objects = require("./custom-objects");
const { getOffsetMax } = require("./giphy");

SERVER_PORT = 8080;

const server = new WebSocket.Server({ port: SERVER_PORT });

const { v4: uuidv4 } = require("uuid");
var games = new Map();

var connections = [];
var messages = [];
let host = "";

/*
Helper functions
*/

//Parse JSON from URIs
function getJsonFromUrl(url) {
  var result = {};
  if (url) {
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
  } else {
    result = undefined;
  }
  return result;
}

/*
  This block is the players endpoint of the websocket server
*/
server.on("connection", async (socket, req) => {
  //Do this stuff when a player connects to the server

  var players = new Map(); //Map of sockets -> player objects

  let str = req.url;
  logger.debug(str);
  const params = getJsonFromUrl(str.substring(1));
  logger.info(JSON.stringify(params));
  let temp = {};
  if (params && params.action) {
    switch (params.action) {
      case "startgame":
        let theme = params.theme || "default";
        const maxPoints = params.maxPoints || 7;
        const rating = params.rating || 'g';
        let gifOffsetMax = theme === "default" ? 0 : await getOffsetMax(theme);
        logger.info(`gifOffsetMax: ${gifOffsetMax}`);
        // Create game state object
        let game = new Game(socket, params.theme || "default", gifOffsetMax, maxPoints, rating);
        let response = {
          gameID: game.getId(),
          playState: PlayState.Host.waitingForPlayers
        };
        logger.info("Created new game [" + response.gameID + "]");
        games.set(response.gameID, game);
        game.sendToHost(response);
        break;
      case "connect":
        logger.info("New player initiated a connect");
        logger.debug("Params: " + JSON.stringify(params));
        if (games.has(params.gameID)) {
          const game = games.get(params.gameID);
          if (game.getPlayers().map(p => p.name).includes(params.name)) {
            logger.info(`Player ${params.name} tried to connect, but that player name is already in the game.`);
            socket.send(
              JSON.stringify(objects.error(400, "That player name is taken"))
            );
            socket.close();
            break;
          }
          let player = new Player(
            uuidv4(),
            params.name || "No-name",
            socket
          );
          //Add player to players map
          logger.info("New player: " + player.id);
          players.set(player.id, player);

          //Add player to the game state
          game.addPlayer(player);
          logger.info(
            "Added new player; total [" +
            game.players.length +
            "] players"
          );
          //Send captions to player
          var hand = game.dealFirstHand();
          player.send({
            playState: PlayState.Player.waitingForPlayers,
            playerID: player.id,
            captions: hand
          });
          logger.info("Captions sent to player");
          //Send player array to the Host
          let p = { players: game.getPlayers() };
          game.sendToHost(p);
          logger.info("Players sent to host");
        } else {
          logger.info(
            "CONNECT: No games matching code:[" +
              (params.gameID || "") +
              "] started yet"
          );
          socket.send(
            JSON.stringify(objects.error(400, "Game does not exist"))
          );
          socket.close();
        }
        break;
      default:
        socket.send(JSON.stringify(objects.error()));
        socket.close();
        break;
    }
  } else {
    socket.send(JSON.stringify(objects.error()));
  }

  //Do this stuff when a player sends in a message
  socket.on("message", data => {
    logger.debug(data);
    // socket.send(data); //Echo for now
    var obj = JSON.parse(data);
    if (!obj.action) {
      logger.info(`No action provided: ${data}`);
      socket.send(JSON.stringify(objects.error(400, "Missing action")));
    } else if (!obj.gameID || !games.has(obj.gameID)) {
      logger.info(`No game ID provided or game does not exist: ${data}`);
      socket.send(
        JSON.stringify(
          objects.error(400, "Game ID missing or game does not exist")
        )
      );
    } else {
      // Call methods that invoke game logic
      parse(obj, games.get(obj.gameID));
    }
  });

  //Do whatever cleanup needs to be done when a player client disconnects
  socket.on("close", () => {
    logger.info("Goodbye");
  });
});

console.log(`Listening on ws://localhost:${SERVER_PORT}`);
