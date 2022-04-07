import React, { useRef, useContext, useEffect, useState } from "react";

import { setClipboard } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./clipboard.module.css";
import linkIcon from "../../assets/icon-link.svg";
import closeIcon from "../../assets/icon-close.svg";

const Clipboard = () => {
  const [state, setState] = useState({
    toggleClipboard: false,
    clipboardState: "copy",
  });
  const { toggleClipboard, clipboardState } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const clipboardRef = useRef(null);

  const { notification, clipboardMessage, loaderMessage, dispatch } = useContext(GenContext);

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    handleSetState({ clipboardState: "copied" });
    setTimeout(() => {
      handleSetState({ clipboardState: "copy" });
    }, 650);
  };

  const handleDiscard = () => {
    handleSetState({ toggleClipboard: false });
    setTimeout(() => {
      dispatch(setClipboard(""));
    }, 500);
  };

  useEffect(() => {
    if (!clipboardMessage) return;
    handleSetState({ toggleClipboard: true });
  }, [clipboardMessage]);

  return (
    <div
      style={{
        top: notification && loaderMessage ? "10em" : loaderMessage ? "6em" : notification ? "8em" : "4em",
      }}
      className={`${classes.container} ${toggleClipboard && classes.active}`}
    >
      <img className={classes.icon} onClick={handleDiscard} src={closeIcon} alt="" />
      <div className={classes.message}>{clipboardMessage}</div>
      <div className={classes.action}>
        <div className={classes.copy} onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })}>
          {clipboardState}
        </div>
        <a href={clipboardMessage} target="_blank" rel="noreferrer">
          <img src={linkIcon} alt="icon" />
        </a>
      </div>
      <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={clipboardMessage} />
    </div>
  );
};

export default Clipboard;
