import React from "react";

export default function Participants({ participants }) {
  return (
    <div>
      {participants.map((participant, index) => (
        <span key={participant.identity ? participant.identity : "none"}>
          {participant.identity}
          {index < participants.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
}
