import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./Home.module.css";
import { Collectors, creators } from "./Home-Script";
import Docs from "../../components/Home/Docs/Docs";
import EarlyAccess from "../../components/early-access/early-access";
import JoinDiscord from "../../components/join-discord/JoinDiscord";

const Home = () => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <Banner />
      <EarlyAccess />
      <Orgs />
      <Features data={creators} />
      <Features data={Collectors} />
    </div>
    <div className={`${classes.wrapper} ${classes.withBg}`}>
      <Docs />
    </div>
    <div style={{ paddingBottom: "0rem" }} className={classes.wrapper}>
      <Review />
    </div>
    <div className={`${classes.wrapper} ${classes.withBg}`}>
      <JoinDiscord />
    </div>
    <div className={classes.wrapper}>
      <FAQ />
    </div>
  </div>
);

export default Home;
