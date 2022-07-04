import classes from "./Tooltip.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { handleAddSampleLayers } from "../../../utils";
import { useState } from "react";

const Tooltip = ({ isModal }) => {
  const { dispatch } = useContext(GenContext);
  const [showTip, setTip] = useState(false);

  const handleClose = () => {
    window.sessionStorage.isTooltip = "true";
    setTip(false);
  };

  const handleSamples = () => {
    handleAddSampleLayers({ dispatch });
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
          <button onClick={handleSamples}>Try our samples</button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
