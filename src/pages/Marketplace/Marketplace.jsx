import React from "react";
import Banner from "../../components/Marketplace/Banner/Banner";
import Collections from "../../components/Marketplace/Collections/Collections";
import Demo from "../../components/Marketplace/Demo/Demo";
import SingleNft from "../../components/Marketplace/SingleNft/SingleNft";
import Invite from "../../components/Marketplace/Invite/Invite";
import classes from "./Marketplace.module.css";

const Marketplace = () => (
  <div className={classes.container}>
    <Banner />
    <div className={classes.wrapper}>
      <Collections />
      <SingleNft />
      <Demo />
      <Invite />
    </div>
  </div>
);

export default Marketplace;
