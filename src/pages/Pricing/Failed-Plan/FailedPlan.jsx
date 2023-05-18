/* eslint-disable consistent-return */
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../../gen-state/gen.context";
import { ReactComponent as FailedIcon } from "../../../assets/icon-payment-failed.svg";
import classes from "./FailedPlan.module.css";
import { setProposedPlan } from "../../../gen-state/gen.actions";
import Fallback from "../../fallback/fallback";

const FailedPlan = () => {
  const history = useHistory();
  if (window.sessionStorage.createNew !== "kd@#ff_dafknk_fiiqv//") {
    return <Fallback />;
  }
  const { dispatch, proposedPlan } = useContext(GenContext);

  useEffect(() => {
    if (!proposedPlan) {
      return history.push("/create/collection");
    }
    dispatch(setProposedPlan(""));
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <FailedIcon className={classes.failedIcon} />
        <div className={classes.heading}>Payment failed!</div>
        <div className={classes.description}>Something went terribly wrong here Don’t worry! Let’s try again</div>
        <div className={classes.btnContainer}>
          <button type="button" onClick={() => history.push("/create/session/pricing")} className={classes.btn_1}>
            Try again
          </button>
          <button type="button" onClick={() => history.push("/create/collection")} className={classes.btn_2}>
            Go to create
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedPlan;
