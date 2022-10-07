import React from "react";
import classes from "./SliderInput.module.css";

const SliderInput = ({ MAX, value, handleChange }) => {
  const min = 0;
  const max = 10;
  const width = `${((value - min) * 100) / (max - min)}% 100%`;
  return (
    <div className={classes.container}>
      <input
        className={classes.slider}
        style={{
          backgroundSize: width,
        }}
        type="range"
        min="0"
        max={MAX}
        step={1}
        onChange={handleChange}
        value={value}
      />
      {/* <div>{value}</div> */}
    </div>
  );
};

export default SliderInput;
