import React from "react";
import { ReactComponent as IconStars } from "../../../assets/icon-stars.svg";
import { ReactComponent as ArrowRight } from "../../../assets/icon-arr-right-long.svg";
import classes from "./early-access.module.css";

const EarlyAccess = () => {
  return (
    <div className={classes.container}>
      <a
        href="https://t.me/geandrop"
        target="_blank"
        rel="noreferrer"
      >
        <div className={`${classes.wrapper}`}>
          <IconStars />
          <p>Get Our Team to Support Your NFT Drop + Brand Coming Into Web3</p>
          <ArrowRight />
        </div>
      </a>
    </div>
  );
};

export default EarlyAccess;
