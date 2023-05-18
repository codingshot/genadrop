import React from "react";
import HeroSection from "../../components/artist/HeroSection/HeroSection";
import Join from "../../components/artist/Join/Join";
import classes from "./artist.module.css";

const artist = () => {
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

export default artist;
