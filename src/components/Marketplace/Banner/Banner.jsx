import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./styles.module.css";
import banner from "../../../assets/banner.gif";

const Banner = () => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.bannerText}>
          <h4 className={classes.heading}>
            The no code NFT art,
            <br />
            creator tool, minter + marketplace
            <br />
          </h4>
          <p className={classes.description}>
            The first NFT marketplace that enables creators to create their generative NFTs and embed licenses when they
            mint NFTs. Creators know what they are selling, collectors know what they are buying.
          </p>
          <div className={classes.pageLinks}>
            <button type="button" className={classes.createBtn} onClick={() => history.push("./create")}>
              Create
            </button>
            <button type="button" className={classes.mintBtn} onClick={() => history.push("./mint")}>
              Mint
            </button>
          </div>
        </div>
        <div className={classes.imageContainer}>
          <img src={banner} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
