import * as PushAPI from "@pushprotocol/restapi";
import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./pushNotification.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { GenContext } from "../../gen-state/gen.context";
import { setNotification } from "../../gen-state/gen.actions";
import { subscribeToChannel, unSubscribeFromChannel } from "./notificationFunctions";

const PushNotification = ({ toggleNotification }) => {
  const [notifications, setNotifications] = useState();
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const { connector, account, dispatch } = useContext(GenContext);

  const subscriptionProps = {
    account,
    connector,
    dispatch,
    setNotification,
  };

  const loadNotifications = () => {};

  const confirmUserSubscriptionStatus = useCallback(async () => {
    try {
      const currentChannelSubscriptions = await PushAPI.user.getSubscriptions({
        user: `eip155:80001:${account}`,
        env: "staging",
      });
      if (currentChannelSubscriptions.length) {
        const subscribedAddress = currentChannelSubscriptions?.map((data) => data?.channel);
        if (subscribedAddress.includes("0xFb6d5fAa665783f4E4A1f5B198797C4d39478F13")) {
          setIsUserSubscribed(true);
        } else {
          setIsUserSubscribed(false);
        }
      } else {
        setIsUserSubscribed(false);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    confirmUserSubscriptionStatus();
  }, []);

  const handleSubscription = () => {
    if (isUserSubscribed) {
      unSubscribeFromChannel(subscriptionProps);
    } else {
      subscribeToChannel(subscriptionProps);
    }
  };

  const handleClose = () => toggleNotification({ openNotification: false });

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Notifications</h1>
        <CloseIcon onClick={handleClose} className={classes.closeIcon} />
      </div>
      <div className={classes.content}>
        <h3>No Notifications</h3>
        <span>You don't have any notifications yet</span>
      </div>
      <div className={classes.footer}>
        <button onClick={handleSubscription} type="button" className={classes.subsButton}>
          {isUserSubscribed ? "UnSubscribe" : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default PushNotification;
