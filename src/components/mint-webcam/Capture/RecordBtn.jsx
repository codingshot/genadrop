import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import classes from "./Capture.module.css";

// record button
const RecordBtn = ({ seconds }) => (
  <div className={classes.RecordBtnWrapper}>
    <CircularProgressbar
      value={seconds / 500}
      maxValue={1}
      strokeWidth={12}
      styles={buildStyles({
        // Rotation of path and trail, in number of turns (0-1)
        rotation: 0.25,

        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        strokeLinecap: "round",

        // Text size
        textSize: "16px",

        // How long animation takes to go from one percentage to another, in seconds
        pathTransitionDuration: 0.5,

        // Colors
        pathColor: "#FF3236",
        trailColor: "#ffffff",
      })}
    />
    <div className={classes.recordBtn} />
  </div>
);

export default RecordBtn;
