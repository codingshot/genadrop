import React, { useContext, useEffect, useState } from "react";
import classes from "./walletPopup.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import metamaskIcon from "../../assets/icon-metamask.svg";
import walletConnectIcon from "../../assets/icon-wallet-connect.svg";
import { GenContext } from "../../gen-state/gen.context";
import {
  setProposedChain,
  setToggleWalletPopup,
  setAccount,
  setChainId,
  setNotification,
  setConnector,
} from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";
import "regenerator-runtime";
import getConfig from "./nearConfig";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import NightlyIconUrl from "@near-wallet-selector/nightly-connect/assets/nightly-connect.png";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import MeateoIconUrl from "@near-wallet-selector/meteor-wallet/assets/meteor-icon.png";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupNightlyConnect } from "@near-wallet-selector/nightly-connect";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupSender } from "@near-wallet-selector/sender";

const WalletPopup = ({ handleSetState }) => {
  const { dispatch, mainnet, connectFromMint, connector } = useContext(GenContext);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showConnectionMethods, setConnectionMethods] = useState(false);
  const [activeChain, setActiveChain] = useState(null);
  const [showMetamask, setMetamask] = useState(true);

  const connectOptions = [];
  for (const key in supportedChains) {
    if (key !== "4160") {
      connectOptions.push(supportedChains[key]);
    }
  }
  connectOptions.unshift(supportedChains[4160]);

  const handleProposedChain = async () => {
    console.log(connector);
    dispatch(setProposedChain(activeChain));
    dispatch(setToggleWalletPopup(false));
    setConnectionMethods(false);
  };

  const handleChain = async (chainId, isComingSoon = undefined) => {
    if (isComingSoon) return;
    if (chainId === 4160 || chainId === 1111) {
      setMetamask(false);
    } else {
      setMetamask(true);
    }
    if (chainId === 1111) {
      // NEAR Connect
      const nearConfig = getConfig("testnet");
      const walletSelector = await setupWalletSelector({
        network: nearConfig,
        modules: [
          setupMyNearWallet({ iconUrl: MyNearIconUrl }),
          setupLedger({ iconUrl: LedgerIconUrl }),
          setupNightlyConnect({
            iconUrl: NightlyIconUrl,
          }),
          setupSender({ iconUrl: SenderIconUrl }),
          setupMeteorWallet({ iconUrl: MeateoIconUrl }),
        ],
      });

      const isSignedIn = walletSelector.isSignedIn();
      if (isSignedIn) {
        dispatch(setChainId(1111));
        dispatch(setAccount(walletSelector.store.getState().accounts[0].accountId));
        dispatch(setProposedChain(1111));
        dispatch(setConnector(walletSelector.wallet()));
      }
      const description = "Please select a wallet to sign in..";
      const modal = setupModal(walletSelector, { contractId: "genadrop-test.mpadev.testnet", description });
      modal.show();
      dispatch(setToggleWalletPopup(false));
      handleProposedChain();

      return;
    } else {
      console.log(window.selector);
      if (window.selector) {
        const nearLogout = await window.selector.wallet();
        nearLogout.signOut();
      }
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

  useEffect(() => {
    setShowMoreOptions(false);
    setConnectionMethods(false);
  }, []);

  useEffect(() => {
    if (!connectFromMint.chainId) return;
    dispatch(setToggleWalletPopup(true));
    handleChain(connectFromMint.chainId, connectFromMint.isComingSoon);
  }, [connectFromMint]);

  return (
    <div className={classes.container}>
      <div className={classes.card}>
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

        <div className={classes.heading}>
          <h3>{showConnectionMethods ? "Connect Wallets" : "Link Wallets"}</h3>
          <p className={classes.description}>
            {showConnectionMethods
              ? "Connect with one of our available wallet providers."
              : "Select any of our supported blockchain to connect your wallet."}{" "}
          </p>
          {!showConnectionMethods && (
            <div className={classes.networkSwitch}>
              You&apos;re viewing data from the {mainnet ? "main" : "test"} network.
              <br /> Go to{" "}
              <a
                href={mainnet ? "https://genadrop-staging.vercel.app/" : "https://www.genadrop.com/"}
                target="_blank"
                rel="noreferrer"
              >
                {mainnet ? "genadrop-staging.vercel.app" : "genadrop.com"}
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
                    console.log("break them chains", chain);
                    await handleChain(chain.networkId, chain.comingSoon);
                  }}
                  key={idx}
                  className={`${classes.chain} ${chain.comingSoon && classes.comingSoon}`}
                >
                  <img src={chain.icon} alt="" />
                  <div className={classes.name}>
                    <h4>
                      {chain.label} {chain.comingSoon ? <span>Coming soon</span> : ""}
                    </h4>
                    <p className={classes.action}>connect to your {chain.name} wallet</p>
                  </div>
                </div>
              ))}
            <div className={classes.viewBtnContainer}>
              <div className={classes.viewBtn} onClick={() => setShowMoreOptions(!showMoreOptions)}>
                View {showMoreOptions ? "less" : "more"} options
              </div>
            </div>
          </div>
          <div className={`${classes.connectionMethods} ${showConnectionMethods && classes.active}`}>
            {window.ethereum !== undefined && (
              <div
                onClick={handleMetamask}
                className={`${classes.connectionMethod} ${classes.metamask} ${showMetamask && classes.active}`}
              >
                <img src={metamaskIcon} alt="" />
                <h3>MetaMask</h3>
                <p>Connect to you MetaMask Wallet</p>
              </div>
            )}
            <div onClick={handleWalletConnect} className={classes.connectionMethod}>
              <img src={walletConnectIcon} alt="" />
              <h3>WalletConnect</h3>
              <p>Scan with WalletConnect to connect</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;
