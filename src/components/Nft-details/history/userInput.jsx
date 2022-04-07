import React from "react";
import classes from "./userInput.module.css";

const UserInput = (props) => (
  <div>
    <input className={classes.input} placeholder="" onChange={(e) => props.update(e)} />
  </div>
);

export default UserInput;
