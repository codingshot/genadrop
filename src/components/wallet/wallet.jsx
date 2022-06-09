import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./wallet.module.css";
import { GenContext } from "../../gen-state/gen.context";
import userIcon from "../../assets/user.svg";
import switchIcon from "../../assets/icon-switch.svg";
import copyIcon from "../../assets/icon-copy.svg";
import disconnectIcon from "../../assets/icon-disconnect.svg";
import WalletPopup from "../wallet-popup/walletPopup";
import supportedChains from "../../utils/supportedChains";
import {
  setNetworkType,
  connectWallet,
  getConnectedChain,
  breakAddress,
  disconnectWallet,
  connectWithQRCode,
  initializeConnection,
  initConnectWallet,
} from "./wallet-script";

function ConnectWallet() {
  const history = useHistory();
  const { pathname } = useLocation();
  const clipboardRef = useRef();
  const walletProviderRef = useRef(0);
  const { dispatch, account, chainId, proposedChain, mainnet, toggleWalletPopup } = useContext(GenContext);

  const [state, setState] = useState({
    toggleDropdown: false,
    clipboardState: "Copy Address",
    network: null,
    walletConnectProvider: null,
    connectionMethod: null,
    isMetamask: true,
    overrideWalletConnect: false,
    rpc: {
      4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
    },
  });

  const {
    toggleDropdown,
    clipboardState,
    network,
    walletConnectProvider,
    overrideWalletConnect,
    connectionMethod,
    rpc,
    isMetamask,
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const walletProps = {
    dispatch,
    supportedChains,
    proposedChain,
    mainnet,
    chainId,
    walletConnectProvider,
    connectionMethod,
    walletProviderRef,
    rpc,
    history,
    pathname,
    handleSetState,
  };

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    handleSetState({ clipboardState: "Copied" });
    setTimeout(() => {
      handleSetState({ clipboardState: "Copy Address" });
    }, 850);
  };

  const handleDisconnet = () => {
    disconnectWallet(walletProps);
  };

  useEffect(() => {
    setNetworkType(walletProps);
  }, [chainId]);

  useEffect(() => {
    let isSupported = Object.keys(supportedChains).includes(String(proposedChain));
    if (!isSupported) return;
    connectWallet(walletProps);
  }, [proposedChain, connectionMethod]);

  useEffect(() => {
    if (walletProviderRef.current >= 2 || overrideWalletConnect) {
      handleSetState({ overrideWalletConnect: false });
      connectWithQRCode(walletProps);
    } else {
      walletProviderRef.current = +1;
    }
  }, [walletConnectProvider, overrideWalletConnect]);

  useEffect(() => {
    initializeConnection(walletProps);
  }, [rpc]);

  const goToDashboard = (
    <div
      onClick={() => {
        history.push(`/me/${account}`);
        window.location.reload();
      }}
      className={classes.user}
    >
      <img src={userIcon} alt="" />
    </div>
  );

  const dropdown = (
    <div className={`${classes.dropdown} ${toggleDropdown && classes.active}`}>
      <div onClick={() => initConnectWallet(walletProps)} className={classes.option}>
        <img src={switchIcon} alt="" />
        <div>Switch network</div>
      </div>
      <div onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.option}>
        <img src={copyIcon} alt="" />
        <div>{clipboardState}</div>
        <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={account} />
      </div>
      <div onClick={handleDisconnet} className={classes.option}>
        <img src={disconnectIcon} alt="" />
        <div>Disconnect</div>
      </div>
    </div>
  );

  const connected = (
    <div
      onMouseLeave={() => handleSetState({ toggleDropdown: false })}
      onMouseOver={() => handleSetState({ toggleDropdown: true })}
      className={`${classes.connected} ${toggleDropdown && classes.active}`}
    >
      <img className={classes.chain} src={getConnectedChain(chainId)} alt="" />
      <div className={classes.address}>
        <span>{breakAddress(account)}</span>
      </div>
      {dropdown}
    </div>
  );

  const changeNetwork = <div className={classes.network}>{network === "mainnet" ? "Mainnet" : "Testnet"}</div>;

  return (
    <div>
      <div className={`${classes.popupContainer} ${toggleWalletPopup && classes.active}`}>
        <WalletPopup isMetamask={isMetamask} handleSetState={handleSetState} />
      </div>
      {account ? (
        <div className={classes.container}>
          {connected}
          {changeNetwork}
          {goToDashboard}
        </div>
      ) : (
        <div className={classes.connect} onClick={() => initConnectWallet(walletProps)}>
          Connect Wallet
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
