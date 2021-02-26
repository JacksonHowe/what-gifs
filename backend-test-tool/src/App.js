import React, { Component } from "react";
import "./App.css";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import ClientPlayer from "./client-player";
const player_client = new W3CWebSocket("ws://localhost:8080/players");

class App extends Component {
  render() {
    return (
      <div>
        <ClientPlayer client={player_client} />
      </div>
    );
  }
}

export default App;
