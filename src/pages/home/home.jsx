import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./home.module.css";
import { Collectors, creators } from "./home-script";
import Docs from "../../components/Home/Docs/Docs";

const Home = () => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <Banner />
      <Orgs />
      <Features data={creators} />
      <Features data={Collectors} />
    </div>
    <div className={`${classes.wrapper} ${classes.withBg}`}>
      <Docs />
    </div>
    <div className={classes.wrapper}>
      <Review />
      <FAQ />
    </div>
  </div>
);

export default Home;
