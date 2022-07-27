import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import classes from "./nft.module.css";
import algoIcon from "../../../assets/icon-algo.svg";
import supportedChains from "../../../utils/supportedChains";

const NFT = (data) => {
  const match = useRouteMatch();

  return data.data.map((nft, idx) => {
    let chainName = "Algo";
    if (nft?.chain) {
      chainName = supportedChains[nft?.chain].sybmol;
    }
    return (
      <Link key={idx} to={`${match.url.split("/").slice(0, -1).join("/")}/${nft.Id}`}>
        <div key={nft.Id} className={classes.collectionItem}>
          <img src={nft.image_url} alt="" />
          <span className={classes.collectionName}>{nft.collection_name}</span>
          <span className={classes.itemName}>{nft.name}</span>
          <div className={classes.pricing}>
            <img src={nft?.chain ? supportedChains[nft?.chain].icon : algoIcon} alt="" />
            {nft.price === 0 ? (
              <div className={classes.itemPrice}>
                <button type="button" className={classes.sold}>
                  Not Listed!
                </button>
              </div>
            ) : (
              <div className={classes.itemPrice}>
                <div className={classes.section}>
                  <div className={classes.heading}>LIST PRICE</div>
                  <div className={classes.price}>
                    {nft.price} <span>{chainName}</span>
                  </div>
                </div>
                {nft.sold ? (
                  <button type="button" className={classes.sold}>
                    Sold
                  </button>
                ) : (
                  <button type="button" className={classes.buy}>
                    Buy
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  });
};

export default NFT;
