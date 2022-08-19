import { useContext, useEffect, useState } from "react";
import {
  addRule,
  setCollectionName,
  setCurrentPlan,
  setCurrentSession,
  setCurrentUser,
  setLayerAction,
  setLayers,
  setPreview,
  setProposedPlan,
  setUpgradePlan,
} from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import { handleResetCreate } from "../../../utils";
import { v4 as uuid } from "uuid";
import { ReactComponent as SuccessIcon } from "../../../assets/icon-payment-successful.svg";
import classes from "./SuccessPlan.module.css";
import { useHistory } from "react-router-dom";
import { fetchUserData } from "../../../renderless/store-data/StoreDataLocal";
import { saveSession } from "../../../renderless/store-data/StoreData.script";

const SuccessPlan = () => {
  const history = useHistory();
  const { dispatch, upgradePlan, sessionId, collectionName, proposedPlan, currentUser } = useContext(GenContext);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const save = async ({ collectionName = "New Collection", sessionId, proposedPlan, currentUser }) => {
    const res = await saveSession({ currentUser, sessionId, collectionName, currentPlan: proposedPlan });
    if (!res) return; // showNotification
    dispatch(setUpgradePlan(false));
    return;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    dispatch(setCollectionName(inputValue));
    dispatch(
      setLayerAction({
        type: "name",
      })
    );
    await save({ collectionName: inputValue, sessionId, currentUser, proposedPlan });
    history.push("/create");
  };

  useEffect(() => {
    if (window.sessionStorage.isStripe) return;
    let ID = uuid();
    if (!upgradePlan) {
      handleResetCreate({ dispatch });
      dispatch(setCurrentSession(ID));
      save({ collectionName, sessionId: ID, currentUser, proposedPlan });
    } else if (!sessionId) {
      dispatch(setCurrentSession(ID));
      save({ collectionName, sessionId: ID, currentUser, proposedPlan });
    } else {
      save({ collectionName, sessionId, currentUser, proposedPlan });
    }
    if (!collectionName) {
      dispatch(setCollectionName("New Collection"));
    }
    dispatch(setCurrentPlan(proposedPlan));
  }, []);

  useEffect(() => {
    if (window.sessionStorage.isStripe) return;
    if (!proposedPlan) {
      return history.push("/create");
    }
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    async function runFetch() {
      if (window.sessionStorage.isStripe) {
        const { layers, preview, rule, collectionName, sessionId, upgradePlan, proposedPlan, currentUser } =
          await fetchUserData({ dispatch });
        let ID = uuid();
        if (!upgradePlan) {
          handleResetCreate({ dispatch });
          await save({ collectionName: "New Collection", sessionId: ID, currentUser, proposedPlan });
          dispatch(setCurrentSession(ID));
          dispatch(setCurrentUser(currentUser));
          dispatch(setCollectionName("New Collection"));
          dispatch(setCurrentPlan(proposedPlan));
          dispatch(setProposedPlan(proposedPlan));
          return;
        } else if (!sessionId) {
          dispatch(setCurrentSession(ID));
        } else {
          dispatch(setCurrentSession(sessionId));
        }
        await save({ collectionName, sessionId: sessionId ? sessionId : ID, currentUser, proposedPlan });
        dispatch(setLayers(layers));
        dispatch(setPreview(preview));
        dispatch(addRule(rule));
        dispatch(setCollectionName(collectionName));
        dispatch(setCurrentPlan(proposedPlan));
        dispatch(setProposedPlan(proposedPlan));
        dispatch(setCurrentUser(currentUser));
        dispatch(setUpgradePlan(upgradePlan));
      }
      window.sessionStorage.isStripe = undefined;
    }
    runFetch();
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
