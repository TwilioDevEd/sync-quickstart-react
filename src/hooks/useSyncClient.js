import { useState, useEffect, useRef } from "react";
import { SyncClient } from "twilio-sync";

export default function useSyncClient(identity) {
  const [status, setStatus] = useState("Connecting...");
  const [errorMessage, setErrorMessage] = useState("");

  const clientRef = useRef();

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

    function createSyncClient(token) {
      const newClient = new SyncClient(token, { logLevel: "info" });

      newClient.on("connectionStateChanged", (state) => {
        if (state === "connected") {
          clientRef.current = newClient;
          client = newClient;
          setStatus("connected");
          setErrorMessage("");
        } else {
          setStatus("error");
          setErrorMessage(`Error: expected connected status but got ${state}`);
        }
      });

      newClient.on("tokenAboutToExpire", retrieveToken);
      newClient.on("tokenExpired", retrieveToken);
    }

    retrieveToken();
  }, [identity]);

  return { client: clientRef.current, status, errorMessage };
}
