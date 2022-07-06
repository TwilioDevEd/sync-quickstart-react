import React from "react";

import "./App.css";
import SyncCobrowsing from "./app/SyncCobrowsing.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: "session123",
      identity: "",
      isLoggedIn: false,
    };
  }

  setSessionId(event) {
    this.setState({ sessionId: event.target.value });
  }

  setIdentity(event) {
    this.setState({ identity: event.target.value });
  }

  login() {
    this.setState({ isLoggedIn: true });
  }

  logout() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Twilio Sync Quickstart with React and Node.js</h1>
          <p>
            Learn more about{" "}
            <a href="https://www.twilio.com/sync">Twilio Sync</a>
          </p>
          <div className="logout-container">
            {this.state.isLoggedIn && (
              <button
                className="btn btn-primary"
                onClick={(e) => this.logout()}
              >
                Logout
              </button>
            )}
          </div>
        </header>
        {this.state.identity.length > 0 && this.state.isLoggedIn ? (
          <SyncCobrowsing
            sessionId={this.state.sessionId}
            identity={this.state.identity}
          />
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
                    defaultValue={this.state.sessionId}
                    onChange={(e) => this.setSessionId(e)}
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
                    defaultValue={this.state.identity}
                    onChange={(e) => this.setIdentity(e)}
                  ></input>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => this.login()}
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
}

export default App;
