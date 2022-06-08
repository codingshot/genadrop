import React from "react";
import graph from "../../assets/discord-graph.svg";
import classes from "./JoinDiscord.module.css";

const JoinDiscord = () => {
  return (
    <div className={classes.container}>
      <img src={graph} alt="" />
      <p>Join our community on Discord</p>
      <a href="https://discord.gg/ynTSZWhs" target="_blank" rel="noreferrer">
        Join
      </a>
    </div>
  );
};

export default JoinDiscord;
