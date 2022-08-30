import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./collectionsCard.module.css";
import supportedChains from "../../../utils/supportedChains";

const CollectionsCard = ({ collection, useWidth, fromDashboard }) => {
  const { name, price, description, image_url, chain, Id, nfts } = collection;
  const history = useHistory();

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain]?.id}&vs_currencies=usd`)
      .then((res) => {
        const value = Object.values(res?.data)[0]?.usd;
        setTotalPrice(value * price);
      });
  }, []);
  return (
    <div
      style={useWidth ? { width: useWidth } : {}}
      onClick={() => history.push(`/marketplace/collections/${chain !== 4160 ? Id : name}`)}
      className={classes.card}
    >
      <div className={classes.imageContainer}>
        <img
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = image_url;
          }}
          src={image_url}
          alt=""
        />
      </div>
      <div className={classes.cardBody}>
        <div className={classes.collectionName}>
          <div className={classes.name}>{/* <div className={classes.collection}>category</div> */}</div>
          <div>
            <img className={classes.chainIcon} src={supportedChains[chain]?.icon} alt="" />
          </div>
        </div>
        <div className={classes.description}>{description}</div>

        <div className={classes.wrapper}>
          <div className={classes.listPrice}>
            <div className={classes.list}>FLOOR PRICE</div>
            {price === 0 ? (
              <div className={classes.price}>
                <img className={classes.chainIcon} src={supportedChains[chain]?.icon} alt="" />
              </div>
            ) : (
              <div className={classes.price}>
                {parseInt(price).toFixed(2)} <span className={classes.chain}>{supportedChains[chain]?.sybmol}</span>
                <span className={classes.usdPrice}>({totalPrice.toFixed(2)} USD)</span>
              </div>
            )}
          </div>
          <div className={classes.nftCount}>{nfts?.length} NFTs</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsCard;
