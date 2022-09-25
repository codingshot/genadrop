import React from "react";
import classes from "./Media.module.css";
import mediaData from "./media-script";
import MediaBar from "../media-bar/MediaBar";

const Media = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <span>As seen on the </span> <span className={classes.accent}>media</span>
      </div>
      <div className={classes.description}>GenaDrop is getting featured globally</div>
      <div className={classes.wrapper}>
        <MediaBar MediaLogos={mediaData} />
      </div>
    </div>
  );
};

export default Media;
