import React from "react";
import HeroSection from "../../components/artist/HeroSection/HeroSection";
import Join from "../../components/artist/Join/Join";
import classes from "./Artist.module.css";

const Artist = () => {
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <HeroSection />
        </div>
        <Join />
      </div>
    </div>
  );
};

export default Artist;
