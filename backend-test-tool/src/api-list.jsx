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

  getCard(e) {
    console.log("getcard");
  }

  submitCaption(e) {
    const obj = {
      action: "submitCaption",
      caption: "<String here>",
      playerID: this.props.playerID
    };
    this.setRequest(obj);
  }

  getGif(e) {
    const obj = { action: "getgif", playerID: this.props.playerID };
    this.setRequest(obj);
  }

  chooseWinner(e) {
    const obj = { action: "choosewinnner", winningSubmission: "<Submission>" };
    this.setRequest(obj);
  }

  eliminateCaption(e) {
    const obj = { action: "eliminatecaption", submission: "<Submission>" };
    this.setRequest(obj);
  }

  newGame(e) {
    const obj = { action: "newgame", theme: "<String>" };
    this.setRequest(obj);
  }

  replaceCaption(e) {
    const obj = {
      action: "replacecaption",
      playerID: this.props.playerID
    };
    this.setRequest(obj);
  }

  render() {
    return (
      <div>
        <li>
          <button onClick={e => this.props.hostConnect(e)}>
            {" "}
            (HOST) /startgame (instantly connects){" "}
          </button>
        </li>
        <li>
          <button onClick={e => this.props.playerConnect(e)}>
            {" "}
            (PLAYER) /connect (instantly connects){" "}
          </button>
        </li>
        <li>
          <button onClick={e => this.props.playerDisconnect(e)}>
            (PLAYER) "onDisconnect"
          </button>
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
