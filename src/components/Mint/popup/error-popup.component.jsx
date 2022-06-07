import errorIcon from "../../../assets/icon-error_2.svg";
import closeIcon from "../../../assets/icon-close.svg";
import { useRef, useState } from "react";
import classes from "./popup.module.css";

const ErrorPopup = (props) => {
  const { handleSetState, popupProps } = props;

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
  };

  return (
    <div className={classes.popupContainer}>
      <img onClick={handleResetPopup} src={closeIcon} alt="" className={classes.closeBtn} />
      <div className={classes.imgContainer}>
        <img src={errorIcon} alt="" />
      </div>
      <h3 className={`${classes.heading} ${classes.error}`}>Mint Failed</h3>
      <p className={classes.errorMsg}>{popupProps.url}</p>
      <div className={classes.actionBtnContainer}>
        <button onClick={handleResetPopup} className={`${classes.actionBtn} ${classes.errorBtn}`}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
