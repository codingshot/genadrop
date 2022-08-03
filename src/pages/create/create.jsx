import LayerOrders from "../../components/layerorders/layerorders";
import CollectionDescription from "../../components/description/collection-description";
import CollectionOverview from "../../components/overview/collection-overview";
import classes from "./create.module.css";
import { useEffect, useState } from "react";
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
import CreateGuide from "../../components/create-guide/create-guide";
import GoogleAuth from "../../components/google-auth/googleAuth";
import ProfileDropdown from "../../components/profile-dropdown/profileDropdown";
import { ReactComponent as Diskicon } from "../../assets/icon-disk.svg";
import ProgressBar from "./Progress-Bar/ProgressBar";
import { useRef } from "react";
import { handleSampleLayers } from "../../components/menu/collection-menu-script";

const Create = () => {
  const collectionNameRef = useRef();
  const history = useHistory();
  const [profileDropdown, toggleProfileDropdown] = useState(false);
  const [toggleGuide, setGuide] = useState(false);
  const [nameWidth, setNameWidth] = useState(0);

  const { isUser, dispatch, currentUser, currentPlan, sessionId, collectionName } = useContext(GenContext);

  const handleSample = () => {
    handleSampleLayers({ dispatch });
  };

  const handleTutorial = () => {
    setGuide(true);
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/session/pricing");
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
    let width = collectionNameRef.current.offsetWidth;
    setNameWidth(width / 16);
  }, [collectionName]);

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
        <div className={classes.profileContainer}>
          <div
            onMouseOver={() => toggleProfileDropdown(true)}
            onMouseOut={() => toggleProfileDropdown(false)}
            className={`${classes.profile} ${currentUser && classes.active}`}
          >
            <GoogleAuth />
            <div className={classes.collectionNameContainer}>
              <div
                ref={collectionNameRef}
                className={`${classes.collectionName} ${currentUser && classes.active} ${
                  nameWidth > 6 && classes.move
                }`}
              >
                {collectionName}
              </div>
            </div>
            <ProfileDropdown
              dropdown={profileDropdown}
              setDropdown={toggleProfileDropdown}
              userName={currentUser?.displayName}
            />
          </div>
          {currentPlan === "free" ? (
            <div onClick={handleUpgrade} className={classes.autoSave}>
              <Diskicon />
              <div>Auto-save</div>
            </div>
          ) : (
            <ProgressBar />
          )}
        </div>

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
