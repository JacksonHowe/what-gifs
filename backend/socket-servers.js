const MultipathServer = require("ws-multipath");
const url = require("url");
const objects = require("./custom-objects");
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
  console.log(params);

  if (
    params === undefined ||
    params.gameID === undefined ||
    params.playerID == undefined ||
    params.name === undefined
  ) {
    console.log("Player didn't pass the correct params");
    socket.send(JSON.stringify(objects.error()));
  } else {
    console.log("Player passed the right params");
    //Send caption to players
    socket.send(JSON.stringify(objects.captions()));
    //Send players array to host when a new player joins
  }

  //Do this stuff when a player sends in a message
  socket.on("message", data => {
    var obj = JSON.parse(data);
    //Call methods that invoke game logic
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
    console.log("Set default");
  } else if (params.theme !== undefined && params.theme !== "default") {
    //Set a default theme
    console.log("custom");
  }

  //Set a GAMEUUID and send it back to the
  socket.send(JSON.stringify(objects.genGameUuid()));

  socket.on("message", data => {
    //Send message to module to process and change things
  });
});

console.log(`Listening on ws://localhost:${SERVER_PORT}`);
