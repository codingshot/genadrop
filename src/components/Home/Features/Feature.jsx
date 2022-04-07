import React from "react";
import classes from "./Feature.module.css";

const Feature = ({ item }) => {
  const { icon, title, description } = item;

  return (
    <div className={classes.container}>
      <img src={icon} alt="" />
      <div className={classes.textWrapper}>
        <div className={classes.title}>{title}</div>
        <div className={classes.description}>{description}</div>
      </div>
    </div>
  );
};

export default Feature;
