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
} from "../../gen-state/gen.actions";
import CollectionNameModal from "../../components/Collection-Name-Modal/CollectionNameModal";
import { fetchSession } from "../../renderless/store-data/StoreData.script";
import { useHistory } from "react-router-dom";

const Create = () => {
  const history = useHistory();
  const [sessionDropdown, toggleSessionDropdown] = useState(false);
  const { isUser, dispatch, currentUser, currentPlan } = useContext(GenContext);

  const handleSample = () => {};

  const handleTutorial = () => {};

  useEffect(() => {
    if (!currentUser || isUser === "true") return;
    dispatch(setOverlay(true));
    const fetch = async () => {
      const sessions = await fetchSession({ currentUser });
      dispatch(setOverlay(false));
      console.log({ sessions });
      if (sessions.length) {
        dispatch(setSession(sessions));
        dispatch(setToggleSessionModal(true));
      } else {
        dispatch(setToggleCollectionNameModal(true));
      }
    };
    fetch();
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <SubscriptionNotification />
      <LoginModal />
      <CollectionNameModal />
      <div className={classes.details}>
        {currentPlan === "free" ? (
          <div onClick={() => history.push("/create/pricing")} className={classes.autoSave}>
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
