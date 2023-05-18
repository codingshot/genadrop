import React from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <div className={classes.left}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.right}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>
      </div>

      <div className={classes.bottom}>
        <Skeleton count={1} height={200} />
        <br />
        <Skeleton count={1} height={200} />
      </div>
    </div>
  );
};

export default LoadingScreen;
