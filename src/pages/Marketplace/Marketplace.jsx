import React from "react";
import Collections from "../../components/Marketplace/Collections/Collections";
import SingleNft from "../../components/Marketplace/SingleNft/SingleNft";
import classes from "./Marketplace.module.css";
import Banner from "../../components/Marketplace/Banner/Banner";
import Chains from "../../components/Marketplace/Chains/Chains";
import Creators from "../../components/Marketplace/Creators/Creators";
import NewListing from "../../components/Marketplace/New-Listing/NewListing";
import HotAuctions from "../../components/Marketplace/Hot-Auctions/HotAuctions";

const Marketplace = () => (
  <div className={classes.container}>
    <Banner />
    <Chains />
    <NewListing />
    <Collections />
    <SingleNft />
    <Creators />
    <HotAuctions />
  </div>
);

export default Marketplace;
