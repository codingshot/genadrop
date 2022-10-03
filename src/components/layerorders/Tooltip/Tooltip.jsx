import React, { useState } from "react";
import classes from "./Tooltip.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const Tooltip = ({ isModal }) => {
  const [showTip, setTip] = useState(false);

  const handleClose = () => {
    window.sessionStorage.isTooltip = "true";
    setTip(false);
  };

  const handleSamples = () => {
    handleClose();
  };

  return (
    <div
      className={`${classes.container} ${showTip && !window.sessionStorage.isTooltip && !isModal && classes.active}`}
    >
      <CloseIcon onClick={handleClose} className={classes.closeBtn} />
      <div className={classes.card}>
        <div className={classes.title}>Add layers for your arts using this button.</div>
        <div className={classes.wrapper}>
          <p>Or see how it work?</p>
          <button onClick={handleSamples} type="button">
            Try our samples
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
