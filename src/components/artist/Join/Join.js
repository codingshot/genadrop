import React from "react";
import classes from "./Join.module.css";

const Join = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <h3>Join Minority Programmers Association for early access</h3>
        <p>
          Sign up for Minority Programmers today and get early access to <br className={classes.lineBreak} /> becoming a
          featured artists on our marketplace page
        </p>
        <a target="_blank" href="https://www.minorityprogrammers.com/" rel="noreferrer">
          Go to MPA
        </a>
      </div>
    </div>
  );
};

export default Join;
