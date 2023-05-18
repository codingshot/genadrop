import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import classes from "./NftCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import { GenContext } from "../../../gen-state/gen.context";
import avatar from "../../../assets/avatar.png";

const NftCard = ({ nft, listed, chinPrice, use_width, fromDashboard }) => {
  const { Id, collection_name, name, price, image_url, chain } = nft;
  const match = useRouteMatch();
  const history = useHistory();
  const breakAddress = (address = "", width = 6) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };
  const { priceFeed } = useContext(GenContext);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!chinPrice) {
      setTotalPrice(priceFeed[supportedChains[chain]?.id] * price);
    }
  }, [priceFeed]);

  return (
    <Link
      to={
        fromDashboard && !listed
          ? nft.collection_name
            ? `${match.url}/${Id}`
            : chain
            ? `/marketplace/1of1/preview/${chain}/${Id}`
            : `/marketplace/1of1/preview/${Id}`
          : nft.collection_name
          ? `${match.url}/${Id}`
          : chain
          ? `/marketplace/1of1/${chain}/${Id}`
          : `/marketplace/1of1/${Id}`
      }
    >
      <div style={use_width ? { width: use_width } : {}} className={classes.card}>
        <div className={classes.imageContainer}>
          <img src={image_url} alt="" />
        </div>
        <div className={classes.cardBody}>
          <div className={classes.collectionName}>{collection_name}</div>
          <div className={classes.name}>{name}</div>
          <div className={classes.chainLogo} />
          <div className={classes.creator}>
            <img src={avatar} alt="" />
            {!fromDashboard ? (
              <div className={classes.creatorAddress}>
                <div className={classes.createdBy}>Owned By</div>
                <div className={classes.address}>{breakAddress(nft.owner)}</div>
              </div>
            ) : (
              <div className={classes.createdBy}>Owned by you</div>
            )}
          </div>
          <div className={classes.wrapper}>
            <div className={classes.listPrice}>
              <div className={classes.list}>LIST PRICE</div>
              {price === 0 ? (
                <div className={classes.price}>
                  <img src={supportedChains[chain]?.icon} alt="" />
                </div>
              ) : (
                <div className={classes.price}>
                  <img src={supportedChains[chain]?.icon} alt="" />
                  {parseInt(price).toFixed(2)} <span className={classes.chain}>{supportedChains[chain]?.sybmol}</span>
                  <span className={classes.usdPrice}>
                    ({chinPrice ? (chinPrice * price).toFixed(2) : totalPrice.toFixed(2)} $)
                  </span>
                </div>
              )}
            </div>
            {price === 0 ? (
              fromDashboard ? (
                <button
                  type="button"
                  onClick={() => history.push(`/marketplace/1of1/preview/${chain}/${Id}`)}
                  className={`${classes.button} ${classes.buttonSold}`}
                >
                  List
                </button>
              ) : (
                <button type="button" className={`${classes.notListed} ${classes.buttonSold}`}>
                  Not Listed!
                </button>
              )
            ) : listed ? (
              <button type="button" className={`${classes.button} ${nft.sold ? classes.buttonSold : ""}`}>
                {nft.sold ? "Sold" : "Buy"}
              </button>
            ) : (
              <button type="button" className={`${classes.button} ${nft.sold ? classes.buttonSold : ""}`}>
                {nft.sold ? "List" : "Re-list"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NftCard;
