import "./SyncCobrowsing.css";

import React from "react";
import { SyncClient } from "twilio-sync";

import Participants from "./Participants.js";
import SyncedInputField from "./SyncedInputField";

async function getAccessToken(identity) {
  const result = await fetch("/token/" + identity);
  const json = await result.json();
  return json.token;
}

function addParticipant(client, identity, sessionId, refreshParticipants) {
  let map;
  const participantsMapKey = "participants-" + sessionId;

  client.map(participantsMapKey).then((participantMap) => {
    map = participantMap;

    function triggerRefresh() {
      refreshParticipants(map);
    }

    map.addListener("itemAdded", triggerRefresh);
    map.addListener("itemUpdated", triggerRefresh);
    map.addListener("itemRemoved", triggerRefresh);

    map
      .set(identity, {
        identity: identity,
      })
      .then((item) => {
        console.log("Added: ", item.key);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // Return a cleanup function
  return () => {
    map
      .removeAllListeners()
      .remove(identity)
      .then(() => {
        console.log("Participant " + identity + " removed.");
      })
      .catch((error) => {
        console.error("Error removing: " + identity, error);
      });
  };
}

class SyncCobrowsing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Connecting...",
      errorMessage: "",
      participants: [],
      formData: {
        firstName: "",
        lastName: "",
      },
    };

    this.setFormValue = this.setFormValue.bind(this);
    this.refreshParticipants = this.refreshParticipants.bind(this);
    this.cleanup = undefined;
  }

  componentDidMount() {
    // fetch an access token from the localhost server
    this.retrieveToken(this.props.identity);
  }

  componentWillUnmount() {
    console.log("will unmount");
    if (this.cleanup) {
      console.log("calling cleanup");
      this.cleanup();
    }
  }

  async retrieveToken(identity) {
    const accessToken = await getAccessToken(identity);
    if (accessToken != null) {
      if (this.client) {
        // update the sync client with a new access token
        this.client.updateToken(accessToken);
      } else {
        // create a new sync client
        this.createSyncClient(accessToken);
      }
    } else {
      this.setState({ errorMessage: "No access token found in result" });
    }
  }

  updateSyncDocument(formData) {
    if (!this.client) {
      return;
    }
    this.client.document(this.props.sessionId).then(function (doc) {
      doc.set(formData);
    });
  }

  refreshParticipants(map) {
    this.getAllItems(map).then((items) => {
      var participants = [];
      items.forEach((item) => {
        participants.push(item.data);
      });
      console.log("participants", participants);
      this.setState({ participants: participants });
    });
  }

  // Since Sync Map has pagination we need to navigate through all the pages
  async getAllItems(map) {
    const result = [];
    let page = await map.getItems();
    result.push(...page.items);

    while (page.hasNextPage) {
      page = await page.nextPage();
      result.push(...page.items);
    }
    return result;
  }

  createSyncClient(token) {
    const client = new SyncClient(token, { logLevel: "info" });
    var component = this;
    let identity = this.props.identity;
    client.on("connectionStateChanged", function (state) {
      if (state === "connected") {
        component.client = client;
        component.setState({ status: "connected" });
        component.loadFormData();
        component.cleanup = addParticipant(
          client,
          identity,
          component.props.sessionId,
          component.refreshParticipants
        );
      } else {
        component.setState({
          status: "error",
          errorMessage: `Error: expected connected status but got ${state}`,
        });
      }
    });
    client.on("tokenAboutToExpire", function () {
      component.retrieveToken(identity);
    });
    client.on("tokenExpired", function () {
      component.retrieveToken(identity);
    });
  }

  async loadFormData() {
    let component = this;

    this.client.document(this.props.sessionId).then(function (doc) {
      component.setState({ formData: doc.data });

      doc.on("updated", function (data) {
        console.log("Sync Updated Data", data);
        if (!data.isLocal) {
          console.log("Setting state with", data.data);
          component.setState({ formData: data.data });
        }
      });
    });
  }

  setFormValue(fieldName, value) {
    var formData = this.state.formData;
    formData[fieldName] = value;
    this.setState({ formData: formData }, () =>
      this.updateSyncDocument(formData)
    );
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="card border-primary">
            <div className="card-header text-info">
              <span id="status">{this.state.status}</span>
            </div>
            <div className="card-header text-info">
              Participants:
              <br />
              <Participants participants={this.state.participants} />
            </div>
          </div>
          <div className="card border-primary">
            <div className="card-header text-info">
              <div className="input-group mb-3">
                <SyncedInputField
                  setFormValue={this.setFormValue}
                  formDataKey="firstName"
                  formDataValue={this.state.formData["firstName"]}
                  placeholder="First Name"
                />
              </div>
              <div className="input-group mb-3">
                <SyncedInputField
                  setFormValue={this.setFormValue}
                  formDataKey="lastName"
                  formDataValue={this.state.formData["lastName"]}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>
        </div>
        <span id="floating-badges"></span>
        <span id="signals"></span>
      </>
    );
  }
}

export default SyncCobrowsing;
