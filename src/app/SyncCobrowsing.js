import "./SyncCobrowsing.css";

import React, { useState, useEffect, useRef } from "react";
import { SyncClient } from "twilio-sync";

import Participants from "./Participants.js";
import SyncedInputField from "./SyncedInputField";

// React component
export default function SyncCobrowsing({ identity, sessionId }) {
  const [status, setStatus] = useState("Connecting...");
  const [errorMessage, setErrorMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const clientRef = useRef();
  const cleanupRef = useRef();

  useEffect(() => {
    let client = clientRef.current;

    // Token and Sync client handling
    async function retrieveToken() {
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
        setStatus("error");
        setErrorMessage("No access token found in result");
      }
    }

    function loadFormData() {
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

    function addParticipant() {
      let map;
      const participantsMapKey = "participants-" + sessionId;

      client.map(participantsMapKey).then((participantMap) => {
        map = participantMap;

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

      cleanupRef.current = () => {
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

    function createSyncClient(token) {
      const newClient = new SyncClient(token, { logLevel: "info" });

      newClient.on("connectionStateChanged", (state) => {
        if (state === "connected") {
          clientRef.current = newClient;
          client = newClient;
          setStatus("connected");
          setErrorMessage("");
          loadFormData();
          addParticipant();
        } else {
          setStatus("error");
          setErrorMessage(`Error: expected connected status but got ${state}`);
        }
      });

      newClient.on("tokenAboutToExpire", retrieveToken);
      newClient.on("tokenExpired", retrieveToken);
    }

    // fetch an access token from the localhost server
    retrieveToken();

    // return cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [identity, sessionId]);

  function updateSyncDocument(newFormData) {
    const client = clientRef.current;
    if (!client) return;

    client.document(sessionId).then((doc) => {
      doc.set(newFormData);
    });
  }

  function setFormValue(fieldName, value) {
    const newFormData = { ...formData, [fieldName]: value };
    updateSyncDocument(newFormData);
    setFormData(newFormData);
  }

  return (
    <>
      <div className="container">
        <div className="card border-primary">
          <div className="card-header text-info">
            <span id="status">{status}</span>
            {errorMessage && (
              <>
                <br />
                <span id="error">{errorMessage}</span>
              </>
            )}
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
