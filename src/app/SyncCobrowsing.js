import "./SyncCobrowsing.css";

import React, { useState, useEffect, useRef } from "react";
import { SyncClient } from "twilio-sync";

import Participants from "./Participants.js";
import SyncedInputField from "./SyncedInputField";

// Participant routines
function addParticipant(client, identity, sessionId, setParticipants) {
  let map;
  const participantsMapKey = "participants-" + sessionId;

  client.map(participantsMapKey).then((participantMap) => {
    map = participantMap;

    function refreshParticipants() {
      getAllItems(map).then((items) => {
        const newParticipants = items.map((item) => item.data);
        console.log("participants", newParticipants);
        setParticipants(newParticipants);
      });
    }

    map
      .addListener("itemAdded", refreshParticipants)
      .addListener("itemUpdated", refreshParticipants)
      .addListener("itemRemoved", refreshParticipants)
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

// React component
export default function SyncCobrowsing({ identity, sessionId }) {
  const [status, setStatus] = useState("Connecting...");
  const [, setErrorMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const clientRef = useRef();
  const cleanupRef = useRef();

  useEffect(() => {
    // Token and Sync service handling
    async function retrieveToken() {
      const client = clientRef.current;
      const result = await fetch("/token/" + identity);
      const json = await result.json();
      const accessToken = json.token;

      if (accessToken != null) {
        if (client) {
          // update the sync client with a new access token
          client.updateToken(accessToken);
        } else {
          // create a new sync client
          createSyncClient(accessToken);
        }
      } else {
        setErrorMessage("No access token found in result");
      }
    }

    function createSyncClient(token) {
      const client = new SyncClient(token, { logLevel: "info" });

      client.on("connectionStateChanged", function (state) {
        if (state === "connected") {
          clientRef.current = client;
          setStatus("connected");
          loadFormData(client, sessionId, setFormData);
          const cleanup = addParticipant(
            client,
            identity,
            sessionId,
            setParticipants
          );
          cleanupRef.current = cleanup;
        } else {
          setStatus("error");
          setErrorMessage(`Error: expected connected status but got ${state}`);
        }
      });

      client.on("tokenAboutToExpire", retrieveToken);
      client.on("tokenExpired", retrieveToken);
    }

    // fetch an access token from the localhost server
    retrieveToken();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [identity, sessionId]);

  function setFormValue(fieldName, value) {
    const newFormData = { ...formData, [fieldName]: value };
    updateSyncDocument(clientRef.current, sessionId, newFormData);
    setFormData(newFormData);
  }

  return (
    <>
      <div className="container">
        <div className="card border-primary">
          <div className="card-header text-info">
            <span id="status">{status}</span>
          </div>
          <div className="card-header text-info">
            Participants:
            <br />
            <Participants participants={participants} identity={identity} />
          </div>
        </div>
        <div className="card border-primary">
          <div className="card-header text-info">
            <div className="input-group mb-3">
              <SyncedInputField
                setFormValue={setFormValue}
                formDataKey="firstName"
                formDataValue={formData["firstName"]}
                placeholder="First Name"
              />
            </div>
            <div className="input-group mb-3">
              <SyncedInputField
                setFormValue={setFormValue}
                formDataKey="lastName"
                formDataValue={formData["lastName"]}
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
