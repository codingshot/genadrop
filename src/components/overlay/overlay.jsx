import React, { useContext } from "react";
import classes from "./overlay.module.css";
import { GenContext } from "../../gen-state/gen.context";
import drop from "../../assets/drop.svg";

const Overlay = () => {
  const { isLoading } = useContext(GenContext);

  return (
    <div className={`${classes.overlay} ${isLoading && classes.isLoading}`}>
      <img src={drop} alt="" />
      <div className={classes.loader}>
        <div className={classes.dotOne} />
        <div className={classes.dotTwo} />
        <div className={classes.dotThree} />
      </div>
    </div>
  );
};

export default Overlay;
