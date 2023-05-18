/* eslint-disable react/no-array-index-key */
import { Link } from "react-router-dom";
import React from "react";
import classes from "./walletPopup.module.css";

// icons
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import metamaskIcon from "../../assets/icon-metamask.svg";
import walletConnectIcon from "../../assets/icon-wallet-connect.svg";
import walletLockIcon from "../../assets/lock.svg";
import moreIcons from "../../assets/moreDots.svg";
import exportIcon from "../../assets/icon-link-white.svg";

const DesktopPopup = ({
  showConnectionMethods,
  mainnet,
  connectOptions,
  showMoreOptions,
  handleChain,
  setShowMoreOptions,
  dispatch,
  setConnectionMethods,
  setToggleWalletPopup,
  handleMetamask,
  handleWalletConnect,
  showMetamask,
}) => {
  return (
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
              <div className={classes.viewBtnImage}>
                <img src={moreIcons} alt="" />
              </div>
              <div className={classes.viewBtn}>{showMoreOptions ? "Less" : "More"}</div>
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
          <h1 className={classes.lockHeader}>Haven&apos;t got a wallet yet?</h1>
          <div>
            <img className={classes.lockImage} src={walletLockIcon} alt="" />
          </div>
          <div>
            <Link to={{ pathname: "https://docs.genadrop.io" }} target="_blank">
              <button className={classes.learnButton} type="button">
                <h1>Learn How to Connect</h1>
                <img src={exportIcon} alt="" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPopup;
