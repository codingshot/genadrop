import React, { useState, useEffect, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getFormatedPrice } from "../../../utils";
import supportedChains from "../../../utils/supportedChains";
import classes from "./SingleNftCard.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import {
  // marketplace differnt card footer
  MarketplaceView,
  // dashboard differnt card footer
  OnSalveView,
  CollectedView,
} from "./CardFooter";
import thumbnail from "../../../assets/music-thumbnail.svg";

const SingleNftCard = ({ use_width, nft, fromDashboard, fromDetails, collectionNft, userId, usdPrice }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const [usdValue, setUsdValue] = useState(0);
  const { account } = useContext(GenContext);
  const { Id, image_url, name, owner, collection_name, price, chain, sold, isListed } = nft;
  const getUsdValue = async () => {
    let value = usdPrice;
    if (!value) {
      value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    }
    setUsdValue(Number(value) * Number(price));
  };

  const breakAddress = (address = "", width = 6) => {
    if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
    return address;
  };

  const handlePreview = () => {
    if (userId !== account) {
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
    } else if (collection_name) {
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
  };

  useEffect(() => {
    getUsdValue();
  }, [nft]);

  const footerPrpops = {
    price,
    chain,
    account,
    owner,
    sold,
    isListed,
    usdValue,
    userId,
  };

  return (
    <div style={use_width ? { width: use_width } : {}} onClick={handlePreview} className={classes.container}>
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          {nft?.ipfs_data?.image_mimetype?.includes("video") ? (
            <video className={classes.image} src={image_url} alt="" controls />
          ) : nft?.ipfs_data?.image_mimetype?.includes("audio") ? (
            <div className={classes.thumbnail} style={{ backgroundImage: `url(${thumbnail})` }}>
              <audio className={classes.audio} src={image_url} alt="" controls />
            </div>
          ) : (
            <img className={classes.image} src={image_url} alt="" />
          )}
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.nameAndChainWrapper}>
          {collectionNft ? (
            <div className={classes._name}>{collectionNft.name}</div>
          ) : (
            <div className={classes.tag}>1 of 1</div>
          )}
          <img className={classes.chain} src={supportedChains[chain]?.icon} alt="" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.owner}>{breakAddress(owner)}</div>
      </div>
      {!fromDashboard ? (
        <MarketplaceView footerPrpops={footerPrpops} />
      ) : fromDashboard === "onSale" ? (
        <OnSalveView footerPrpops={footerPrpops} />
      ) : fromDashboard === "collected" ? (
        <CollectedView footerPrpops={footerPrpops} />
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleNftCard;
