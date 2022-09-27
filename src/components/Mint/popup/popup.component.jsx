import React from "react";
import ErrorPopup from "./error-popup.component";
import classes from "./popup.module.css";
import SuccessPopup from "./success-popup.component";

const Popup = (props) => {
  const { popupProps, handleSetState } = props;
  const { popup, isError } = popupProps;

  return (
    <div className={`${classes.container} ${popup && classes.active}`}>
      {isError ? (
        <ErrorPopup handleSetState={handleSetState} popupProps={popupProps} />
      ) : (
        <SuccessPopup handleSetState={handleSetState} popupProps={popupProps} />
      )}
    </div>
  );
};

export default Popup;
