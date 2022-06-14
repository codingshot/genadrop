import React from "react";
import classes from "./Artist.module.css";
import heroImg from "../../assets/artistHero.png";

const Artist = () => {
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.heroContainer}>
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
        </div>
        <div className={classes.join_wrapper}>
          <div className={classes.joinContainer}>
            <h3>Join Minority Programmers Association for early access</h3>
            <p>
              Sign up for Minority Programmers today and get early access to <br className={classes.lineBreak} />{" "}
              becoming a featured artists on our marketplace page
            </p>
            <a target="_blank" href="https://www.minorityprogrammers.com/" rel="noreferrer">
              Go to MPA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;
