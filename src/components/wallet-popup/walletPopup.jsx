import React, { useContext, useEffect, useState } from "react";
import classes from "./walletPopup.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import metamaskIcon from "../../assets/icon-metamask.svg";
import walletConnectIcon from "../../assets/icon-wallet-connect.svg";
import { GenContext } from "../../gen-state/gen.context";
import { setProposedChain, setToggleWalletPopup } from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";

const WalletPopup = ({ handleSetState }) => {
  const { dispatch, mainnet, connectFromMint } = useContext(GenContext);
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

  const handleChain = (chainId, isComingSoon = undefined) => {
    if (isComingSoon) return;
    if (chainId === 4160) {
      setMetamask(false);
    } else {
      setMetamask(true);
    }
    setActiveChain(chainId);
    setConnectionMethods(true);
  };

  const handleProposedChain = async () => {
    dispatch(setProposedChain(activeChain));
    dispatch(setToggleWalletPopup(false));
    setConnectionMethods(false);
  };

  const handleMetamask = async () => {
    handleSetState({ connectionMethod: "metamask" });
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
              .filter((_, idx) => showMoreOptions || idx <= 3)
              .map((chain, idx) => (
                <div
                  onClick={() => handleChain(chain.networkId, chain.comingSoon)}
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
