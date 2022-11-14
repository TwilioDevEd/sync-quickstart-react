import React, { useState } from "react";

import "./App.css";
import SyncCobrowsing from "./app/SyncCobrowsing.js";

export default function App() {
  // Check for identity in query string
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const [sessionId, setSessionId] = useState("session123");
  const [identity, setIdentity] = useState(params?.identity || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Twilio Sync Quickstart with React and Node.js</h1>
        <p>
          Learn more about <a href="https://www.twilio.com/sync">Twilio Sync</a>
        </p>
        <div className="logout-container">
          {isLoggedIn && (
            <button
              className="btn btn-primary"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </button>
          )}
        </div>
      </header>
      {identity.length > 0 && isLoggedIn ? (
        <SyncCobrowsing sessionId={sessionId} identity={identity} />
      ) : (
        <div className="container">
          <div className="card border-primary">
            <div className="card-body text-info">
              <h5 className="card-title">Session Id</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Provide a cobrowsing session id - should be unique
              </h6>
              <div className="input-group mb-3">
                <input
                  type="text"
                  placeholder="Session Id"
                  defaultValue={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
          <div className="card border-primary">
            <div className="card-body text-info">
              <h5 className="card-title">Identity</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Provide a unique identity for each user joining the cobrowsing
                session
              </h6>
              <div className="input-group mb-3">
                <input
                  type="text"
                  placeholder="Identity (username)"
                  defaultValue={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                ></input>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
