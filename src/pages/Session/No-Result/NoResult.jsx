import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./NoResult.module.css";
import { ReactComponent as CartIcon } from "../../../assets/icon-cart.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setUpgradePlan } from "../../../gen-state/gen.actions";

const NotFound = () => {
  const { dispatch } = useContext(GenContext);
  const history = useHistory();

  const handleCreate = () => {
    dispatch(setUpgradePlan(false));
    history.push("/create/session/pricing");
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/session/pricing");
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1>Session</h1>
        <div className={classes.wrapper}>
          <CartIcon className={classes.cartIcon} />
          <div className={classes.description}>
            <div>You have no saved session</div>
            <div>Upgrade to any of our paid plans to save your session progress</div>
          </div>
          <button type="button" onClick={handleUpgrade} className={classes.upgradeBtn}>
            Upgrade
          </button>
          <button type="button" onClick={handleCreate} className={classes.createBtn}>
            Create new session
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
