import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import errorIcon from "../../../assets/icon-error_2.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import classes from "./popup.module.css";
import successIcon from "../../../assets/icon-success_2.svg";
import linkIconAccent from "../../../assets/icon-link-accent.svg";
import linkIconWhite from "../../../assets/icon-link-white.svg";
import { GenContext } from "../../../gen-state/gen.context";

export const NearErrorPop = (props) => {
  const { handleSetState, popupProps } = props;

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
    window.location.search = "";
  };

  return (
    <div className={`${classes.container} ${popupProps?.Popup && classes.active}`}>
      <div className={classes.popupContainer}>
        <CloseIcon onClick={handleResetPopup} className={classes.closeIcon} />
        <div className={classes.imgContainer}>
          <img src={errorIcon} alt="" />
        </div>
        <h3 className={`${classes.heading} ${classes.error}`}>Mint Failed</h3>
        <p className={classes.errorMsg}>Something went wrong while minting, Please try again</p>
        <div className={classes.actionBtnContainer}>
          <button type="button" onClick={handleResetPopup} className={`${classes.actionBtn} ${classes.errorBtn}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const NearSuccessPopup = (props) => {
  const clipboardRef = useRef(null);
  const [clipboardState, setClipboardState] = useState("Copy");
  const history = useHistory();
  const { account, chainId } = useContext(GenContext);

  const {
    handleSetState,
    popupProps: { url },
  } = props;

  const handleCopy = (clipProps) => {
    const { navigator, clipboard } = clipProps;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState("Copied");
    setTimeout(() => {
      setClipboardState("Copy");
    }, 650);
  };

  const nearExplorerUrl =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? `https://explorer.testnet.near.org/?query=${url}`
      : `https://explorer.near.org/transactions/${url}`;

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
    window.location.search = "";
  };
  return (
    <div className={`${classes.container} ${true && classes.active}`}>
      <div className={classes.popupContainer}>
        <CloseIcon onClick={handleResetPopup} className={classes.closeIcon} />
        <div className={classes.imgContainer}>
          <img src={successIcon} alt="" />
        </div>
        <h3 className={`${classes.heading} ${classes.success}`}>Mint Successful</h3>
        <div className={classes.actionBtnContainer}>
          <button
            onClick={() => {
              history.push(`/profile/${chainId}/${account}`);
            }}
            type="button"
            className={`${classes.actionBtn} ${classes._1}`}
          >
            Go to Dashboard
          </button>
          <button className={`${classes.actionBtn} ${classes._2}`} type="button">
            <a href={nearExplorerUrl} target="_blank" rel="noreferrer">
              Block Explorer
            </a>
            <div className={classes.iconContainer}>
              <img src={linkIconAccent} alt="" />
              <img src={linkIconWhite} alt="" />
            </div>
          </button>
        </div>
        <div className={classes.detailsContainer}>
          <div className={classes.tag}>Share</div>
          <div className={classes.url}>{nearExplorerUrl}</div>
          <button
            onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })}
            className={classes.copyBtn}
            type="button"
          >
            {clipboardState}
          </button>
          <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={nearExplorerUrl} />
        </div>
      </div>
    </div>
  );
};
