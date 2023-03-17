import * as PushAPI from "@pushprotocol/restapi";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import classes from "./pushNotification.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { GenContext } from "../../gen-state/gen.context";

const PushNotification = ({ toggleNotification }) => {
  const [notifs, setNotifs] = useState();
  const { connector, account } = useContext(GenContext);

  const subscribeToChannel = async () => {
    console.log(connector.getSigner());
    const _signer = connector.getSigner();
    // console.log(provider.getSigner());
    try {
      await PushAPI.channels.subscribe({
        signer: _signer,
        channelAddress: "0xFb6d5fAa665783f4E4A1f5B198797C4d39478F13",
        userAddress: `${account}`,
        onSuccess: () => {
          console.log("opted in");
        },
        onError: () => {
          console.log("couldn't opted in");
        },
        env: "staging",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loadNotifications = useCallback(async () => {
    try {
      const feeds = await PushAPI.user.getFeeds({
        user: "0xFb6d5fAa665783f4E4A1f5B198797C4d39478F13",
        limit: 50,
        env: "staging",
      });
      console.log(feeds);
      setNotifs(feeds);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
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
        <button onClick={subscribeToChannel} type="button" className={classes.subsButton}>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default PushNotification;
