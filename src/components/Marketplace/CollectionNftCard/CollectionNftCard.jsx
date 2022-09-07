import classes from "./CollectionNftCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CollectionNftCard = ({ use_width, collection }) => {
  const history = useHistory();
  const [usdValue, setUsdValue] = useState(0);

  const { Id, image_url, name, description, price, chain, nfts } = collection;

  const getFormatedPrice = async () => {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain].id}&vs_currencies=usd`
    );
    const value = Object.values(res?.data)[0]?.usd;
    setUsdValue(value * parseInt(price));
  };

  useEffect(() => {
    getFormatedPrice();
  }, []);

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
              {parseInt(price).toFixed(2)} {supportedChains[chain].symbol}
            </span>{" "}
            <span>{usdValue ? `(${usdValue.toFixed(4)}USD)` : "(0 USD)"}</span>
          </div>
        </div>
        <div className={classes.counts}>{`${nfts && nfts.length} NFTs`}</div>
      </div>
    </div>
  );
};

export default CollectionNftCard;
