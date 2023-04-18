import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import supportedChains from "../../../utils/supportedChains";
import classes from "./CollectionNftCard.module.css";
// import { getFormatedPrice } from "../../../utils";

const formattedNumber = (number, decimals = 2) => {
  const input = number?.toFixed(decimals);
  return parseFloat(input);
};

const CollectionNftCard = ({ use_width, collection }) => {
  const history = useHistory();
  const [usdValue, setUsdValue] = useState(0);

  const { Id, image_url, name, description, price, chain, nfts } = collection;

  const getUsdValue = useCallback(async () => {
    const chainName = supportedChains[chain].coinGeckoLabel || supportedChains[chain].id;
    const value = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${chainName}&vs_currencies=usd`);

    setUsdValue(Number(value) * Number(price));
  }, []);

  useEffect(() => {
    getUsdValue();
  }, [getUsdValue]);

  return (
    <div
      style={use_width ? { width: use_width } : {}}
      onClick={() => history.push(`/marketplace/collections/${chain !== 4160 ? `${chain}~${Id}` : name}`)}
      className={classes.container}
    >
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          <img className={classes.image} src={image_url} alt="" />
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.nameAndChainWrapper}>
          <div className={classes.name}>{name}</div>
          <img className={classes.chain} src={supportedChains[chain].icon} alt="" />
        </div>
        <div className={classes.description}>{description}</div>
      </div>
      <div className={classes.listing}>
        <div className={classes.floorPrice}>
          <div className={classes.priceLabel}>Floor Price</div>
          <div className={classes.amount}>
            <span className={classes.accent}>
              {formattedNumber(Number(price), 4)} {supportedChains[chain].symbol}
            </span>{" "}
            <span>{`($${formattedNumber(usdValue, 4)})`}</span>
          </div>
        </div>
        <div className={classes.counts}>{`${nfts ? nfts.length : 0} NFTs`}</div>
      </div>
    </div>
  );
};

export default CollectionNftCard;
