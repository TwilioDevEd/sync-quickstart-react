import "./SyncCobrowsing.css";

import React from "react";
import { SyncClient } from "twilio-sync";

import Participants from "./Participants.js";
import SyncedInputField from "./SyncedInputField";

// Participant routines
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

// Since Sync Map has pagination we need to navigate through all the pages
async function getAllItems(map) {
  const result = [];
  let page = await map.getItems();
  result.push(...page.items);

  while (page.hasNextPage) {
    page = await page.nextPage();
    result.push(...page.items);
  }
  return result;
}

// Document routines
function updateSyncDocument(client, sessionId, formData) {
  if (!client) {
    return;
  }
  client.document(sessionId).then((doc) => {
    doc.set(formData);
  });
}

function loadFormData(client, sessionId, setFormData) {
  client.document(sessionId).then((doc) => {
    setFormData(doc.data);

    doc.on("updated", (event) => {
      console.log("Sync Updated Data", event);
      if (!event.isLocal) {
        console.log("Setting state with", event.data);
        setFormData(event.data);
      }
    });
  });
}

// Token and Sync service handling
async function retrieveToken(
  client,
  identity,
  sessionId,
  setClient,
  setStatus,
  setErrorMessage,
  setFormData,
  setCleanup,
  refreshParticipants
) {
  const result = await fetch("/token/" + identity);
  const json = await result.json();
  const accessToken = json.token;

  if (accessToken != null) {
    if (client) {
      // update the sync client with a new access token
      client.updateToken(accessToken);
    } else {
      // create a new sync client
      createSyncClient(
        accessToken,
        identity,
        sessionId,
        setClient,
        setStatus,
        setErrorMessage,
        setFormData,
        setCleanup,
        refreshParticipants
      );
    }
  } else {
    setErrorMessage("No access token found in result");
  }
}

function createSyncClient(
  token,
  identity,
  sessionId,
  setClient,
  setStatus,
  setErrorMessage,
  setFormData,
  setCleanup,
  refreshParticipants
) {
  const client = new SyncClient(token, { logLevel: "info" });

  client.on("connectionStateChanged", function (state) {
    if (state === "connected") {
      setClient(client);
      setStatus("connected");
      loadFormData(client, sessionId, setFormData);
      const cleanup = addParticipant(
        client,
        identity,
        sessionId,
        refreshParticipants
      );
      setCleanup(cleanup);
    } else {
      setStatus("error");
      setErrorMessage(`Error: expected connected status but got ${state}`);
    }
  });

  function refreshToken() {
    retrieveToken(client, identity, createSyncClient, setErrorMessage);
  }

  client.on("tokenAboutToExpire", refreshToken);
  client.on("tokenExpired", refreshToken);
}

// React component
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

    this.setClient = this.setClient.bind(this);
    this.setFormValue = this.setFormValue.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.setCleanup = this.setCleanup.bind(this);
    this.refreshParticipants = this.refreshParticipants.bind(this);
    this.cleanup = undefined;
  }

  setClient(client) {
    this.client = client;
  }

  setFormData(formData) {
    this.setState({ formData });
  }

  setStatus(status) {
    this.setState({ status });
  }

  setErrorMessage(errorMessage) {
    this.setState({ errorMessage });
  }

  setCleanup(cleanup) {
    this.cleanup = cleanup;
  }

  componentDidMount() {
    // fetch an access token from the localhost server
    retrieveToken(
      this.client,
      this.props.identity,
      this.props.sessionId,
      this.setClient,
      this.setStatus,
      this.setErrorMessage,
      this.setFormData,
      this.setCleanup,
      this.refreshParticipants
    );
  }

  componentWillUnmount() {
    console.log("will unmount");
    if (this.cleanup) {
      console.log("calling cleanup");
      this.cleanup();
    }
  }

  refreshParticipants(map) {
    getAllItems(map).then((items) => {
      var participants = [];
      items.forEach((item) => {
        participants.push(item.data);
      });
      console.log("participants", participants);
      this.setState({ participants: participants });
    });
  }

  setFormValue(fieldName, value) {
    var formData = this.state.formData;
    formData[fieldName] = value;
    this.setState({ formData: formData });
    updateSyncDocument(this.client, this.props.sessionId, formData);
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
