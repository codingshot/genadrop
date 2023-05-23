/* eslint-disable react/no-array-index-key */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./UpgradeModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setToggleUpgradeModal, setUpgradePlan } from "../../../gen-state/gen.actions";
import { ReactComponent as FailureIcon } from "../../../assets/icon-failure-circle.svg";
import { ReactComponent as SuccessIcon } from "../../../assets/icon-success-circle.svg";
import { ReactComponent as UpgradeIcon } from "../../../assets/icon-upgrade.svg";
import { plans } from "../../../pages/Pricing/Pricing.script";

const UpgradeModal = () => {
  const history = useHistory();
  const { toggleUpgradeModal, dispatch, currentPlan } = useContext(GenContext);
  const planState = [<FailureIcon />, <SuccessIcon />];

  const mapPlanToState = (plan, state) => {
    const states = {
      free: 0,
      hobby: 1,
      pro: 2,
      agency: 3,
    };

    const currentState = states[plan];
    if (currentState < states[state]) return true;
    return false;
  };

  const handleClose = () => {
    dispatch(setToggleUpgradeModal(false));
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    handleClose();
    history.push("/create/session/pricing");
  };

  return (
    <div className={`${classes.container} ${toggleUpgradeModal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          {currentPlan === "free" ? (
            <div className={classes.heading}>
              Ooops... your<span className={classes.accent}> {currentPlan} </span>
              plan doesn’t <br />
              support auto-saving and collection download
            </div>
          ) : (
            <div className={classes.heading}>
              Ooops... you have exeeded your
              <br />
              generate limit for this plan. Upgrade to generate more{" "}
            </div>
          )}
          <UpgradeIcon className={classes.upgradeIcon} />
          <div className={classes.features}>FEATURES AVAILABLE IN</div>
          <div className={classes.plans}>
            {Object.keys(plans).map((plan, idx) => (
              <div key={idx} className={classes.plan}>
                {planState[`${mapPlanToState(currentPlan, plan) ? 1 : 0}`]}
                <div>{plan}</div>
              </div>
            ))}
          </div>
          <button onClick={handleUpgrade} type="button">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
