import React, { useState, useRef } from "react";
import classes from "./Banner.module.css";
import { ReactComponent as PlayIcon } from "../../../assets/icon-play.svg";
import { Link } from "react-router-dom";
import demo from "../../../assets/vid/Demo.mp4";
import { useEffect } from "react";

const Banner = () => {
  const videoRef = useRef(null);
  const [showOverlayer, setShowOverlay] = useState(true);

  const handlePlay = () => {
    videoRef.current.play();
    setShowOverlay(false);
  };

  useEffect(() => {
    videoRef.current.addEventListener("ended", () => {
      setShowOverlay(true);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.features}>
          Create<span></span> Mint<span></span> Sell<span></span>
        </div>
        <div className={classes.description}>The ultimate NO-Code NFT tool Creators and Collectors love</div>
        <div className={classes.more}>Generate and mint your NFT collections or mint a photo with a camera.</div>
        <div className={classes.btnContainer}>
          <Link to="/create">
            <div className={classes.btn_1}>Create</div>
          </Link>
          <Link to="/marketplace">
            <div className={classes.btn_2}>Explore</div>
          </Link>
        </div>
      </div>
      <div className={`${classes.demo} ${showOverlayer && classes.active}`}>
        <video ref={videoRef} preload="auto" src={demo}></video>
        <div className={classes.overlay}></div>
        <PlayIcon onClick={handlePlay} className={classes.playIcon} />
      </div>
    </div>
  );
};

export default Banner;
