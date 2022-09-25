import React from "react";
import classes from "./Marketplace.module.css";
import Banner from "../../components/Marketplace/Banner/Banner";
import FeaturedNfts from "../../components/Marketplace/featuredNfts/FeaturedNfts";
import AllNfts from "../../components/Marketplace/AllNfts/AllNfts";

const Marketplace = () => (
  <div className={classes.container}>
    <Banner />
    <FeaturedNfts />
    <AllNfts />
  </div>
);

export default Marketplace;
