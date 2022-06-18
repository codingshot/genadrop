import React from "react";
import { ReactComponent as IconStars } from "../../../assets/icon-stars.svg";
import { ReactComponent as ArrowRight } from "../../../assets/icon-arr-right-long.svg";
import classes from "./early-access.module.css";

const EarlyAccess = () => {
  return (
    <div className={classes.container}>
      <div className={`${classes.wrapper}`}>
        <div>
          <IconStars />
          <p>Do you need a team to support your NFT drop or you want Early Access to Genadrop Minter + Marketplace?</p>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeVwZlJOkX_i9g8ogHlB_Jvnt0iYSTsXvzdJygCZx3XZQEnUw/viewform"
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRight />
        </a>
      </div>
    </div>
  );
};

export default EarlyAccess;
