import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import classes from "./wallet.module.css";
import { GenContext } from "../../gen-state/gen.context";
import {
  setConnector,
  setAccount,
  setNotification,
  setChainId,
  setMainnet,
  setProposedChain,
  setClipboard,
} from "../../gen-state/gen.actions";
import userIcon from "../../assets/user.svg";
import switchIcon from "../../assets/icon-switch.svg";
import copyIcon from "../../assets/icon-copy.svg";
import disconnectIcon from "../../assets/icon-disconnect.svg";
import blankImage from "../../assets/blank.png";
import WalletPopup from "../wallet-popup/walletPopup";
import { supportedChains } from "../../utils/supportedChains";
import { connectWithMetamask, connectWithQRCode } from "./wallet-script";
import { ethers } from "ethers";

function ConnectWallet() {
  const history = useHistory();
  const { pathname } = useLocation();
  const clipboardRef = useRef(null);
  const { dispatch, account, chainId, mainnet, proposedChain } = useContext(GenContext);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [clipboardState, setClipboardState] = useState("Copy Address");
  const [network, setNetwork] = useState(process.env.REACT_APP_ENV_STAGING === "true" ? "testnet" : "mainnet");
  const [togglePopup, setTogglePopup] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [provider, setProvider] = useState();

  const breakAddress = (address = "", width = 6) => {
    if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  const handleConnect = () => {
    if (window?.ethereum !== undefined) {
      setTogglePopup(true);
    } else {
      dispatch(
        setNotification({
          message: "You need to install metamask to continue",
          type: "error",
        })
      );

      dispatch(setClipboard("https://metamask.io/"));
    }
  };

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState("Copied");
    setTimeout(() => {
      setClipboardState("Copy Address");
    }, 850);
  };

  const getConnectedChain = () => {
    const c = supportedChains[chainId];
    if (!c) return blankImage;
    return c.icon;
  };

  const isAlgoConnected = async (provider) => {
    if (provider?.connected) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.log("error disconneting: ", error);
      }
    }
  };

  const updateAccount = async (provider) => {
    await isAlgoConnected(provider);
    const [accounts] = await ethereum.request({ method: "eth_accounts" });
    accounts && dispatch(setAccount(accounts));
    const networkId = await ethereum.networkVersion;
    let isSupported = Object.keys(supportedChains).includes(networkId);
    if (!isSupported) {
      dispatch(
        setNotification({
          message: "network not supported",
          type: "error",
        })
      );
      disconnectWallet();
      setTogglePopup(true);
    } else {
      dispatch(setChainId(Number(networkId)));
      setTogglePopup(false);
    }
  };

  const disconnectWallet = async () => {
    await isAlgoConnected(provider);
    dispatch(setAccount(null));
    dispatch(setChainId(null));
    dispatch(setProposedChain(-1));
    setToggleDropdown(false);
    if (pathname.includes("/me")) {
      history.push("/marketplace");
    }
  };

  useEffect(() => {
    if (!proposedChain) return setRefresh(!refresh);
    let isSupported = Object.keys(supportedChains).includes(String(proposedChain));
    if (!isSupported) return;
    async function connectWallet() {
      if (proposedChain === 4160) {
        await connectWithQRCode({ provider, dispatch });
        dispatch(setConnector(provider));
      } else {
        await connectWithMetamask({ dispatch, supportedChains, proposedChain, provider });
        const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch(setConnector(ethereumProvider));
      }
    }

    connectWallet();
  }, [proposedChain]);

  useEffect(() => {
    const networkArray = [137, 1313161554, 42220];
    if (networkArray.includes(chainId)) {
      setNetwork("mainnet");
      dispatch(setMainnet(true));
    } else {
      setNetwork("testnet");
      dispatch(setMainnet(false));
    }
  }, [chainId]);

  useEffect(() => {
    if (window?.ethereum !== undefined) {
      const { ethereum } = window;
      let walletConnectProvider;
      try {
        walletConnectProvider = new WalletConnectProvider({
          rpc: {
            4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
          },
        });
      } catch (error) {
        console.log(error);
      }

      if (window.localStorage.walletconnect) {
        let newProvider = JSON.parse(window.localStorage.walletconnect);
        dispatch(setProposedChain(newProvider.chainId));
        dispatch(setConnector(walletConnectProvider));
      } else {
        updateAccount(walletConnectProvider);
        const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch(setConnector(ethereumProvider));
      }

      setProvider(walletConnectProvider);

      // initiallize account
      // Subscribe to accounts change
      ethereum.on("accountsChanged", function (accounts) {
        updateAccount(walletConnectProvider);
      });

      // Subscribe to chainId change
      ethereum.on("chainChanged", (chainId) => {
        updateAccount(walletConnectProvider);
        // window.location.reload();
      });

      // Subscribe to accounts change
      walletConnectProvider.on("accountsChanged", (accounts) => {
        dispatch(setAccount(accounts[0]));
        dispatch(setChainId(walletConnectProvider.chainId));
      });

      // Subscribe to chainId change
      walletConnectProvider.on("chainChanged", (chainId) => {
        dispatch(setChainId(chainId));
      });

      // Subscribe to session disconnection
      walletConnectProvider.on("disconnect", (code, reason) => {
        disconnectWallet();
      });
    } else {
      console.log("metamask is not installed");
    }
  }, [refresh]);

  const changeNetwork = <div className={classes.network}>{network === "mainnet" ? "Mainnet" : "Testnet"}</div>;

  const goToDashboard = (
    <div
      onClick={() => {
        history.push(`/me/${account}`);
      }}
      className={classes.user}
    >
      <img src={userIcon} alt="" />
    </div>
  );

  const dropdown = (
    <div className={`${classes.dropdown} ${toggleDropdown && classes.active}`}>
      <div onClick={handleConnect} className={classes.option}>
        <img src={switchIcon} alt="" />
        <div>Switch network</div>
      </div>
      <div onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.option}>
        <img src={copyIcon} alt="" />
        <div>{clipboardState}</div>
        <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={account} />
      </div>
      <div onClick={disconnectWallet} className={classes.option}>
        <img src={disconnectIcon} alt="" />
        <div>Disconnect</div>
      </div>
    </div>
  );

  const connected = (
    <div
      onMouseLeave={() => setToggleDropdown(false)}
      className={`${classes.connected} ${toggleDropdown && classes.active}`}
    >
      <img className={classes.chain} src={getConnectedChain()} alt="" />
      <div onClick={() => setToggleDropdown(!toggleDropdown)} className={classes.address}>
        <span>{breakAddress(account)}</span>
      </div>
      {dropdown}
    </div>
  );

  return (
    <div>
      <div className={`${classes.popupContainer} ${togglePopup && classes.active}`}>
        <WalletPopup setTogglePopup={setTogglePopup} />
      </div>
      {account ? (
        <div className={classes.container}>
          {connected}
          {changeNetwork}
          {goToDashboard}
        </div>
      ) : (
        <div className={classes.connect} onClick={handleConnect}>
          Connect Wallet
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
