import React from "react";
import classes from "./Camera.module.css";
import Capture from "../../components/mint-webcam/Capture/Capture";

const Camera = () => {
  return (
    <div className={classes.container}>
      <Capture />
    </div>
  );
};

export default Camera;
