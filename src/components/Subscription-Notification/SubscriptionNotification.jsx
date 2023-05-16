import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { setUpgradePlan } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./SubscriptionNotification.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";

const SubscriptionNotification = () => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const { dispatch, currentUser, currentPlan, collectionName } = useContext(GenContext);
  const _5mins = 1000 * 60 * 5;

  let timerId = null;
  const counter = () => {
    if (currentPlan !== "free") return;
    timerId = setTimeout(() => {
      setToggle(true);
    }, _5mins);
  };

  const handleClose = () => {
    setToggle(false);
    clearInterval(timerId);
    counter();
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/session/pricing");
    handleClose();
  };

  useEffect(() => {
    if (currentUser && collectionName) {
      counter();
    }
  }, [currentUser, collectionName]);

  return (
    <div className={`${classes.container} ${toggle && classes.active}`}>
      <CloseIcon className={classes.closeIcon} onClick={handleClose} />
      <div className={classes.title}>Upgrade Plan!</div>
      <div className={classes.description}>
        You’re using a free plan. Upgrade to auto-save session, download collection, and more..
      </div>
      <div className={classes.list}>
        <CloseIcon className={classes.listIcon} />
        <div>Auto-save progress</div>
      </div>
      <div className={classes.list}>
        <CloseIcon className={classes.listIcon} />
        <div>Download collection</div>
      </div>
      <div className={classes.list}>
        <CloseIcon className={classes.listIcon} />
        <div>More than 2000 art generation</div>
      </div>
      <div className={classes.upgradeBtn} onClick={handleUpgrade}>
        upgrade plan
      </div>
    </div>
  );
};

export default SubscriptionNotification;
