import React, { useContext, useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import classes from "./mint.module.css";
import mintBg from "../../assets/mint-bg1.svg";
import collectionIcon from "../../assets/icon-collection.svg";
import _1of1Icon from "../../assets/icon-1of1.svg";
import shieldIcon from "../../assets/icon-shield-check.svg";
import { initConnectWallet } from "../../components/Wallet/wallet-script";
import { GenContext } from "../../gen-state/gen.context";

const Mint = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { dispatch, chainId } = useContext(GenContext);

  useEffect(() => {
    if (window.localStorage.walletconnect || chainId) return;
    initConnectWallet({ dispatch });
  }, []);

  const handleMint = (target) => {
    if (window.localStorage.walletconnect || chainId) {
      history.push(`${url}/${target}`);
    } else {
      initConnectWallet({ dispatch });
    }
  };

  return (
    <div style={{ backgroundImage: `url(${mintBg})` }} className={classes.container}>
      <header className={classes.headingWrapper}>
        <h1 className={classes.heading}>Mint Your NFTs</h1>
        <p className={classes.description}>
          With Genadrop simplified minting, you can mint your NFts as fast as your fingers can go. <br />
          Simply choose your mint type, either a <span>Collection mint</span> or <span>1 of 1 mint</span>, and upload a
          file to <br />
          mint to any of our supported blockchains!
        </p>
        <div className={classes.disclaimer}>
          <img src={shieldIcon} alt="" />{" "}
          <p>We do not own your private keys and cannot access your funds without your confirmation</p>
        </div>
      </header>

      <main className={classes.mainWrapper}>
        <div className={`${classes.card} ${classes.collection}`}>
          <div className={classes.imageContainer}>
            <img src={collectionIcon} alt="" />
          </div>
          <h3 className={classes.title}> Mint a collection</h3>
          <p className={classes.description}>
            {" "}
            Mint your collection downloaded from Genadrop Creat app. These are collections of NFTs with mix and match
            traits in a Zip file.{" "}
          </p>
          <button onClick={() => handleMint("collection")} className={classes.btn}>
            Mint collection
          </button>
        </div>

        <div className={`${classes.card} ${classes._1of1}`}>
          <div className={classes.imageContainer}>
            <img src={_1of1Icon} alt="" />
          </div>
          <h3 className={classes.title}> Mint 1 of 1 </h3>
          <p className={classes.description}>
            {" "}
            1 of 1 is a unique NFT you are minting individually. This is usually a single image in the format of Png{" "}
          </p>
          <button onClick={() => handleMint("1of1")} type="button" className={classes.btn}>
            Mint 1 of 1
          </button>
        </div>
      </main>
    </div>
  );
};

export default Mint;
