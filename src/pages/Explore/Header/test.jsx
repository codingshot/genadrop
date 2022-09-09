import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import classes from "./Header.module.css";
import listIcon from "../../../assets/icon-list.svg";
import stackIcon from "../../../assets/icon-stack.svg";
import tradeIcon from "../../../assets/icon-trade.svg";
import Copy from "../../../components/copy/copy";
import supportedChains from "../../../utils/supportedChains";
import { readUserProfile } from "../../../utils/firebase";

import twitter from "../../../assets/icon-twitter-blue.svg";
import discord from "../../../assets/icon-discord-blue.svg";
import instagram from "../../../assets/icon-instagram-blue.svg";
import youtube from "../../../assets/icon-youtube-green.svg";
import { breakAddress } from "../../../components/wallet/wallet-script";

const Header = ({ collection, getHeight, loadedChain }) => {
  const domMountRef = useRef(false);
  const headerRef = useRef(null);
  const [state, setState] = useState({
    dollarPrice: 0,
    ownerDetails: null,
    username: "",
    explorerLink: "",
  });
  const { dollarPrice, ownerDetails, username, explorerLink } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { name, owner, price, imageUrl, numberOfNfts, description, chain, nfts } = collection;
  const getUsdValue = () => {
    if (loadedChain) {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[loadedChain].id}&vs_currencies=usd`)
        .then((res) => {
          const value = Object.values(res.data)[0].usd;
          handleSetState({ dollarPrice: value * price });
        });
    }
  };
  const viewOnExplorer = () => {
    if (loadedChain && loadedChain !== 4160) {
      return handleSetState({ explorerLink: `${supportedChains[loadedChain]?.explorer}/${owner}` });
    }
    if (process.env.REACT_APP_ENV_STAGING === "false") {
      return handleSetState({ explorerLink: `https://algoexplorer.io/address/${owner}` });
    }
    return handleSetState({ explorerLink: `https://testnet.algoexplorer.io/address/${owner}` });
  };

  useEffect(() => {
    if (owner)
      readUserProfile(owner).then((data) => {
        if (data) handleSetState({ ownerDetails: data });
      });
  }, [owner]);

  useEffect(() => {
    getUsdValue();
    viewOnExplorer();
  }, [price, loadedChain]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (domMountRef.current) {
        const res = headerRef.current?.getBoundingClientRect().height;
        getHeight(res);
      } else {
        domMountRef.current = true;
      }
    });
    getHeight(500);
  }, []);

  return (
    <header ref={headerRef} className={classes.container}>
      <div className={classes.banner}>
        <div className={classes.wrapper}>
          {imageUrl ? (
            <img
              className={classes.imageContainer}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = imageUrl;
              }}
              src={imageUrl}
              alt="asset"
            />
          ) : (
            <div className={classes.imageLoadingContainer}>
              <Skeleton count={1} height={200} />
            </div>
          )}
          <div className={classes.collectionDetails}>
            <div className={classes.sup}>
              <div className={classes.left}>
                {name} <img src={supportedChains[chain]?.icon} alt="" />
              </div>
              <div className={classes.right}>
                {ownerDetails?.twitter ? (
                  <a href={`https://twitter.com/${ownerDetails.twitter}`} target="_blank" rel="noreferrer">
                    {" "}
                    <img src={twitter} alt="" className={classes.socialIcon} />{" "}
                  </a>
                ) : (
                  ""
                )}
                {ownerDetails?.youtube ? (
                  <a href={`https://youtube.com/${ownerDetails.youtube}`} target="_blank" rel="noreferrer">
                    {" "}
                    <img src={youtube} alt="" className={classes.socialIcon} />{" "}
                  </a>
                ) : (
                  ""
                )}
                {ownerDetails?.instagram ? (
                  <a href={`https://www.instagram.com/${ownerDetails.instagram}`} target="_blank" rel="noreferrer">
                    {" "}
                    <img src={instagram} alt="" className={classes.socialIcon} />{" "}
                  </a>
                ) : (
                  ""
                )}
                {ownerDetails?.discord ? <img src={discord} alt="" className={classes.socialIcon} /> : ""}
              </div>
            </div>
            <div className={classes.sub}>
              <span className={classes.label}>Created By</span>
              <span className={classes.address}>
                {ownerDetails?.username ? ownerDetails?.username : breakAddress(owner)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.details}>
          <div className={classes.detailContentWrapper}>
            <img src={stackIcon} alt="" />
            <div className={classes.floorPrice}>
              <div className={classes.floor}>FLOOR PRICE</div>
              <div className={classes.price}>
                <span style={{ marginRight: 3 }}>{price}</span>
                <span className={classes.chain}>
                  {supportedChains[loadedChain]?.sybmol} ({dollarPrice.toFixed(2)} USD)
                </span>
              </div>
            </div>
          </div>

          <div className={classes.detailContentWrapper}>
            <img src={tradeIcon} alt="" />
            <div className={classes.floorPrice}>
              <div className={classes.floor}>TOTAL VOLUME TRADED</div>
              <div className={classes.price}>0</div>
            </div>
          </div>

          <div className={classes.detailContentWrapper}>
            <img src={listIcon} alt="" />
            <div className={classes.floorPrice}>
              <div className={classes.floor}>TOTAL NFT COUNT</div>
              <div className={classes.price}>{numberOfNfts}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.description}>{description}</div>
      </div>
    </header>
  );
};

export default Header;
