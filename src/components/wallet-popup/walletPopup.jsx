/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

// near wallets
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupNightly } from "@near-wallet-selector/nightly";

// near wallet styles & icons
import "@near-wallet-selector/modal-ui/styles.css";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
import MeteorIconUrl from "@near-wallet-selector/meteor-wallet/assets/meteor-icon.png";
import HereWalletIconUrl from "@near-wallet-selector/here-wallet/assets/here-wallet-icon.png";
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

import DesktopPopup from "./desktopPopup";
import MobilePopup from "./mobilePopup";

// unused for now

const WalletPopup = ({ handleSetState }) => {
  const { dispatch, mainnet, connectFromMint } = useContext(GenContext);
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

  // const handleMagicLink = async () => {
  //   handleSetState({ connectionMethod: "magicLink" });
  //   handleProposedChain();
  // };
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
      <div className={classes.desktopView}>
        <DesktopPopup
          showConnectionMethods={showConnectionMethods}
          mainnet={mainnet}
          connectOptions={connectOptions}
          showMoreOptions={showMoreOptions}
          handleChain={handleChain}
          setShowMoreOptions={setShowMoreOptions}
          dispatch={dispatch}
          setConnectionMethods={setConnectionMethods}
          handleMetamask={handleMetamask}
          handleWalletConnect={handleWalletConnect}
          showMetamask={showMetamask}
          setToggleWalletPopup={setToggleWalletPopup}
        />
      </div>
      <div className={classes.mobileView}>
        <MobilePopup
          showConnectionMethods={showConnectionMethods}
          mainnet={mainnet}
          connectOptions={connectOptions}
          showMoreOptions={showMoreOptions}
          handleChain={handleChain}
          setShowMoreOptions={setShowMoreOptions}
          dispatch={dispatch}
          setConnectionMethods={setConnectionMethods}
          handleMetamask={handleMetamask}
          handleWalletConnect={handleWalletConnect}
          showMetamask={showMetamask}
          setToggleWalletPopup={setToggleWalletPopup}
        />
      </div>
    </div>
  );
};

export default WalletPopup;
