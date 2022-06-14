import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useRouteMatch } from "react-router-dom";
import classes from "./SingleNFTCard.module.css";
import supportedChains from "../../utils/supportedChains";

const SingleNFTCard = ({ nft, list, chinPrice }) => {
  const { Id, collection_name, name, price, image_url, chain } = nft;
  const match = useRouteMatch();

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!chinPrice) {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain].id}&vs_currencies=usd`)
        .then((res) => {
          const value = Object.values(res.data)[0].usd;
          setTotalPrice(value * price);
        });
    }
  }, []);
  return (
    <Link
      to={
        nft.collection_name
          ? `${match.url}/${Id}`
          : chain
          ? `/marketplace/single-mint/${chain}/${Id}`
          : `/marketplace/single-mint/${Id}`
      }
    >
      <div className={classes.card}>
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
          <div className={classes.collectionName}>{collection_name}</div>
          <div className={classes.name}>{name}</div>
          <div className={classes.chainLogo} />
          <div className={classes.wrapper}>
            <div className={classes.listPrice}>
              <div className={classes.list}>LISTPRICE</div>
              <div className={classes.price}>
                <img src={supportedChains[chain].icon} alt="" />
                {price} <span className={classes.chain}>{supportedChains[chain].sybmol}</span>
                <span className={classes.usdPrice}>
                  ({chinPrice ? (chinPrice * price).toFixed(2) : totalPrice.toFixed(2)} USD)
                </span>
              </div>
            </div>
            {list ? (
              ""
            ) : (
              <button type="button" className={`${classes.button} ${nft.sold ? classes.buttonSold : ""}`}>
                {nft.sold ? "SOLD!" : "Buy"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleNFTCard;
