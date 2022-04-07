import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./styles.module.css";
import banner from "../../../assets/home-banner-image.svg";

const Banner = () => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.bannerText}>
        <h4 className={classes.heading}>
          The no code NFT generative,
          <br />
          art creator tool & minter
          <br />
        </h4>
        <p className={classes.description}>
          Generate all combinations from your art assets, preview and edit meta data, upload to ipfs, mint, and list to
          multiple blockchains with NO CODE.
        </p>
        <button type="button" onClick={() => history.push("./create")}>
          Generate Collection
        </button>
      </div>
      <div className={classes.imageContainer}>
        <img src={banner} alt="" />
      </div>
    </div>
  );
};

export default Banner;
