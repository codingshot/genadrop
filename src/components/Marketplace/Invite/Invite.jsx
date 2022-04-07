import React from "react";
import classes from "./styles.module.css";

const Invite = () => (
  <div className={classes.container}>
    <p>Join our community on Discord</p>
    <button type="button">
      <a href="https://discord.gg/4vdtmQqz6d" target="_blank" rel="noopener noreferrer">
        Join
      </a>
    </button>
  </div>
);

export default Invite;
