import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./home.module.css";
import Docs from "../../components/Home/Docs/Docs";
import GenadropCreatedNFTs from "../../components/Home/Genadrop-Created-NFTs/GenadropCreatedNFTs";
import CameraMint from "../../components/Home/Camera-Mint/CameraMint";
import JoinDiscord from "../../components/Home/Join-Discord/JoinDiscord";
import EarlyAccess from "../../components/Home/early-access/early-access";

const Home = () => (
  <div className={classes.container}>
    <Banner />
    <EarlyAccess />
    <Orgs />
    <GenadropCreatedNFTs />
    <CameraMint />
    <Features />
    <Docs />
    <Review />
    <JoinDiscord />
    <FAQ />
  </div>
);

export default Home;
