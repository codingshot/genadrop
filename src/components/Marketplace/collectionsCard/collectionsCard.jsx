import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./collectionsCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import { GenContext } from "../../../gen-state/gen.context";

const CollectionsCard = ({ collection, use_width, fromDashboard }) => {
  const { name, price, description, image_url, chain, Id, nfts } = collection;
  const history = useHistory();

  const [totalPrice, setTotalPrice] = useState(0);
  const { priceFeed } = useContext(GenContext);

  useEffect(() => {
    setTotalPrice(price * priceFeed[supportedChains[chain]?.id]);
  }, [priceFeed]);
  return (
    <div
      style={use_width ? { width: use_width } : {}}
      onClick={() => history.push(`/marketplace/collections/${chain !== 4160 ? Id : name}`)}
      className={classes.card}
    >
      <div style={{ backgroundImage: `url(${image_url})` }} className={classes.imageContainer} />

      <div className={classes.body}>
        <div className={classes.thumbnail}>
          <img src={image_url} alt="collection-profile-img" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.description}>{description}</div>
        <div className={classes.wrapper}>
          {price === "0" && !fromDashboard ? (
            <div className={classes.notListedWrap}>
              <img className={classes.priceImg} src={supportedChains[chain]?.icon} alt="" />
              <div className={classes.notListed}>
                <span>Not Listed</span>
              </div>
            </div>
          ) : (
            <div className={classes.floorPrice}>
              <div className={classes.floor}>FLOORPRICE</div>
              <div className={classes.price}>
                <img src={supportedChains[chain]?.icon} alt="" />
                {price ?? 0} <span className={classes.chain}>{supportedChains[chain]?.sybmol}</span>{" "}
                <div>
                  <span className={classes.usdPrice}>({totalPrice.toFixed(2) ?? 0} $)</span>
                </div>
              </div>
            </div>
          )}
          <div className={classes.nftCount}>{nfts?.length} NFTs</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsCard;
