import React from "react";
import { Link } from "react-router-dom";
import classes from "./logo.module.css";

const Logo = () => (
  <div className={classes.container}>
    <Link to="/">
      <img className={classes.logo} src="./logo.PNG" alt="" />
    </Link>
  </div>
);

export default Logo;
