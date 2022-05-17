import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./collectionsCard.module.css";
import algoIcon from "../../../assets/icon-algo.svg";
import { supportedChains } from "../../../utils/supportedChains.js";

const CollectionsCard = ({ collection }) => {
  const { name, price, description, image_url, chain } = collection;
  const history = useHistory();

  const [state, setState] = useState({ algoPrice: 0, chainIcon: "", chainName: "Algo" });
  const { algoPrice, chainIcon, chainName } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    if (supportedChains[chain]) {
      axios.get("https://api.coingecko.com/api/v3/simple/price?ids=aurora-near&vs_currencies=usd").then((res) => {
        let value = Object.values(res.data)[0].usd;
        handleSetState({
          algoPrice: value * price,
          chainName: supportedChains[chain].sybmol,
          chainIcon: supportedChains[chain].icon,
        });
      });
    } else {
      axios.get("https://api.coinbase.com/v2/prices/ALGO-USD/spot").then((res) => {
        handleSetState({ algoPrice: res.data.data.amount * price, chainIcon: algoIcon, chainName: "Algo" });
      });
    }
  }, []);

  return (
    <div onClick={() => history.push(`/marketplace/collections/${name}`)} className={classes.card}>
      <div style={{ backgroundImage: `url(${image_url})` }} className={classes.imageContainer} />

      <div className={classes.body}>
        <div className={classes.thumbnail}>
          <img src={image_url} alt="" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.description}>
          {description.length < 100 ? description : `${description.substring(0, 100)}...`}
        </div>
        <div className={classes.wrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOORPRICE</div>
            <div className={classes.price}>
              <img src={chainIcon} alt="" />
              {price} <span className={classes.chain}>{chainName}</span>{" "}
              <span className={classes.usdPrice}>({algoPrice.toFixed(2)} USD)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NearCollectionCard = ({ collection }) => {
  const { name, price, description, image_url, owner } = collection;
  const history = useHistory();

  const [state, setState] = useState({ algoPrice: 0 });
  const { algoPrice } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    axios.get("https://api.coingecko.com/api/v3/simple/price?ids=aurora-near&vs_currencies=usd").then((res) => {
      let value = Object.values(res.data)[0].usd;
      handleSetState({ algoPrice: price * value });
    });
  }, []);

  return (
    <div onClick={() => history.push(`/marketplace/collections/${owner}`)} className={classes.card}>
      <div style={{ backgroundImage: `url(${image_url})` }} className={classes.imageContainer} />

      <div className={classes.body}>
        <div className={classes.thumbnail}>
          <img src={image_url} alt="" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.description}>
          {description.length < 100 ? description : `${description.substring(0, 100)}...`}
        </div>
        <div className={classes.wrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOORPRICE</div>
            <div className={classes.price}>
              <img src={supportedChains[1313161554].icon} alt="" />
              {price} <span className={classes.chain}>AOA</span>{" "}
              <span className={classes.usdPrice}>({algoPrice.toFixed(2)} USD)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsCard;
