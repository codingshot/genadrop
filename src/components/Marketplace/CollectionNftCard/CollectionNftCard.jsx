import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import supportedChains from "../../../utils/supportedChains";
import classes from "./CollectionNftCard.module.css";
import { getFormatedPrice } from "../../../utils";

const CollectionNftCard = ({ use_width, collection }) => {
  const history = useHistory();
  const [usdValue, setUsdValue] = useState(0);

  const { Id, image_url, name, description, price, chain, nfts } = collection;

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    setUsdValue(Number(value) * Number(price));
  };

  useEffect(() => {
    getUsdValue();
  }, [collection]);

  return (
    <div
      style={use_width ? { width: use_width } : {}}
      onClick={() => history.push(`/marketplace/collections/${chain !== 4160 ? Id : name}`)}
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
              {Number(price).toFixed(4)} {supportedChains[chain].symbol}
            </span>{" "}
            <span>{`(${usdValue.toFixed(4)}USD)`}</span>
          </div>
        </div>
        <div className={classes.counts}>{`${nfts ? nfts.length : 0} NFTs`}</div>
      </div>
    </div>
  );
};

export default CollectionNftCard;
