import React, { useState } from "react";
import classes from "./ButtonEffects.module.css";

const ButtonEffects = ({ children }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      className={`${classes.button} ${clicked && classes.clicked}`}
    >
      {children}
    </div>
  );
};

export default ButtonEffects;
