import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

class APIList extends Component {
  state = { host: {}, player: {} };
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    console.log(this.state);
  }
  //Request link functions
  setRequest(obj) {
    document.getElementById("requestBox").value = JSON.stringify(obj, null, 2);
  }

  submitCaption(e) {
    const obj = {
      type: "player",
      action: "submitCaption",
      caption: "<String here>",
      playerID: this.props.playerID
    };
    this.setRequest(obj);
  }

  startGame(e) {
    const obj = { type: "host", action: "startgame", theme: "default" };
    this.setRequest(obj);
  }

  connect(e) {
    const obj = {
      type: "player",
      action: "connect",
      playerID: this.props.playerID,
      gameID: this.props.gameID,
      name: "<insert name>"
    };
    this.setRequest(obj);
  }

  getGif(e) {
    const obj = {
      type: "player",
      action: "getgif",
      playerID: this.props.playerID,
      gameID: this.props.gameID
    };
    this.setRequest(obj);
  }

  chooseWinner(e) {
    const obj = {
      type: "player",
      action: "choosewinnner",
      winningSubmission: "<Submission>",
      gameID: this.props.gameID
    };
    this.setRequest(obj);
  }

  eliminateCaption(e) {
    const obj = {
      type: "player",
      action: "eliminatecaption",
      submission: "<Submission>",
      gameID: this.props.gameID
    };
    this.setRequest(obj);
  }

  newGame(e) {
    const obj = {
      type: "host",
      action: "newgame",
      theme: "<String>",
      gameID: this.props.gameID
    };
    this.setRequest(obj);
  }

  replaceCaption(e) {
    const obj = {
      type: "player",
      action: "replacecaption",
      playerID: this.props.playerID,
      gameID: this.props.gameID
    };
    this.setRequest(obj);
  }

  render() {
    return (
      <div>
        <li>
          <button onClick={e => this.startGame(e)}>action: startgame</button>
        </li>
        <li>
          <button onClick={e => this.connect(e)}>action: connect</button>
        </li>
        <li>
          <button onClick={e => this.getGif(e)}>action: getgif</button>
        </li>
        <li>
          <button onClick={e => this.submitCaption(e)}>
            action: submitcaption
          </button>
        </li>
        <li>
          <button onClick={e => this.chooseWinner(e)}>
            action: choosewinner
          </button>
        </li>
        <li>
          <button onClick={e => this.eliminateCaption(e)}>
            action: eliminatecaption
          </button>
        </li>
        <li>
          <button onClick={e => this.newGame(e)}>action: newgame</button>
        </li>
        <li>
          <button onClick={e => this.replaceCaption(e)}>
            action: replacecaption
          </button>
        </li>
      </div>
    );
  }
}
export default APIList;
