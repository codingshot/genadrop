import React from "react";
import { Link } from "react-router-dom";
import classes from "./Partners.module.css";
import mediaData from "./partners-script";
import MediaBar from "../media-bar/MediaBar";

const Partners = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <span>Our </span> <span className={classes.accent}>Partners</span>
      </div>
      <div className={classes.description}>We onboard notable brands to Web3 powered by GenaDrop</div>
      <div className={classes.wrapper}>
        <MediaBar MediaLogos={mediaData} />
      </div>
      <Link to="/partner" className={classes.btn}>
        Apply for Partnership
      </Link>
    </div>
  );
};

export default Partners;
