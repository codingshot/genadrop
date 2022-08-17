import { useContext, useEffect, useState } from "react";
import { setCollectionName, setCurrentPlan, setCurrentSession, setLayerAction } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import { handleResetCreate } from "../../../utils";
import { v4 as uuid } from "uuid";
import { ReactComponent as SuccessIcon } from "../../../assets/icon-payment-successful.svg";
import classes from "./SuccessPlan.module.css";
import { useHistory } from "react-router-dom";

const SuccessPlan = () => {
  const history = useHistory();
  const { dispatch, upgradePlan, sessionId, collectionName, proposedPlan } = useContext(GenContext);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    dispatch(setCollectionName(inputValue));
    dispatch(
      setLayerAction({
        type: "name",
      })
    );
    history.push("/create");
  };

  useEffect(() => {
    let ID = uuid();
    if (!upgradePlan) {
      handleResetCreate({ dispatch });
      dispatch(setCurrentSession(ID));
    } else if (!sessionId) {
      dispatch(setCurrentSession(ID));
    }
    if (!collectionName) {
      dispatch(setCollectionName("New Collection"));
    }
    dispatch(setCurrentPlan(proposedPlan));
  }, []);

  useEffect(() => {
    if (!proposedPlan) {
      return history.push("/create");
    }
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    setInputValue(collectionName);
  }, [collectionName]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <SuccessIcon className={classes.successIcon} />
        <div className={classes.heading}>Payment Successful!</div>
        <div className={classes.description}>
          Good choice! Your payment for Hobby plan was successful. Input a collection name to proceed to the create
          page.
        </div>
        <form onSubmit={handleContinue}>
          <input onChange={handleChange} type="text" placeholder="Enter collection name" value={inputValue} />
          <button onClick={handleContinue} className={inputValue && classes.active}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuccessPlan;
