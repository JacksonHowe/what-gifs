import React, { Component } from "react";

class APIList extends Component {
  state = { uuid: "" };
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

  setName(e) {
    const obj = { action: "setName", name: "<name>", uuid: this.props.uuid };
    this.setRequest(obj);
  }

  getCard(e) {
    console.log("getcard");
  }

  submitCaption(e) {
    const obj = {
      action: "submitCaption",
      message: "<message>",
      name: "<name>",
      uuid: this.props.uuid
    };
    this.setRequest(obj);
  }

  render() {
    return (
      <div>
        <li>
          <button onClick={e => this.setName(e)}>setName</button>
        </li>
        <li>
          <button onClick={e => this.submitCaption(e)}>submitCaption</button>
        </li>
        <li>
          <button onClick={e => this.getCard}>getCard</button>
        </li>
      </div>
    );
  }
}
export default APIList;
