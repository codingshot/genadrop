/* eslint-disable react/no-array-index-key */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./mobilePopup.module.css";

// icons
import metamaskIcon from "../../assets/icon-metamask.svg";
import walletConnectIcon from "../../assets/icon-wallet-connect.svg";
import moreIcons from "../../assets/moreDots.svg";
import exportIcon from "../../assets/icon-link-white.svg";

const MobilePopup = ({
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
  const handleCloseMobileModal = () => {
    dispatch(setToggleWalletPopup(false));
    setShowMoreOptions(false);
    setConnectionMethods(false);
  };
  const handleClickOutside = (event) => {
    const card = document.getElementById("wallet-mobile");

    if (card && !card.contains(event.target) && card?.clientWidth > 0) handleCloseMobileModal();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes.mobileRoot} id="wallet-mobile">
        <div className={classes.mobileMain}>
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
            <div
              className={`${classes.chains} ${showConnectionMethods && classes.active} ${
                showMoreOptions && classes.showMore
              }`}
            >
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
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <h1>Haven&apos;t got a wallet yet?</h1>
          <Link to={{ pathname: "https://docs.genadrop.io" }} target="_blank">
            <button className={classes.learnButton} type="button">
              <h1>Learn How to Connect</h1>
              <img src={exportIcon} alt="" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobilePopup;
