import React from "react";
import { Link } from "react-router-dom";
import classes from "./Docs.module.css";
import { ReactComponent as Manual } from "../../../assets/icon-manual.svg";
import {  ReactComponent as LinkIcon } from "../../../assets/icon-link-accent2.svg";

const Docs = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Manual className={classes.image} alt="" />
        <div className={classes.content}>
          <div className={classes.heading}>Get started with Genadrop</div>
          <div className={classes.description}>Everything you Need to know on How to use Genadrop</div>
          <Link to="/docs" className={classes.link}>
            <div>Read the Docs</div>
            <LinkIcon alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Docs;
