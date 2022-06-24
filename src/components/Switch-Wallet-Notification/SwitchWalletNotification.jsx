import React, { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./SwitchWalletNotification.module.css";
import closeIcon from "../../assets/icon-close.svg";
import { setSwitchWalletNotification } from "../../gen-state/gen.actions";

const SwitchWalletNotification = () => {
  const { dispatch, switchWalletNotification, mainnet } = useContext(GenContext);

  const handleClose = () => {
    dispatch(setSwitchWalletNotification(false));
  };

  return (
    <div className={`${classes.container} ${switchWalletNotification && classes.active}`}>
      <div className={classes.switchWalletNotification}>
        <div className={classes.message}>
          You're viewing data from the {mainnet ? "main" : "test"} network, but you are about to switch to the{" "}
          {mainnet ? "test" : "main"} network. To continue, please switch to
          <a
            href={mainnet ? "https://genadrop-staging.vercel.app/" : "https://www.genadrop.com/"}
            target="_blank"
            rel="noreferrer"
          >
            {mainnet ? "genadrop-staging.vercel.app" : "genadrop.com"}
          </a>
        </div>
        <img onClick={handleClose} className={classes.icon} src={closeIcon} alt="" />
      </div>
    </div>
  );
};

export default SwitchWalletNotification;
