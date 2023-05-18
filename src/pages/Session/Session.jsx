/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./Session.module.css";
import { ReactComponent as ChevronIcon } from "../../assets/icon-chevron-down.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/icon-arrow-left.svg";
import { GenContext } from "../../gen-state/gen.context";
import {
  addRule,
  setCollectionName,
  setCurrentPlan,
  setCurrentSession,
  setLayerAction,
  setLayers,
  setNftLayers,
  setOverlay,
  setSession,
  setUpgradePlan,
} from "../../gen-state/gen.actions";
import { deleteAllLayers, fetchSession, fetchUserSession } from "../../renderless/store-data/StoreData.script";
import { plans } from "../Pricing/Pricing.script";
import { getCurrentUser } from "../../components/google-auth/googleAuth.script";
import NotResult from "./No-Result/NoResult";
import { handleResetCreate } from "../../utils";

const Session = () => {
  const history = useHistory();
  const [dropdownId, setDropdown] = useState(-1);
  const [noResult, toggleNoResult] = useState(null);

  const { dispatch, currentUser, sessions, currentPlan } = useContext(GenContext);
  const handleLoad = async (sessionId, plan) => {
    console.log("fetch starts");
    handleResetCreate({ dispatch });
    dispatch(setOverlay(true));
    const res = await fetchUserSession({ currentUser, sessionId });
    if (res) {
      dispatch(setCurrentPlan(plan));
      dispatch(setLayers(res.layers));
      dispatch(setNftLayers(res.nftLayers));
      dispatch(setCollectionName(res.collectionName));
      dispatch(addRule(res.rules));
      dispatch(setCurrentSession(sessionId));
      dispatch(
        setLayerAction({
          type: "loadPreNftLayers",
        })
      );
      dispatch(setOverlay(false));
      console.log("fetch ends");
      history.push("/create/collection");
    }
  };

  const handleDelete = async (sessionId) => {
    console.log("delete starts");
    dispatch(setOverlay(true));
    await deleteAllLayers({ currentUser, sessionId });
    const sessions = await fetchSession({ currentUser });
    dispatch(setSession(sessions));
    if (!sessions.length) {
      toggleNoResult("true");
      // dispatch(setCurrentPlan("free"));
      if (currentPlan !== "free") {
        handleResetCreate({ dispatch });
      }
    }
    dispatch(setOverlay(false));
    console.log("delete ends");
  };

  const handleCreate = () => {
    dispatch(setUpgradePlan(false));
    history.push("/create/session/pricing");
  };

  const handleDropdown = (id) => {
    if (id === dropdownId) return setDropdown(-1);
    setDropdown(id);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(setOverlay(true));
        const sessions = await fetchSession({ currentUser });
        dispatch(setOverlay(false));
        if (sessions.length) {
          toggleNoResult("false");
          dispatch(setSession(sessions));
        } else {
          toggleNoResult("true");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) return;
    getCurrentUser({ dispatch });
  }, []);

  // return null
  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.backBtnContainer}>
        <ArrowBackIcon className={classes.backIcon} />
        <div>Back</div>
      </div>
      {noResult !== "true" ? (
        <div className={classes.wrapper}>
          <div className={classes.content}>
            <h1>Session</h1>
            <div className={classes.subHeading}>
              <h3>Active Session</h3>
              <button type="button" onClick={handleCreate}>
                create new
              </button>
            </div>
            {noResult === "false" ? (
              <div className={classes.sessionContainer}>
                {sessions &&
                  sessions.map(({ session }, idx) => (
                    <div key={idx} className={`${classes.sessionWrapper} ${dropdownId === idx && classes.active}`}>
                      <div key={idx} className={classes.session}>
                        <div className={classes.detail}>
                          <div className={classes.plan}>
                            <div className={classes.planName}>{session.currentPlan}</div>
                            <div className={classes.planFlag}>paid</div>
                          </div>
                          <div className={classes.collectionName}>{session.collectionName}</div>
                        </div>
                        <div className={classes.action}>
                          <div
                            onClick={() => handleLoad(session.sessionId, session.currentPlan)}
                            className={classes.loadBtn}
                          >
                            Load <span>session</span>
                          </div>
                          <div onClick={() => handleDelete(session.sessionId)} className={classes.deleteBtn}>
                            Delete <span>session</span>
                          </div>
                          <div onClick={() => handleDropdown(idx)} className={classes.dropdownIconContainer}>
                            <ChevronIcon
                              className={`${classes.dropdownIcon} ${dropdownId === idx && classes.active}`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`${classes.sessionDropdown} ${dropdownId === idx && classes.active}`}>
                        <div className={classes.cost}>
                          <div className={classes.title}>cost per session</div>
                          <div className={classes.amount}>${plans[session.currentPlan].price}</div>
                        </div>
                        <div className={classes.services}>
                          {plans[session.currentPlan].services.map(({ name, available }, idx) => (
                            <div key={idx} className={classes.service}>
                              {available ? (
                                <MarkIcon className={classes.markIcon} />
                              ) : (
                                <CloseIcon className={classes.closeIcon} />
                              )}
                              <div className={classes.serviceName}>{name}</div>
                            </div>
                          ))}
                        </div>
                        {/* <div className={classes.upgradeBtnContainer}>
                          <button onClick={handleUpgrade}>Upgrade plan</button>
                        </div> */}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className={classes.skeleton}>
                <Skeleton count={1} height={120} />
                <br />
                <Skeleton count={1} height={120} />
                <br />
                <Skeleton count={1} height={120} />
              </div>
            )}
          </div>
        </div>
      ) : noResult === "true" ? (
        <NotResult />
      ) : null}
    </div>
  );
};

export default Session;
