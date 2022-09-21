import React from "react";
import classes from "./Hypnosis.module.css";

const Hypnosis = ({
  className = "",
  color = "var(--main-color)",
  width = "2rem",
  height = "2rem",
  duration = "1.2s",
  ...others
}) => {
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      {...others}
      style={{ width: resolvedWidth, height: resolvedHeight, color }}
      className={`${classes.container} ${className}`}
    >
      <div
        style={{ width: resolvedWidth, height: resolvedHeight, animationDuration: duration }}
        className={classes.animate}
      />
      <div
        className={classes.firstPartAniamte}
        style={{
          width: `calc(${resolvedWidth} * 0.6)`,
          height: `calc(${resolvedHeight} * 0.6)`,
          animationDuration: `calc(${duration} * 7 / 8)`,
        }}
      />
      <div
        className={classes.secondPartAniamte}
        style={{
          width: `calc(${resolvedWidth} * 0.8 / 3.5)`,
          height: `calc(${resolvedHeight} * 0.8 / 3.5)`,
          animationDuration: `calc(${duration} * 3 / 4)`,
        }}
      />
    </div>
  );
};

export default Hypnosis;
