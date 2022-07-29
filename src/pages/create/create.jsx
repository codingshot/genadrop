import LayerOrders from "../../components/layerorders/layerorders";
import CollectionDescription from "../../components/description/collection-description";
import CollectionOverview from "../../components/overview/collection-overview";
import classes from "./create.module.css";
import { ReactComponent as Diskicon } from "../../assets/icon-disk.svg";
import { useEffect, useState } from "react";
import SessionDropdown from "../../components/session-dropdown/sessionDropdown";
import LoginModal from "../../components/Login-Modal/LoginModal";
import SubscriptionNotification from "../../components/Subscription-Notification/SubscriptionNotification";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  setOverlay,
  setSession,
  setToggleCollectionNameModal,
  setToggleSessionModal,
  setUpgradePlan,
} from "../../gen-state/gen.actions";
import CollectionNameModal from "../../components/Collection-Name-Modal/CollectionNameModal";
import { fetchSession, saveSession } from "../../renderless/store-data/StoreData.script";
import { useHistory } from "react-router-dom";
import { handleAddSampleLayers } from "../../utils";
import CreateGuide from "../../components/create-guide/create-guide";

const Create = () => {
  const history = useHistory();
  const [sessionDropdown, toggleSessionDropdown] = useState(false);
  const [toggleGuide, setGuide] = useState(false);
  const { isUser, dispatch, currentUser, currentPlan, sessionId, collectionName } = useContext(GenContext);

  const handleSample = () => {
    handleAddSampleLayers({ dispatch });
  };

  const handleTutorial = () => {
    setGuide(true);
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/pricing");
  };

  useEffect(() => {
    if (!currentUser || isUser === "true") return;
    const fetch = async () => {
      try {
        dispatch(setOverlay(true));
        const sessions = await fetchSession({ currentUser });
        dispatch(setOverlay(false));
        if (sessions.length) {
          dispatch(setSession(sessions));
          dispatch(setToggleSessionModal(true));
        } else if (!collectionName) {
          dispatch(setToggleCollectionNameModal(true));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [currentUser]);

  useEffect(() => {
    if (!sessionId) return;
    const fetch = async () => {
      try {
        dispatch(setOverlay(true));
        const sessions = await fetchSession({ currentUser });
        dispatch(setOverlay(false));
        if (sessions.length) {
          dispatch(setSession(sessions));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [currentUser, sessionId]);

  useEffect(() => {
    const save = async () => {
      if (collectionName && sessionId && currentPlan && currentUser) {
        const res = await saveSession({ currentUser, sessionId, collectionName, currentPlan });
        if (!res) return; // showNotification
        dispatch(setUpgradePlan(false));
      }
    };
    save();
  }, [collectionName, sessionId, currentPlan]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <SubscriptionNotification />
      <LoginModal />
      <CollectionNameModal />
      <CreateGuide toggleGuide={toggleGuide} setGuide={setGuide} />
      <div className={classes.details}>
        {currentPlan === "free" ? (
          <div onClick={handleUpgrade} className={classes.autoSave}>
            <Diskicon />
            <div>Auto-save</div>
          </div>
        ) : (
          <div
            onMouseOver={() => toggleSessionDropdown(true)}
            onMouseOut={() => toggleSessionDropdown(false)}
            className={classes.sessionContainer}
          >
            <div className={classes.session}>
              <Diskicon />
              <div>Your sessions</div>
            </div>
            <SessionDropdown dropdown={sessionDropdown} />
          </div>
        )}
        <div className={classes.guide}>
          <div>Need help?</div>
          <div onClick={handleSample}>Try our samples</div>
          <div onClick={handleTutorial}>Watch tutorial</div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.layer_overview}>
          <LayerOrders />
          <CollectionOverview />
        </div>
        <CollectionDescription />
      </div>
    </div>
  );
};

export default Create;
