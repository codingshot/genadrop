import React from "react";
import classes from "./loading.module.css";
import { ReactComponent as Drop } from "../../assets/drop.svg";

const Loading = () => (
  <div className={classes.wrapper}>
    <Drop alt="" />
    <div className={classes.loader}>
      <div className={classes.dotOne} />
      <div className={classes.dotTwo} />
      <div className={classes.dotThree} />
    </div>
  </div>
);

export default Loading;
