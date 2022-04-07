import React, { useEffect, useRef, useContext, useState } from "react";
import { setNotification } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Notification.module.css";

const Notification = () => {
  const feedbackRef = useRef(null);
  const { notification, loaderMessage, dispatch } = useContext(GenContext);
  const [state, setState] = useState({
    toggleFeedback: false,
  });
  const { toggleFeedback } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (!notification) return;
    handleSetState({ toggleFeedback: true });
    setTimeout(() => {
      handleSetState({ toggleFeedback: false });
    }, 5000);
  }, [notification]);

  useEffect(() => {
    feedbackRef.current.onanimationend = (e) => {
      if (e.animationName.includes("slide-out")) {
        dispatch(setNotification(""));
      }
    };
  }, []);

  return (
    <div
      style={{ top: loaderMessage ? "8em" : "4em" }}
      className={`${classes.container} ${toggleFeedback && classes.active}`}
    >
      <div ref={feedbackRef} className={classes.notification}>
        <div className={classes.icon} />
        <div className={classes.message}>{notification}</div>
      </div>
    </div>
  );
};

export default Notification;
