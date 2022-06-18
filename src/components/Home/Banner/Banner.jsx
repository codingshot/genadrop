import React from "react";
import classes from "./Banner.module.css";
import playIcon from "../../../assets/icon-play.svg";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";
// import data from "../../../assets/lottie/data.json";

const Banner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../../assets/lottie/data.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <div className={classes.title}>
            The No code Art <br /> tool for NFT
            <div className={classes.features}>
              <div className={classes.fWrapper}>
                <div>Creation</div>
                <div>Minting</div>
                <div>Marketplace</div>
              </div>
            </div>
          </div>
          <div className={classes.description}>
            Generate all combinations from your art assets, preview and edit meta data, upload to ipfs, mint, and list
            to multiple blockchains with NO CODE.
          </div>
          <div className={classes.btns}>
            <Link to="/create" className={classes.btn_create}>
              Create
            </Link>
            <Link to="/marketplace" className={classes.btn_explore}>
              Explore
            </Link>
          </div>
          <a href="https://youtu.be/wC0odzMW_9g" target="_blank" rel="noreferrer" className={classes.btn_video}>
            <img src={playIcon} alt="" />
            <div>Learn more about Genadrop</div>
          </a>
        </div>
        <div className={classes.illustration}>
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <a href="https://youtu.be/wC0odzMW_9g" target="_blank" rel="noreferrer" className={classes.btn_video_m}>
          <img src={playIcon} alt="" />
          <div>Learn more about Genadrop</div>
        </a>
      </div>
    </div>
  );
};

export default Banner;
