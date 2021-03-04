const MultipathServer = require("ws-multipath");
const logger = require("./logger")(module);
const url = require("url");
const objects = require("./custom-objects");
// const State = require("./game-state");
HOST_PATH = "/startgame";
PLAYER_PATH = "/connect";
SERVER_PORT = 8080;

const server = new MultipathServer({ port: SERVER_PORT });
const wss_host = new server.createHandler({ path: HOST_PATH });
const wss_players = new server.createHandler({ path: PLAYER_PATH });
const { v4: uuidv4 } = require("uuid");

var players = [];
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
wss_players.on("connection", (socket, req) => {
  //Do this stuff when a player connects to the server
  let str = req.url;
  const params = getJsonFromUrl(str.substring(PLAYER_PATH.length));
  logger.info(params);

  if (
    params === undefined ||
    params.gameID === undefined ||
    params.playerID == undefined ||
    params.name === undefined
  ) {
    logger.error("Player didn't pass the correct params");
    socket.send(JSON.stringify(objects.error()));
    //socket.close()
  } else {
    logger.info("Player passed the right params");
    //Send caption to players
    socket.send(JSON.stringify(objects.captions()));
    //Send players array to host when a new player joins
  }

  //Do this stuff when a player sends in a message
  socket.on("message", data => {
    var obj = JSON.parse(data);
    //Call methods that invoke game logic
  });

  //Do whatever cleanup needs to be done when a player client disconnects
  socket.on("close", () => {
    logger.info("Goodbye");
  });
});

/*
  This block is the hosts endpoint of the websocket server
*/
wss_host.on("connection", (socket, req) => {
  let str = req.url;
  const params = getJsonFromUrl(str.substring(HOST_PATH.length));

  if (params === undefined || params.theme === "default") {
    //Set a default theme
    logger.info("Set default theme");
  } else if (params.theme !== undefined && params.theme !== "default") {
    //Set a default theme
    logger.info("Set custom theme");
  }

  //Set a GAMEUUID and send it back to the
  // socket.send(JSON.stringify(objects.genGameUuid()));
  socket.send("Hello World!");
  socket.on("message", data => {
    //Send message to module to process and change things
  });
  //Do cleanup when the host client disconnects
  socket.on("close", () => {
    logger.info("Goodbye");
  });
});

console.log(`Listening on ws://localhost:${SERVER_PORT}`);
