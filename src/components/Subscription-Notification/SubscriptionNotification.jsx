import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { setUpgradePlan } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./SubscriptionNotification.module.css";

const SubscriptionNotification = () => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const { dispatch, currentUser, currentPlan, collectionName } = useContext(GenContext);

  const counter = () => {
    if (currentPlan !== "free") return;
    setTimeout(() => {
      setToggle(true);
    }, 10000);
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/pricing");
    handleClose();
  };

  const handleClose = () => {
    setToggle(false);
    // counter();
  };

  useEffect(() => {
    if (currentUser && collectionName) {
      counter();
    }
  }, [currentUser, collectionName]);

  return (
    <div className={`${classes.container} ${toggle && classes.active}`}>
      <button onClick={handleClose}>close</button>
      <div onClick={handleUpgrade}>upgrade</div>
    </div>
  );
};

export default SubscriptionNotification;
