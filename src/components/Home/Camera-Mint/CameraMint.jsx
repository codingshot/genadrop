import React from "react";
import { Link } from "react-router-dom";
import classes from "./CameraMint.module.css";
import webcamBG from "../../../assets/home-webcam.svg";

const CameraMint = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Mint NFTs with your camera</div>
      <div className={classes.description}>
        Photography NFTs built into our app, the Web3 instagram for multiple blockchains
      </div>
      <div className={classes.wrapper}>
        <Link to="/mint/camera" className={classes.btn}>
          Take a photo
        </Link>
        <img src={webcamBG} loading="lazy" alt="" />
      </div>
    </div>
  );
};

export default CameraMint;
