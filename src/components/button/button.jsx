import React from "react";
import classes from "./button.module.css";

const Button = ({ children, invert }) => (
  <button type="button" className={`${classes.button} ${invert && classes.invert}`}>
    {children}
  </button>
);

export default Button;
