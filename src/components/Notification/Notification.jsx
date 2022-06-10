import React, { useEffect, useRef, useContext, useState } from "react";
import { setNotification } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Notification.module.css";
import warningIcon from "../../assets/icon-warning.svg";
import successIcon from "../../assets/icon-success.svg";
import errorIcon from "../../assets/icon-error.svg";
import blankIcon from "../../assets/blank.png";

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

  const notificationIcon = {
    warning: warningIcon,
    error: errorIcon,
    success: successIcon,
    default: blankIcon,
  };

  useEffect(() => {
    if (!notification.message) return;
    handleSetState({ toggleFeedback: true });
    setTimeout(() => {
      handleSetState({ toggleFeedback: false });
    }, 5000);
  }, [notification]);

  useEffect(() => {
    feedbackRef.current.onanimationend = (e) => {
      if (e.animationName.includes("slide-out")) {
        dispatch(
          setNotification({
            message: "",
            type: "success",
          })
        );
      }
    };
  }, []);

  return (
    <div
      style={{ top: loaderMessage ? "9em" : "5em" }}
      className={`${classes.container} ${toggleFeedback && classes.active}`}
    >
      <div ref={feedbackRef} className={`${classes.notification} ${classes[notification.type]}`}>
        <img className={classes.icon} src={notificationIcon[notification.type]} alt="" />
        <div className={classes.message}>
          {notification.message.charAt(0).toUpperCase() + notification.message.substring(1)}
        </div>
      </div>
    </div>
  );
};

export default Notification;
