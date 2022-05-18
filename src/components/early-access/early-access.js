import React from "react";
import { ReactComponent as CloseIcon } from "../../assets/icon-close-solid.svg";
import classes from "./early-access.module.css";

const EarlyAccess = ({ setShowEarlyAccess, showEarlyAccess }) => {
  return (
    <div className={`${classes.container} ${!showEarlyAccess && classes.hidden}`}>
      <div>
        <CloseIcon onClick={() => setShowEarlyAccess(false)} />
        <p>Do you need a team to support your NFT drop or you want Early Access to Genadrop Minter + Marketplace?</p>
      </div>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeVwZlJOkX_i9g8ogHlB_Jvnt0iYSTsXvzdJygCZx3XZQEnUw/viewform"
        target="_blank"
        rel="noreferrer"
      >
        Get Early Access
      </a>
    </div>
  );
};

export default EarlyAccess;
