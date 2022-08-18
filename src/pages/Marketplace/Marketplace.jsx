import React from "react";
import Collections from "../../components/Marketplace/Collections/Collections";
import SingleNft from "../../components/Marketplace/SingleNft/SingleNft";
import classes from "./Marketplace.module.css";
import Banner from "../../components/Marketplace/Banner/Banner";
import Chains from "../../components/Marketplace/Chains/Chains";
// import Creators from "../../components/Marketplace/Creators/Creators";
import FeautedNfts from "../../components/Marketplace/featuredNfts/FeautedNfts";
// import HotAuctions from "../../components/Marketplace/Hot-Auctions/HotAuctions";
// import Subscribe from "../../components/Marketplace/Subscribe/Subscribe";

const Marketplace = () => (
  <div className={classes.container}>
    <Banner />
    <FeautedNfts />
    <Collections />
    <SingleNft />
    {/* <Creators /> */}
    {/* <HotAuctions /> */}
    {/* <Subscribe /> */}
  </div>
);

export default Marketplace;
