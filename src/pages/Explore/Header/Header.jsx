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

const Header = ({ collection, getHeight, loadedChain }) => {
  const domMountRef = useRef(false);
  const headerRef = useRef(null);
  const [explorerLink, setExplorerLink] = useState("");
  const [username, setUsername] = useState("");
  const [state, setState] = useState({
    dollarPrice: 0,
  });
  const { dollarPrice } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { name, owner, price, imageUrl, numberOfNfts, description, nfts } = collection;
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
      return setExplorerLink(`${supportedChains[loadedChain]?.explorer}/${owner}`);
    }
    if (collection.mainnet === true) return setExplorerLink(`https://algoexplorer.io/${owner}`);
    if (collection.mainnet === false) return setExplorerLink(`https://testnet.algoexplorer.io/address/${owner}`);
  };

  useEffect(() => {
    if (owner)
      readUserProfile(owner).then(data => {
        if (data)
          setUsername(data.username)
      });

  }, [owner])
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
      <div className={classes.wrapper}>
        {imageUrl ? (
          <img className={classes.imageContainer} src={imageUrl} alt="asset" />
        ) : (
          <div className={classes.imageLoadingContainer}>
            <Skeleton count={1} height={200} />
          </div>
        )}
        <div className={classes.collectionName}>{name}</div>
        <div className={classes.creator}>
          {owner ? (
            <div className={classes.ownerDetails}>
              <div>
                Created by
                <span className={classes.address}>
                  <Copy
                    message={owner}
                    placeholder={
                      username ? username : owner && `${owner.substring(0, 5)}...${owner.substring(owner.length - 4, owner.length)}`
                    }
                  />
                </span>
              </div>
              <a className={classes["link-explorer"]} rel="noopener noreferrer" target="_blank" href={explorerLink}>
                View on block explorer
              </a>
            </div>
          ) : (
            <div className={classes.skeleton}>
              <Skeleton count={1} height={16} />
            </div>
          )}
        </div>
        <div className={classes.description}>
          {description || (
            <div className={classes.skeleton}>
              <Skeleton count={2} height={20} />
            </div>
          )}
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOOR PRICE</div>

            <div className={classes.price}>
              <span style={{ marginRight: 3 }}>{price}</span>
              <span className={classes.chain}>
                {supportedChains[loadedChain]?.sybmol} ({dollarPrice.toFixed(2)} USD)
              </span>
            </div>
          </div>
          <img src={stackIcon} alt="" />
        </div>

        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>TOTAL VOLUME TRADED</div>
            <div className={classes.price}>0</div>
          </div>
          <img src={tradeIcon} alt="" />
        </div>

        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>TOTAL LIST COUNT</div>
            <div className={classes.price}>{numberOfNfts}</div>
          </div>
          <img src={listIcon} alt="" />
        </div>
      </div>
    </header>
  );
};

export default Header;
