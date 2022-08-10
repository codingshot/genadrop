import { useContext, useEffect } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { ReactComponent as FailedIcon } from "../../../assets/icon-payment-failed.svg";
import classes from "./FailedPlan.module.css";
import { useHistory } from "react-router-dom";

const FailedPlan = () => {
  const history = useHistory();
  const { currentPlan } = useContext(GenContext);

  useEffect(() => {
    if (currentPlan === "free") {
      return history.push("/create");
    }
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <FailedIcon className={classes.failedIcon} />
        <div className={classes.heading}>Payment Successful!</div>
        <div className={classes.description}>Something went terribly wrong here Don’t worry! Let’s try again</div>
        <div className={classes.btnContainer}>
          <button onClick={() => history.push("/create/session/pricing")} className={classes.btn_1}>
            Try again
          </button>
          <button onClick={() => history.push("/create")} className={classes.btn_2}>
            Go to create
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedPlan;
