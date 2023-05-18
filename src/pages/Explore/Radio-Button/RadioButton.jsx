import React from "react";
import classes from "./RadioButton.module.css";

const RadioButton = ({ active, onClick }) => {
  return (
    <div onClick={onClick} className={`${classes.container} ${active && classes.active}`}>
      <div className={classes.dot} />
    </div>
  );
};

export default RadioButton;
