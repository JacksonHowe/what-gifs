import React, { Component } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import APIList from "./api-list";
const { v4: uuidv4 } = require("uuid");

class ClientPlayer extends Component {
  state = { host: {}, player: {} };

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  onSend(e) {
    console.log(e);
    const o = JSON.parse(document.getElementById("requestBox").value);
    this.state.ws_client.send(document.getElementById("requestBox").value);
  }

  componentWillMount() {}

  hostConnect(e) {
    const URL = "ws://localhost:8080/startgame?theme=default";
    document.getElementById("requestBox").value = URL;
    const host = new W3CWebSocket(URL);
    // console.log(host);
    host.onopen = () => {
      console.log("WebSocket Client Connected");

      this.setState(prevState => ({
        host: { ...prevState.host, connected: true }
      }));
    };

    host.onmessage = message => {
      // console.log(message.data);
      var obj = JSON.parse(message.data);
      document.getElementById("host-response").value = JSON.stringify(
        obj,
        null,
        2
      );
      if (obj.gameID) {
        this.setState({ gameID: obj.gameID });
      }
    };

    this.setState(prevState => ({
      host: { ...prevState.host, socket: host }
    }));
  }

  playerConnect(e) {
    //Set gameID player ID and name in url
    var gameID = this.state.gameID;
    var playerID = uuidv4();
    var name = "Testing Bot";
    this.setState({ player: { playerID: playerID, name: name } });
    let URL = `ws://localhost:8080/connect?gameID=${gameID}&playerID=${playerID}&name=${name}`;
    document.getElementById("requestBox").value = URL;
    const player = new W3CWebSocket(URL);

    player.onopen = () => {
      console.log("WebSocket Player Client Connected");
      this.setState(prevState => ({
        player: { ...prevState.player, connected: true }
      }));
    };

    player.onmessage = message => {
      console.log(message.data);
      var obj = JSON.parse(message.data);

      document.getElementById("player-response").value = JSON.stringify(
        obj,
        null,
        2
      );
    };

    player.onclose = () => {
      console.log("Disconnect");
    };

    this.setState(prevState => ({
      player: { ...prevState.player, socket: player }
    }));
  }

  playerDisconnect(e) {
    this.state.player.socket.close();
    this.setState(prevState => ({
      player: { ...prevState.player, connected: false }
    }));
  }

  render() {
    return (
      <div>
        <label class="switch">
          {" "}
          WS Connected: Host
          <input type="checkbox" checked={this.state.host.connected}></input>
        </label>
        <label class="switch">
          {" "}
          WS Connected: Player
          <input type="checkbox" checked={this.state.player.connected}></input>
        </label>
        <div>
          <APIList
            hostConnect={this.hostConnect.bind(this)}
            playerConnect={this.playerConnect.bind(this)}
            playerDisconnect={this.playerDisconnect.bind(this)}
            playerID={this.state.player.playerID}
          />
        </div>
        <br />
        <label id="boxlabel" class="textarea">
          Request
          <textarea id="requestBox"></textarea>
        </label>
        <button onClick={e => this.onSend(e)}>Send Request</button>
        <br />
        <br />
        <label id="boxlabel" class="textarea">
          Host Response
          <textarea id="host-response" readonly></textarea>
        </label>
        <label id="boxlabel" class="textarea">
          Player Response
          <textarea id="player-response" readonly></textarea>
        </label>
      </div>
    );
  }
}

export default ClientPlayer;
