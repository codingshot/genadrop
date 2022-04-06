import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import classes from "./nft.module.css";

const NFT = (data) => {
  const match = useRouteMatch();

  return data.data.map((nft, idx) => (
    <Link to={`${match.url.split("/").slice(0, -1).join("/")}/${nft.Id}`}>
      <div key={idx} className={classes.collectionItem}>
        <img src={nft.image_url} alt="" />
        <span className={classes.collectionName}>{nft.collection_name}</span>
        <span className={classes.itemName}>{nft.name}</span>
        <div className={classes.pricing}>
          <img src="/assets/algo-logo.png" alt="" />
          <div className={classes.itemPrice}>
            <div className={classes.section}>
              <div className={classes.heading}>LIST PRICE</div>
              <div className={classes.price}>
                {nft.price} <span>ALGO</span>
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
        </div>
      </div>
    </Link>
  ));
};

export default NFT;
