import React from "react";
import { Link } from "react-router-dom";
import classes from "./Docs.module.css";
import manual from "../../../assets/icon-manual.svg";
import linkIcon from "../../../assets/icon-link-accent2.svg";

const Docs = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img className={classes.image} src={manual} alt="" />
        <div className={classes.content}>
          <div className={classes.heading}>Get started with Genadrop</div>
          <div className={classes.description}>Everything you Need to know on How to use Genadrop</div>
          <Link to="/docs" className={classes.link}>
            <div>Read the Docs</div>
            <img src={linkIcon} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Docs;
