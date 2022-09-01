import classes from "./SingleNftCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useHistory, useRouteMatch } from "react-router-dom";

const SingleNftCard = ({ useWidth, nft, fromDashboard }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const [usdValue, setUsdValue] = useState(0);

  const { Id, image_url, name, owner, collection_name, price, chain, sold } = nft;

  const getFormatedPrice = async () => {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain].id}&vs_currencies=usd`
    );
    const value = Object.values(res?.data)[0]?.usd;
    setUsdValue(value * parseInt(price));
  };

  const breakAddress = (address = "", width = 6) => {
    if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  const handlePreview = () => {
    if (!fromDashboard) {
      if (collection_name) {
        history.push(`${match.url}/${Id}`);
      } else if (chain) {
        history.push(`/marketplace/1of1/${chain}/${Id}`);
      } else {
        history.push(`/marketplace/1of1/${Id}`);
      }
    } else {
      if (collection_name) {
        history.push(`${match.url}/${Id}`);
      } else if (chain) {
        history.push(`/marketplace/1of1/preview/${chain}/${Id}`);
      } else {
        history.push(`/marketplace/1of1/preview/${Id}`);
      }
    }
  };

  useEffect(() => {
    getFormatedPrice();
  }, []);

  return (
    <div style={useWidth ? { width: useWidth } : {}} onClick={handlePreview} className={classes.container}>
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          <img className={classes.image} src={image_url} alt="" />
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.nameAndChainWrapper}>
          <div className={classes.tag}>1 of 1</div>
          <img className={classes.chain} src={supportedChains[chain].icon} alt="" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.owner}>{breakAddress(owner)}</div>
      </div>
      <div className={classes.listing}>
        <div className={classes.floorPrice}>
          <div className={classes.priceLabel}>Price</div>
          <div className={classes.amount}>
            <span className={classes.accent}>
              {parseInt(price).toFixed(2)} {supportedChains[chain].symbol}
            </span>
            <span>{usdValue ? `(${usdValue.toFixed(4)}USD)` : "(0 USD)"}</span>
          </div>
        </div>
        {!sold ? (
          <div className={classes.btn}>Buy</div>
        ) : (
          <div className={`${classes.btn} ${classes.disable}`}>Sold</div>
        )}
      </div>
    </div>
  );
};

export default SingleNftCard;
