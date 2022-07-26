import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./SubscriptionNotification.module.css";

const SubscriptionNotification = () => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const { currentUser, currentPlan, collectionName } = useContext(GenContext);

  const counter = () => {
    if (currentPlan !== "free") return;
    setTimeout(() => {
      setToggle(true);
    }, 10000);
  };

  const handleUpgrade = () => {
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
  }, [currentUser]);

  return (
    <div className={`${classes.container} ${toggle && classes.active}`}>
      <button onClick={handleClose}>close</button>
      <div onClick={handleUpgrade}>upgrade</div>
    </div>
  );
};

export default SubscriptionNotification;
