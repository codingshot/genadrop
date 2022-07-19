import React from "react";
import { ReactComponent as Icon } from "../../assets/icon-not-found.svg";
import classes from "./notFound.module.css";

const NotFound = () => (
  <div className={classes.container}>
    <div className={classes.imageContainer}>
      <Icon alt="" />
    </div>
    <h1>No results Found.</h1>
    <p>We can’t find any item matching your search</p>
  </div>
);

export default NotFound;
