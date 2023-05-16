/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import classes from "./Deals.module.css";
import supportedChains from "../../../utils/supportedChains";
import { buyGraphNft, buyNft, getFormatedPrice } from "../../../utils";
import openseaIcon from "../../../assets/icon-opensea.svg";
import lockIcon from "../../../assets/lock-white.svg";

import { GenContext } from "../../../gen-state/gen.context";

const Deals = ({ nftDetails }) => {
  const {
    price,
    chain,
    sold,
    isListed,
    owner,
    account,
    chainId,
    mainnet,
    connector,
    dispatch,
    Id,
    collection_name,
    isSoulBound,
  } = nftDetails;
  const history = useHistory();
  const [usdValue, setUsdValue] = useState(0);
  const buyProps = {
    dispatch,
    account,
    connector,
    mainnet,
    nftDetails,
    history,
    chainId,
  };
  const { priceFeed } = useContext(GenContext);
  // const getUsdValue = async () => {
  //   if (priceFeed !== null) {
  //     const value = priceFeed[supportedChains[chain].coinGeckoLabel || supportedChains[chain].id];
  //     setUsdValue(Number(value) * Number(price));
  //   }
  // };

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);

    setUsdValue(Number(value) * Number(price));
  };

  useEffect(() => {
    getUsdValue();
  }, [priceFeed]);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>CURRENT PRICE</div>
        <div className={classes.priceSection}>
          <img className={classes.chainIcon} src={supportedChains[chain].icon} alt="" />
          <div className={classes.price}>{`${price ? Number(price).toFixed(4) : "0.0"}`}</div>
          <div className={classes.appx}>{`($${price ? usdValue.toFixed(4) : "0"})`}</div>
        </div>
      </div>
      {isSoulBound ? (
        <div className={classes.lock}>
          <img src={lockIcon} alt="" />
          <span>Non Transferable</span>
        </div>
      ) : supportedChains[chain]?.chain === "Near" && isListed ? (
        <>
          <div className={`${classes.btn} ${classes.disable}`} disabled>
            Listed
          </div>
        </>
      ) : !isListed && !price ? (
        owner === account && supportedChains[chain]?.networkId !== 1111 ? (
          <Link to={chain ? `/marketplace/1of1/list/${chain}/${Id}` : `/marketplace/1of1/list/${Id}`}>
            {isListed ? (
              <button className={`${classes.btn} ${classes.disable}`} disabled>
                Re-List
              </button>
            ) : (
              <button className={classes.btn}>List</button>
            )}
          </Link>
        ) : (
          <div className={`${classes.btn} ${classes.disable}`} disabled>
            Not Listed
          </div>
        )
      ) : owner === account && isListed ? (
        <div className={`${classes.btn} ${classes.disable}`} disabled>
          Listed
        </div>
      ) : !sold && isListed ? (
        supportedChains[chain]?.chain === "Algorand" ? (
          <div onClick={() => buyNft(buyProps)} className={classes.btn}>
            Buy
          </div>
        ) : (
          <div onClick={() => buyGraphNft(buyProps)} className={classes.btn}>
            Buy
          </div>
        )
      ) : account === owner ? (
        <Link to={chain ? `/marketplace/1of1/list/${chain}/${Id}` : `/marketplace/1of1/list/${Id}`}>
          <div className={`${classes.btn}`}>List</div>
        </Link>
      ) : price && !isListed ? (
        <div className={`${classes.btn} ${classes.disable}`} disabled>
          Sold
        </div>
      ) : isListed ? (
        <div onClick={() => buyGraphNft(buyProps)} className={`${classes.btn} `}>
          Buy
        </div>
      ) : (
        <div className={`${classes.btn} ${classes.disable}`} disabled>
          Not Listed
        </div>
      )}
      <div className={classes.sea}>
        {supportedChains[chain]?.label === "Polygon" ? (
          <a
            href={`https://opensea.io/assets/matic/${
              collection_name === "Genadrop 1 of 1"
                ? "0x436AEceaEeC57b38a17Ebe71154832fB0fAFF878"
                : "0x3243cd574e9d51ad012c7fa4957e8037beb8792f"
            }/${nftDetails.tokenID}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.opensea}>
              <img src={openseaIcon} alt="" /> View Listing on Opensea
            </div>
          </a>
        ) : supportedChains[chain]?.label === "Polygon Testnet" ? (
          <a
            href={`https://testnets.opensea.io/assets/mumbai/${
              collection_name === "Genadrop 1 of 1"
                ? "0x5d05fe74a923b0e2e50ef08e434ac8fa6c76fe71"
                : "0x2b90d1ceb58d6848c07e7e1ef474bf3641efa539"
            }/${nftDetails.tokenID}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.opensea}>
              <img src={openseaIcon} alt="" /> View Listing on Opensea
            </div>
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Deals;
