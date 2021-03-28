import React, { Component } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import APIList from "./api-list";
const { v4: uuidv4 } = require("uuid");
const URL = "ws://localhost:8080/";

class ClientPlayer extends Component {
  state = { host: {}, player: {} };

  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  componentDidUpdate() {
    console.log(this.state);
  }

  send(obj, socket) {
    socket.send(JSON.stringify(obj));
  }

  onSend(e) {
    const o = JSON.parse(document.getElementById("requestBox").value);
    if (o.type === "host") {
      //Do host actions
      if (o.action === "startgame") {
        //onpen new host socket
        //Create uuid for the player
        let pid = uuidv4();

        this.setState(prevState => ({
          player: { ...prevState.player, playerID: pid }
        }));

        this.createSocket(true, o);
      } else if (o.action === "newgame") {
        //Do new game request
        console.log("newgame");
        this.send(o, this.state.host.socket);
      } else if (o.action === "playersready") {
        this.send(o, this.state.host.socket);
      } else {
        alert("Does the host send that action?");
        //Host doesn't have other actions as of yet
      }
    } else if (o.type === "player") {
      //do player stuff
      if (o.action === "connect") {
        //open new player socket
        this.createSocket(false, o);
      } else {
        this.send(o, this.state.player.socket);
      }
    }
    // console.log(e);
    // this.state.host.socket.send(document.getElementById("requestBox").value);
  }

  componentWillMount() {}

  createSocket(is_host, params) {
    let p = "";
    let r_box = "";
    if (!is_host) {
      r_box = "player-response";
      p =
        "?action=" +
        params.action +
        "&playerID=" +
        params.playerID +
        "&gameID=" +
        params.gameID +
        "&name=" +
        params.name;
    } else {
      r_box = "host-response";
      p = "?action=" + params.action + "&theme=" + params.theme;
    }
    const socket = new W3CWebSocket(URL + p);

    socket.onopen = () => {
      this.setState(prevState =>
        is_host
          ? { host: { ...prevState.host, connected: true, socket: socket } }
          : {
              player: { ...prevState.player, connected: true, socket: socket }
            }
      );
    };

    socket.onmessage = message => {
      console.log(message.data);
      var obj = JSON.parse(message.data);
      if (obj.status === 400) {
        alert("That last one didn't work");
      }
      if (obj.gameID) {
        this.setState({ gameID: obj.gameID });
      }
      document.getElementById(r_box).value = JSON.stringify(obj, null, 2);
    };

    socket.onclose = () => {
      console.log("Disconnect");
      this.setState(prevState =>
        is_host
          ? { host: { ...prevState.host, connected: false, socket: socket } }
          : {
              player: { ...prevState.player, connected: false, socket: socket }
            }
      );
    };
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
        <br />
        <label class="switch">
          {" "}
          WS Connected: Player
          <input type="checkbox" checked={this.state.player.connected}></input>
        </label>
        <div>
          <APIList
            playerID={this.state.player.playerID}
            gameID={this.state.gameID}
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
