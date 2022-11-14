import "./Participants.css";

import React from "react";

export default function Participants({ participants, identity }) {
  return (
    <div>
      {participants.map((participant, index) => (
        <span
          key={participant.identity ? participant.identity : "none"}
          className={participant.identity === identity ? "self" : ""}
        >
          {participant.identity}
          {index < participants.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
}
