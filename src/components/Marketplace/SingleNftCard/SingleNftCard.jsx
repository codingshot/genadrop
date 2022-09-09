import classes from "./SingleNftCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getFormatedPrice } from "../../../utils";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";

const SingleNftCard = ({ use_width, nft, fromDashboard, fromDetails, collectionNft }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const [usdValue, setUsdValue] = useState(0);
  const { account } = useContext(GenContext);

  const { Id, image_url, name, owner, collection_name, price, chain, sold, isListed } = nft;

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    setUsdValue(Number(value) * Number(price));
  };

  const breakAddress = (address = "", width = 6) => {
    if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  const handlePreview = () => {
    if (!fromDashboard) {
      if (collection_name) {
        if (fromDetails) {
          history.push(`${match.url.split("/").slice(0, -1).join("/")}/${Id}`);
        } else {
          history.push(`${match.url}/${Id}`);
        }
      } else if (chain) {
        history.push(`/marketplace/1of1/${chain}/${Id}`);
      } else {
        history.push(`/marketplace/1of1/${Id}`);
      }
    } else {
      if (collection_name) {
        if (fromDetails) {
          history.push(`${match.url.split("/").slice(0, -1).join("/")}/${Id}`);
        } else {
          history.push(`${match.url}/${Id}`);
        }
      } else if (chain) {
        history.push(`/marketplace/1of1/preview/${chain}/${Id}`);
      } else {
        history.push(`/marketplace/1of1/preview/${Id}`);
      }
    }
  };

  useEffect(() => {
    getUsdValue();
  }, []);

  return (
    <div style={use_width ? { width: use_width } : {}} onClick={handlePreview} className={classes.container}>
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          <img className={classes.image} src={image_url} alt="" />
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.nameAndChainWrapper}>
          {collectionNft ? (
            <div className={classes._name}>{collectionNft.name}</div>
          ) : (
            <div className={classes.tag}>1 of 1</div>
          )}
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
              {Number(price).toFixed(4)} {supportedChains[chain].symbol}
            </span>
            <span>{`(${usdValue.toFixed(4)}USD)`}</span>
          </div>
        </div>
        {!price ? (
          owner === account ? (
            <div className={classes.btn}>List</div>
          ) : (
            <div className={`${classes.btn} ${classes.disable}`}>Not Listed</div>
          )
        ) : !sold || isListed ? (
          supportedChains[chain]?.chain === "Algorand" ? (
            <div className={classes.btn}>Buy</div>
          ) : (
            <div className={classes.btn}>Buy</div>
          )
        ) : (
          <div className={`${classes.btn} ${classes.disable}`}>Sold</div>
        )}
      </div>
    </div>
  );
};

export default SingleNftCard;
