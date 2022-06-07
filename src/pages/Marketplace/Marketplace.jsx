import React from "react";
import Collections from "../../components/Marketplace/Collections/Collections";
import SingleNft from "../../components/Marketplace/SingleNft/SingleNft";
import classes from "./Marketplace.module.css";
import bannerImg from "../../assets/banner2.png";

const Marketplace = () => (
  <div className={classes.container}>
    <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.header} />
    <div className={classes.wrapper}>
      <Collections />
      <SingleNft />
    </div>
  </div>
);

export default Marketplace;
