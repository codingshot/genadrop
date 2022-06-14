import React from "react";
import TopCollections from "../../components/Top-Collections/TopCollections";
import TopSingleNFTs from "../../components/Top-Single-NFTs/TopSingleNFTs";
import classes from "./Marketplace.module.css";
import bannerImg from "../../assets/banner2.png";

const Marketplace = () => (
  <div className={classes.container}>
    <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.header} />
    <div className={classes.wrapper}>
      <TopCollections />
      <TopSingleNFTs />
    </div>
  </div>
);

export default Marketplace;
