import "./SyncCobrowsing.css";

import React, { useState, useEffect } from "react";

import Participants from "./Participants.js";
import SyncedInputField from "./SyncedInputField";
import useSyncClient from "../hooks/useSyncClient";

// React component
export default function SyncCobrowsing({ identity, sessionId }) {
  const { client, status, errorMessage } = useSyncClient(identity);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    let cleanupFuncs = [];

    function loadFormData() {
      client.document(sessionId).then((doc) => {
        setFormData(doc.data);

        doc.addListener("updated", (event) => {
          console.log("Sync Updated Data", event);
          if (!event.isLocal) {
            console.log("Setting state with", event.data);
            setFormData(event.data);
          }
        });

        cleanupFuncs.push(() => {
          doc.removeAllListeners();
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

      cleanupFuncs.push(() => {
        map
          .removeAllListeners()
          .remove(identity)
          .then(() => {
            console.log("Participant " + identity + " removed.");
          })
          .catch((error) => {
            console.error("Error removing: " + identity, error);
          });
      });
    }

    if (status === "connected") {
      loadFormData();
      addParticipant();

      // return cleanup function
      return () => {
        cleanupFuncs.forEach((cleanupFunc) => cleanupFunc());
      };
    }
  }, [status, client, sessionId, identity]);

  function updateSyncDocument(newFormData) {
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
