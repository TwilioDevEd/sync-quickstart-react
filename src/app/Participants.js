import React from "react";

class Participants extends React.Component {
  render() {
    let participants = this.props.participants.map((participant) => (
      <span key={participant.identity ? participant.identity : "none"}>
        {participant.identity}{" "}
      </span>
    ));

    return <div>{participants}</div>;
  }
}

export default Participants;
