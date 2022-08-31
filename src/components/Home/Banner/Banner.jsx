import React from "react";
import classes from "./Banner.module.css";
import bannerBg from "../../../assets/home-banner-bg.png";
import { ReactComponent as PlayIcon } from "../../../assets/icon-play.svg";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className={classes.container}>
      <div style={{ backgroundImage: `url(${bannerBg})` }} className={classes.heading}>
        <div className={classes.features}>
          Create<span></span> Mint<span></span> Sell<span></span>
        </div>
        <div className={classes.description}>The ultimate NO-Code NFT tool Creators and Collectors love</div>
        <div className={classes.more}>Generate and mint your NFT collections or mint a photo with a camera.</div>
        <div className={classes.btnContainer}>
          <Link to="/create">
            <div className={classes.btn_1}>Create</div>
          </Link>
          <Link to="/explore">
            <div className={classes.btn_2}>Explore</div>
          </Link>
        </div>
      </div>
      <div className={classes.demo}>
        <PlayIcon className={classes.playIcon} />
      </div>
    </div>
  );
};

export default Banner;
