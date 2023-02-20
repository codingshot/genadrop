import React, { useContext, useEffect, useState } from "react";

// near wallets
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { setupNightly } from "@near-wallet-selector/nightly";

// near wallet styles & icons
import "@near-wallet-selector/modal-ui/styles.css";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
import MeteorIconUrl from "@near-wallet-selector/meteor-wallet/assets/meteor-icon.png";
import HereWalletIconUrl from "@near-wallet-selector/here-wallet/assets/here-wallet-icon.png";
import XDefiIcon from "@near-wallet-selector/xdefi/assets/xdefi-icon.png";
import NightlyIcon from "@near-wallet-selector/nightly/assets/nightly.png";
import classes from "./walletPopup.module.css";

// components
import supportedChains, { orderedChainsList } from "../../utils/supportedChains";
import {
  setProposedChain,
  setToggleWalletPopup,
  setAccount,
  setChainId,
  setConnector,
} from "../../gen-state/gen.actions";
import getConfig from "./nearConfig";
import { GenContext } from "../../gen-state/gen.context";

// icons
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import metamaskIcon from "../../assets/icon-metamask.svg";
import walletConnectIcon from "../../assets/icon-wallet-connect.svg";
import walletLockIcon from "../../assets/lock.svg";
import moreIcons from "../../assets/moreDots.svg";
import exportIcon from "../../assets/icon-link-white.svg";

// unused for now

// import { async } from "regenerator-runtime";
// import Web3 from "web3";
// import { Magic } from "magic-sdk";
// import { ConnectExtension } from "@magic-ext/connect";
// import magicLinkIcon from "../../assets/icon-magic-link.svg";

const WalletPopup = ({ handleSetState }) => {
  const { dispatch, mainnet, connectFromMint, connector } = useContext(GenContext);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showConnectionMethods, setConnectionMethods] = useState(false);
  const [activeChain, setActiveChain] = useState(null);
  const [showMetamask, setMetamask] = useState(true);
  const [connectOptions, setConnectOptions] = useState(orderedChainsList);

  const handleProposedChain = async () => {
    dispatch(setProposedChain(activeChain));
    dispatch(setToggleWalletPopup(false));
    setConnectionMethods(false);
  };

  const handleChain = async (chainId, isComingSoon = undefined) => {
    if (isComingSoon) return;
    if (chainId === 4160 || supportedChains[chainId]?.chain === "Near") {
      setMetamask(false);
    } else {
      setMetamask(true);
      window.localStorage.removeItem("near_wallet");
    }
    if (supportedChains[chainId]?.chain === "Near") {
      // NEAR Connect
      const network = process.env.REACT_APP_ENV_STAGING === "true" ? "testnet" : "mainnet";
      const nearConfig = getConfig(`${network}`);
      const connectedToNearMainnet = {};
      if (process.env.REACT_APP_ENV_STAGING === "true") {
        connectedToNearMainnet.modules = [
          setupMyNearWallet({ walletUrl: "https://testnet.mynearwallet.com", iconUrl: MyNearIconUrl }),
          setupNearWallet({ iconUrl: NearIconUrl }),
          setupMeteorWallet({ iconUrl: MeteorIconUrl }),
          setupHereWallet({ iconUrl: HereWalletIconUrl }),
        ];
      } else {
        connectedToNearMainnet.modules = [
          setupMyNearWallet({ walletUrl: "https://app.mynearwallet.com", iconUrl: MyNearIconUrl }),
          setupNearWallet({ iconUrl: NearIconUrl }),
          setupSender({ iconUrl: SenderIconUrl }),
          setupMeteorWallet({ iconUrl: MeteorIconUrl }),
          setupHereWallet({ iconUrl: HereWalletIconUrl }),
          setupNightly({ iconUrl: NightlyIcon }),
          // setupXDEFI({ iconUrl: XDefiIcon }),
        ];
      }
      const walletSelector = await setupWalletSelector({
        network: nearConfig,
        ...connectedToNearMainnet,
      });
      const description = "Please select a wallet to sign in..";
      const contract =
        process.env.REACT_APP_ENV_STAGING === "true" ? "genadrop-test.mpadev.testnet" : "genadrop-contract.nftgen.near";

      const modal = setupModal(walletSelector, { contractId: contract, description });
      modal.show();

      const isSignedIn = walletSelector.isSignedIn();
      window.selector = walletSelector;
      if (isSignedIn) {
        window.localStorage.setItem("near_wallet", "connected_to_near");
        dispatch(setChainId(chainId));
        dispatch(setAccount(walletSelector.store.getState().accounts[0].accountId));
        dispatch(setProposedChain(chainId));
        dispatch(setConnector(walletSelector.wallet()));
      }

      dispatch(setToggleWalletPopup(false));
      handleProposedChain();

      return;
    }
    if (window.selector) {
      const nearLogout = await window.selector.wallet();
      nearLogout.signOut();
    }

    setActiveChain(chainId);
    setConnectionMethods(true);
  };

  const handleMetamask = async () => {
    handleSetState({ connectionMethod: "metamask" });
    // initializeConnection({ dispatch, handleSetState, activeChain, mainnet });
    handleProposedChain();
  };

  const handleWalletConnect = async () => {
    handleSetState({ connectionMethod: "walletConnect" });
    handleProposedChain();
  };

  const handleMagicLink = async () => {
    handleSetState({ connectionMethod: "magicLink" });
    handleProposedChain();
  };
  useEffect(() => {
    setShowMoreOptions(false);
    setConnectionMethods(false);
  }, []);

  useEffect(() => {
    if (!connectFromMint.chainId) return;
    dispatch(setToggleWalletPopup(true));
    handleChain(connectFromMint.chainId, connectFromMint.isComingSoon);
  }, [connectFromMint, window.selector]);

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.leftGrid}>
          <div className={classes.heading}>
            <h3>{showConnectionMethods ? "Connect Wallets" : "Connect Your Wallet"}</h3>
            <p className={classes.description}>
              {showConnectionMethods
                ? "Connect with one of our available wallet providers. You need to connect your wallet to access most of Genadrop features."
                : "Select any of our supported blockchains"}{" "}
            </p>
            {!showConnectionMethods && (
              <div className={classes.networkSwitch}>
                You&apos;re viewing data from the {mainnet ? "main" : "test"} network.
                <br /> Go to{" "}
                <a
                  href={mainnet ? "https://genadrop-testnet.vercel.app/" : "https://www.genadrop.com/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {mainnet ? "genadrop-testnet.vercel.app" : "genadrop.com"}
                </a>{" "}
                to switch to {!mainnet ? "main" : "test"} network
              </div>
            )}
          </div>

          <div className={classes.wrapper}>
            <div className={`${classes.chains} ${showConnectionMethods && classes.active}`}>
              {connectOptions
                .filter((chain) => mainnet === chain.isMainnet)
                .filter((_, idx) => showMoreOptions || idx <= 4)
                .map((chain, idx) => (
                  <div
                    onClick={async () => {
                      await handleChain(chain.networkId, chain.comingSoon);
                    }}
                    key={idx}
                    className={`${classes.chain} ${chain.comingSoon && classes.comingSoon}`}
                  >
                    <img src={chain.icon} alt="" />
                    <div className={classes.name}>
                      <h4>{chain.label}</h4>
                      {chain.comingSoon ? <span>Coming soon</span> : ""}
                    </div>
                  </div>
                ))}
              <div className={classes.viewBtnContainer} onClick={() => setShowMoreOptions(!showMoreOptions)}>
                <img src={moreIcons} alt="" />
                <div className={classes.viewBtn}>View {showMoreOptions ? "Less" : "More"}</div>
              </div>
            </div>
            <div className={`${classes.connectionMethods} ${showConnectionMethods && classes.active}`}>
              {window.ethereum !== undefined && (
                <div
                  onClick={handleMetamask}
                  className={`${classes.connectionMethod} ${classes.metamask} ${showMetamask && classes.active}`}
                >
                  <img src={metamaskIcon} alt="" />
                  <h5>MetaMask</h5>
                </div>
              )}
              <div onClick={handleWalletConnect} className={classes.connectionMethod}>
                <img src={walletConnectIcon} alt="" />
                <h5>WalletConnect</h5>
              </div>
              {/* <div onClick={handleMagicLink} className={classes.connectionMethod}>
              <img src={magicLinkIcon} alt="" />
              <h3>Magic Connect</h3>
              <p>Connect using Magic Connect</p>
            </div> */}
            </div>
          </div>
        </div>
        <div className={classes.rightGrid}>
          <div className={classes.iconContainer}>
            <CloseIcon
              onClick={() => {
                dispatch(setToggleWalletPopup(false));
                setShowMoreOptions(false);
                setConnectionMethods(false);
              }}
              className={classes.closeIcon}
            />
          </div>
          <div className={classes.lockSection}>
            <div>
              <img src={walletLockIcon} alt="" />
            </div>
            <div>
              <button className={classes.learnButton} type="button">
                <h1>Learn How to Connect</h1>
                <img src={exportIcon} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;
