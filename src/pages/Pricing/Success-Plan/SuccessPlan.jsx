/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import {
  addRule,
  setCollectionName,
  setCurrentPlan,
  setCurrentSession,
  setCurrentUser,
  setIsUser,
  setLayerAction,
  setLayers,
  setNftLayers,
  setPreview,
  setProposedPlan,
  setUpgradePlan,
} from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import { handleResetCreate } from "../../../utils";
import { ReactComponent as SuccessIcon } from "../../../assets/icon-payment-successful.svg";
import classes from "./SuccessPlan.module.css";
import { fetchUserData } from "../../../renderless/store-data/StoreDataLocal";
import { saveSession } from "../../../renderless/store-data/StoreData.script";
import Fallback from "../../fallback/fallback";

const SuccessPlan = () => {
  const history = useHistory();
  if (window.sessionStorage.createNew !== "kd@#ff_dafknk_fiiqv//") {
    return <Fallback />;
  }
  const { dispatch, upgradePlan, sessionId, collectionName, proposedPlan, currentUser } = useContext(GenContext);
  const [inputValue, setInputValue] = useState("");
  const { isStripe } = window.sessionStorage;

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const save = async ({ collectionName = "New Collection", sessionId, proposedPlan, currentUser }) => {
    const res = await saveSession({ currentUser, sessionId, collectionName, currentPlan: proposedPlan });
    if (!res) return; // showNotification
    dispatch(setUpgradePlan(false));
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
    history.push("/create/collection");
  };

  useEffect(() => {
    if (isStripe === "true") return;
    const ID = uuid();
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
    if (isStripe === "true") return;
    if (!proposedPlan) {
      return history.push("/create/collection");
    }
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    async function runFetch() {
      if (isStripe === "true") {
        const {
          layers,
          nftLayers,
          preview,
          rule,
          collectionName,
          sessionId,
          upgradePlan,
          proposedPlan,
          currentPlan,
          currentUser,
        } = await fetchUserData();
        const ID = uuid();
        if (!upgradePlan) {
          handleResetCreate({ dispatch });
          await save({ collectionName: "New Collection", sessionId: ID, currentUser, proposedPlan });
          dispatch(setCurrentSession(ID));
          dispatch(setCurrentUser(currentUser));
          dispatch(setCollectionName("New Collection"));
          dispatch(setCurrentPlan(proposedPlan));
          dispatch(setProposedPlan(proposedPlan));
          return;
        }
        if (!sessionId) {
          dispatch(setCurrentSession(ID));
        } else {
          dispatch(setCurrentSession(sessionId));
        }
        await save({ collectionName, sessionId: sessionId || ID, currentUser, proposedPlan: currentPlan });
        dispatch(setLayers(layers));
        dispatch(setNftLayers(nftLayers));
        dispatch(setPreview(preview));
        dispatch(addRule(rule));
        dispatch(setCollectionName(collectionName));
        dispatch(setProposedPlan(proposedPlan));
        dispatch(setCurrentUser(currentUser));
        dispatch(setUpgradePlan(upgradePlan));
        dispatch(setCurrentPlan(proposedPlan));
      }
      window.sessionStorage.isStripe = "false";
      dispatch(setIsUser("true"));
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
          <button type="button" onClick={handleContinue} className={inputValue && classes.active}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuccessPlan;
