import React from "react";
import classes from "./pushNotification.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";

const PushNotification = ({ toggleNotification }) => {
  const handleClose = () => toggleNotification({ openNotification: false });
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Notifications</h1>
        <CloseIcon onClick={handleClose} className={classes.closeIcon} />
      </div>
      <div className={classes.content}>
        <h3>No Notifications</h3>
        <span>You don&apos;t have any notifications yet</span>
      </div>
      <div className={classes.footer}>
        <button type="button" className={classes.subsButton}>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default PushNotification;
