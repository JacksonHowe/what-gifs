import React, { Component } from "react";
import APIList from "./api-list";

let client = "";
class ClientPlayer extends Component {
  state = { connected: false, uuid: "" };

  constructor(props) {
    super(props);
    client = this.props.client;
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  onSend(e) {
    console.log(e);
    const o = JSON.parse(document.getElementById("requestBox").value);
    this.state.ws_client.send(document.getElementById("requestBox").value);
  }

  componentWillMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      this.setState({ connected: true });
    };

    client.onmessage = message => {
      console.log(message.data);
      var obj = JSON.parse(message.data);
      console.log(this.state.uuid === "");
      if (this.state.uuid === "") {
        this.setState({ uuid: obj.uuid });
      }

      document.getElementById("responseBox").value = JSON.stringify(
        obj,
        null,
        2
      );
    };
  }
  render() {
    return (
      <div>
        <label class="switch">
          {" "}
          WS Connected: Player
          <input type="checkbox" checked={this.state.connected}></input>
        </label>
        <div>
          <APIList uuid={this.state.uuid} />
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
          Response
          <textarea id="responseBox" readonly></textarea>
        </label>
      </div>
    );
  }
}

export default ClientPlayer;
