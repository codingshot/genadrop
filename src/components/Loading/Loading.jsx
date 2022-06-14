import React from "react";
import classes from "./Loading.module.css";
import drop from "../../assets/drop.svg";

const Loading = () => (
  <div className={classes.wrapper}>
    <img src={drop} alt="" />
    <div className={classes.loader}>
      <div className={classes.dotOne} />
      <div className={classes.dotTwo} />
      <div className={classes.dotThree} />
    </div>
  </div>
);

export default Loading;
