import React from "react";
import classes from "./JoinDiscord.module.css";
import devIcon from "../../../assets/icon-dev.png";
import { Link } from "react-router-dom";

const JoinDiscord = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <div className={classes.heading}>Try Genadrop create app for free</div>
          <Link to="/create">
            <div className={classes.btn}>Try Now</div>
          </Link>
          <div className={classes.listContainer}>
            <div className={classes.listItem}>
              <span className={classes.listStyle} /> No coding needed, Drag & Drop.
            </div>
            <div className={classes.listItem}>
              <span className={classes.listStyle} /> Supports PNG of the same size.
            </div>
          </div>
        </div>
        <img src={devIcon} className={classes.image} alt="" />
      </div>
    </div>
  );
};

export default JoinDiscord;
