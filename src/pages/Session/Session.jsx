import classes from "./Session.module.css";
import { ReactComponent as ChevronIcon } from "../../assets/icon-chevron-down.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/icon-arrow-left.svg";
import { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  setCollectionName,
  setCurrentPlan,
  setCurrentSession,
  setLayers,
  setNftLayers,
  setOverlay,
  setSession,
  setUpgradePlan,
} from "../../gen-state/gen.actions";
import { deleteAllLayers, fetchSession, fetchUserSession } from "../../renderless/store-data/StoreData.script";
import { useHistory } from "react-router-dom";
import { plans } from "../Pricing/Pricing.script";
import { getCurrentUser } from "../../components/google-auth/googleAuth.script";
import NotResult from "./No-Result/NoResult";
import Skeleton from "react-loading-skeleton";
import { handleResetCreate } from "../../utils";

const Session = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dropdownId, setDropdown] = useState(-1);
  const [noResult, toggleNotResult] = useState(null);

  const { dispatch, currentUser, sessions, isUser, currentPlan } = useContext(GenContext);

  const handleLoad = async (sessionId, plan) => {
    console.log("fetch starts");
    handleResetCreate({ dispatch });
    setLoading(true);
    const res = await fetchUserSession({ currentUser, sessionId });
    if (res) {
      dispatch(setCurrentPlan(plan));
      dispatch(setLayers(res.layers));
      dispatch(setNftLayers(res.nftLayers));
      dispatch(setCollectionName(res.collectionName));
      dispatch(setCurrentSession(sessionId));
      history.push("/create");
    }
    setLoading(false);
    console.log("fetch ends");
  };

  const handleDelete = async (sessionId) => {
    console.log("delete starts");
    setLoading(true);
    await deleteAllLayers({ currentUser, sessionId });
    const sessions = await fetchSession({ currentUser });
    dispatch(setSession(sessions));
    if (!sessions.length) {
      toggleNotResult("true");
      dispatch(setCurrentPlan("free"));
      if (currentPlan !== "free") {
        console.log("reset");
        handleResetCreate({ dispatch });
      }
    }
    setLoading(false);
    console.log("delete ends");
  };

  const handleCreate = () => {
    dispatch(setUpgradePlan(false));
    history.push("/create/session/pricing");
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
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
          toggleNotResult("false");
          dispatch(setSession(sessions));
        } else {
          toggleNotResult("true");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [currentUser]);

  useEffect(() => {
    if (isUser === "true") return;
    getCurrentUser({ dispatch });
  }, []);

  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.backBtnContainer}>
        <ArrowBackIcon className={classes.backIcon} />
        <div>Back</div>
      </div>
      {noResult !== "true" ? (
        <div className={classes.wrapper}>
          <div className={` ${classes.loader} ${loading && classes.active}`}>
            <div className={classes.dots}>
              <div>Loading</div>
              <div className={classes.dotOne} />
              <div className={classes.dotTwo} />
              <div className={classes.dotThree} />
            </div>
          </div>
          <div className={classes.content}>
            <h1>Session</h1>
            <div className={classes.subHeading}>
              <h3>Active Session</h3>
              <button onClick={handleCreate}>create new</button>
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
                        <div className={classes.upgradeBtnContainer}>
                          <button onClick={handleUpgrade}>Upgrade plan</button>
                        </div>
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
