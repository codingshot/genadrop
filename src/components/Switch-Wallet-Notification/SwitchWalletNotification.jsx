import React, { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./SwitchWalletNotification.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
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
            href={mainnet ? "https://testnet.genadrop.io/" : "https://www.genadrop.com/"}
            target="_blank"
            rel="noreferrer"
          >
            {mainnet ? "testnet.genadrop.io" : "genadrop.com"}
          </a>
        </div>
        <CloseIcon className={classes.closeIcon} onClick={handleClose} />
      </div>
    </div>
  );
};

export default SwitchWalletNotification;
