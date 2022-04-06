import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./home.module.css";
import { Collectors, creators } from "./home-script";

const Home = () => (
  <div className={classes.container}>
    <Banner />
    <Orgs />
    <Features data={creators} />
    <Features data={Collectors} />
    <Review />
    <FAQ />
  </div>
);

export default Home;
