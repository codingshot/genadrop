import React from "react";
import Collections from "../../components/Marketplace/Collections/Collections";
import SingleNft from "../../components/Marketplace/SingleNft/SingleNft";
import classes from "./Marketplace.module.css";
import Banner from "../../components/Marketplace/Banner/Banner";
import Chains from "../../components/Marketplace/Chains/Chains";
// import Creators from "../../components/Marketplace/Creators/Creators";
import NewListing from "../../components/Marketplace/New-Listing/NewListing";
// import HotAuctions from "../../components/Marketplace/Hot-Auctions/HotAuctions";
import FeautedNfts from "../../components/Marketplace/featuredNfts/FeautedNfts";
// import Subscribe from "../../components/Marketplace/Subscribe/Subscribe";
import MarketplaceNFTs from "../../components/Marketplace/MarketplaceNFTs/marketplaceNFTs";

const Marketplace = () => (
  <div className={classes.container}>
    <Banner />
    <FeautedNfts />
    <MarketplaceNFTs />

    {/* <Creators /> */}
    {/* <HotAuctions /> */}
    {/* <Subscribe /> */}
  </div>
);

export default Marketplace;
