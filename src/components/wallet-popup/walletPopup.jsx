import React, { useContext, useState } from "react";
import classes from "./walletPopup.module.css";
import closeIcon from "../../assets/icon-close.svg";
import { GenContext } from "../../gen-state/gen.context";
import { setProposedChain, setNotification } from "../../gen-state/gen.actions";
import { supportedChains } from "../../utils/supportedChains";

const WalletPopup = ({ setTogglePopup }) => {
  const { dispatch } = useContext(GenContext);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  function getNetworkID() {
    return new Promise(async (resolve) => {
      const networkId = await window.ethereum.networkVersion;
      resolve(Number(networkId));
    });
  }

  const handleChain = (chainId) => {
    (async function run() {
      const networkId = await getNetworkID();
      if (networkId === chainId) {
        dispatch(setProposedChain(null));
      } else {
        dispatch(setProposedChain(chainId));
      }
      setTogglePopup(false);
    })();
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.iconContainer}>
          <img
            onClick={() => {
              setTogglePopup(false);
              setShowMoreOptions(false);
            }}
            src={closeIcon}
            alt=""
          />
        </div>
        <div className={classes.heading}>
          <h3>Link Wallets</h3>
          <p>Choose the blockchain of the wallet that you want to add to your Multi-wallet profile</p>
        </div>

        <div className={classes.chains}>
          {Object.values(supportedChains)
            .filter((chain) => showMoreOptions || [137, 42220, 1313161554, 4160].includes(chain.networkId))
            .map((chain, idx) => (
              <div onClick={() => handleChain(chain.networkId)} key={idx} className={classes.chain}>
                <img src={chain.icon} alt="" />
                <div className={classes.name}>
                  <h4>{chain.label}</h4>
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
      </div>
    </div>
  );
};

export default WalletPopup;
