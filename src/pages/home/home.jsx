import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./home.module.css";
import GenadropCreatedNFTs from "../../components/Home/Genadrop-Created-NFTs/GenadropCreatedNFTs";
import CameraMint from "../../components/Home/Camera-Mint/CameraMint";
import EarlyAccess from "../../components/Home/early-access/early-access";
import Plans from "../../components/Home/Plans/Plans";
import JoinDiscord from "../../components/Home/Join-Discord/JoinDiscord";
import Media from "../../components/Media/Media";
import Partners from "../../components/Partners/Partners";

const Home = () => (
  <div className={classes.container}>
    <Banner />
    <Orgs />
    <EarlyAccess />
    <CameraMint />
    <Features />
    {/* <Plans /> */}
    <GenadropCreatedNFTs />
    <Review />
    {/* <JoinDiscord /> */}
    <Partners />
    <FAQ />
    <Media />
  </div>
);

export default Home;
