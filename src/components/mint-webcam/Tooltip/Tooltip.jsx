import React from "react";
import classes from "./Tooltip.module.css";

const Tooltip = () => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>Press and hold for video</div>
    </div>
  );
};

export default Tooltip;
