import React, { useEffect } from "react";
import classes from "./welcome.module.css";
import { ReactComponent as DropIcon } from "../../assets/drop.svg";

const Welcome = ({ showWelcomeScreen }) => {
  useEffect(() => {
    document.getElementById("dropIcon").onanimationend = () => {
      showWelcomeScreen(false);
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.gena}>gena</div>
      <div className={classes.drop}>
        dr
        <div className={classes.imageContainer}>
          <DropIcon id="dropIcon" className={classes.image} alt="" />
        </div>
        p
      </div>
    </div>
  );
};

export default Welcome;
