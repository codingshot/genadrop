import React from "react";
import graph from "../../../assets/discord-graph.svg";
import classes from "./JoinDiscord.module.css";

const JoinDiscord = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={graph} alt="" />
        <div className={classes.content}>
          <div className={classes.heading}>Join the conversation</div>
          <div className={classes.description}>Join our community on Discord</div>
          <a href="https://discord.gg/ynTSZWhs" target="_blank" rel="noreferrer" className={classes.link}>
            Join
          </a>
        </div>
      </div>
    </div>
  );
};

export default JoinDiscord;
