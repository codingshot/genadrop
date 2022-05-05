import React, { useContext, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import classes from "./wallet.module.css";
import { GenContext } from "../../gen-state/gen.context";
import { setConnector, setAccount, setNotification, setChainId, setMainnet } from "../../gen-state/gen.actions";
import userIcon from "../../assets/user.svg";
// import switchIcon from "../../assets/icon-switch.svg";
import copyIcon from "../../assets/icon-copy.svg";
import disconnectIcon from "../../assets/icon-disconnect.svg";
import polygonIcon from "../../assets/icon-polygon.svg";
import algoIcon from "../../assets/icon-algo.svg";
import auroraIcon from "../../assets/icon-aurora.svg";
import celoIcon from "../../assets/icon-celo.svg";
import downArrow from "../../assets/icon-chevron-down.svg";

const chainIcon = {
  Polygon: polygonIcon,
  "Polygon Testnet": polygonIcon,
  Algorand: algoIcon,
  Aurora: auroraIcon,
  Celo: celoIcon,
};

const chains = [
  { label: "Algorand", networkId: 4160, symbol: "ALGO" },
  { label: "Celo", networkId: 42220, symbol: "CGLD" },
  { label: "Polygon", networkId: 137, symbol: "MATIC" },
  { label: "Polygon Testnet", networkId: 80001, symbol: "MATIC" },
  { label: "Aurora", networkId: 1313161555, symbol: "AURORA" },
];

function ConnectWallet({ setToggleNav }) {
  const history = useHistory();
  const { pathname } = useLocation();

  const { dispatch, connector, account, chainId, mainnet } = useContext(GenContext);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [clipboardState, setClipboardState] = useState("Copy Address");
  const [network, setNetwork] = useState(process.env.REACT_APP_ENV_STAGING ? "testnet" : "mainnet");

  const clipboardRef = useRef(null);

  function breakAddress(address = "", width = 6) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          137: "https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym",
          4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
        },
        rpcUrl: "",
      },
    },
  };

  const web3Modal = new Web3Modal({
    providerOptions, // required
  });

  async function disconnect() {
    if (connector) {
      dispatch(setAccount(""));
      dispatch(setConnector());
      dispatch(setChainId(""));
      setToggleDropdown(false);
      if (pathname.includes("/me")) {
        history.push("/marketplace");
      }
    }
  }

  const toggleWallet = async () => {
    let connector;
    const networkArray = ["137", "1313161554", "42220"];
    try {
      connector = await web3Modal.connect();
    } catch (error) {
      dispatch(
        setNotification({
          message: "connection failed",
          type: "error",
        })
      );
      return;
    }

    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();

    if (provider.connection.url === "metamask") {
      console.log(provider, window.ethereum.networkVersion);
      if (networkArray.includes(window.ethereum.networkVersion)) {
        setNetwork("mainnet");
        dispatch(setMainnet(true));
      } else {
        setNetwork("testnet");
        dispatch(setMainnet(false));
      }
      await dispatch(setConnector(provider));
      await dispatch(setChainId(window.ethereum.networkVersion));
      const accountAddress = await signer.getAddress();
      dispatch(setAccount(accountAddress));
      connector.on("accountsChanged", (accounts) => {
        dispatch(setAccount(accounts[0]));
      });
      connector.on("chainChanged", () => {
        const web3Provider = new ethers.providers.Web3Provider(connector);
        dispatch(setConnector(web3Provider));
      });
      connector.on("networkChanged", (networkId) => {
        dispatch(setChainId(networkId));
        console.log(networkId, networkArray.includes(networkId));
        if (networkArray.includes(networkId)) {
          console.log("SHout halle");
          setNetwork("mainnet");
          dispatch(setMainnet(true));
        } else {
          console.log("unabailable");
          setNetwork("testnet");
          dispatch(setMainnet(false));
        }
      });
    } else {
      await dispatch(setConnector(connector));
      if (!connector.connected) {
        // create new session
        await connector.createSession();
      }
      // Subscribe to connection events
      connector.on("connect", (error, payload) => {
        if (error) {
          dispatch(
            setNotification({
              message: "Not connected",
              type: "warning",
            })
          );
          // feedbacktype: warn

          throw error;
        }
        // Get provided accounts
        const { accounts } = payload.params[0];
        dispatch(setAccount(accounts[0]));
      });

      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts
        const { accounts } = payload.params[0];
        dispatch(setAccount(accounts[0]));
      });

      if (connector.connected) {
        const { accounts } = connector;
        console.log("account", accounts);
        dispatch(setChainId(connector.chainId));

        dispatch(setAccount(accounts[0]));
      }

      connector.on("disconnect", (error) => {
        if (error) {
          throw error;
        }
      });
    }
    // check if already connected
  };

  const handleSwitch = async () => {
    if (network === "mainnet") {
      setNetwork("testnet");
      dispatch(setMainnet(false));
    } else {
      setNetwork("mainnet");
      dispatch(setMainnet(true));
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
    const c = chains.find((c) => c.networkId === chainId);
    if (!c) return;
    return c.label;
  };

  return account ? (
    <div className={classes.container}>
      <div
        onMouseLeave={() => setToggleDropdown(false)}
        className={`${classes.connected} ${toggleDropdown && classes.active}`}
      >
        <img className={classes.chain} src={chainIcon[getConnectedChain()]} alt="" />
        <div onClick={() => setToggleDropdown(!toggleDropdown)} className={classes.address}>
          <span>{breakAddress(account)}</span>
        </div>
        <div className={`${classes.dropdown} ${toggleDropdown && classes.active}`}>
          <div onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.option}>
            <div>{clipboardState}</div> <img src={copyIcon} alt="" />
            <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={account} />
          </div>
          <div onClick={disconnect} className={classes.option}>
            <div>Disconnect</div>
            <img src={disconnectIcon} alt="" />
          </div>
        </div>
      </div>
      <div className={classes.network}>
        {network === "mainnet" ? "Mainnet" : "Testnet"}
        <img src={downArrow} alt="" />

        <div onClick={handleSwitch} className={classes.networkDrop}>
          {network === "mainnet" ? "Testnet" : "Mainnet"}
        </div>
      </div>
      <div
        onClick={() => {
          history.push(`/me/${account}`);
        }}
        className={classes.user}
      >
        <img src={userIcon} alt="" />
      </div>
    </div>
  ) : (
    <div className={classes.connect} onClick={toggleWallet}>
      Connect Wallet
    </div>
  );
}

export default ConnectWallet;
