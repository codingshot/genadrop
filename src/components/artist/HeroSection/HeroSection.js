import React from "react";
import heroImg from "../../../assets/artistHero.png";
import classes from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <div className={classes.container}>
      <div className={classes.imgContainer}>
        <img src={heroImg} alt="artist" />
      </div>
      <div className={classes.content}>
        <div>
          <h3>
            Are you an artist interested
            <br className={classes.lineBreak} /> in using GenaDrop?
          </h3>
          <p>Sell your unique creation with GenaDrop</p>
        </div>
        <a
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSeVwZlJOkX_i9g8ogHlB_Jvnt0iYSTsXvzdJygCZx3XZQEnUw/viewform"
          className={classes.applyBtn}
          rel="noreferrer"
        >
          Apply now
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
