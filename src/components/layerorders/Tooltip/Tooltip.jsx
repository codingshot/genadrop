import classes from "./Tooltip.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { handleAddSampleLayers } from "../layeroders-script";

const Tooltip = () => {
  const { dispatch } = useContext(GenContext);
  const [show, setShow] = useState(window.sessionStorage.isTooltip);

  const handleClose = () => {
    window.sessionStorage.isTooltip = "true";
    setShow(window.sessionStorage.isTooltip);
  };

  const handleSamples = () => {
    handleAddSampleLayers({ dispatch });
    handleClose();
  };

  return (
    <div className={`${classes.container} ${!window.sessionStorage.isTooltip && classes.active}`}>
      <CloseIcon onClick={handleClose} className={classes.closeBtn} />
      <div className={classes.card}>
        <div className={classes.title}>Add layers for your arts using this button.</div>
        <div className={classes.wrapper}>
          <p>Or see how it work?</p>
          <button onClick={handleSamples}>Try our samples</button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
