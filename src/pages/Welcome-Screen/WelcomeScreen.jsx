import React, { useEffect } from "react";
import classes from "./WelcomeScreen.module.css";
import dropIcon from "../../assets/drop.svg";

const WelcomeScreen = ({ showWelcomeScreen }) => {
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
          <img id="dropIcon" className={classes.image} src={dropIcon} alt="" />
        </div>
        p
      </div>
    </div>
  );
};

export default WelcomeScreen;
