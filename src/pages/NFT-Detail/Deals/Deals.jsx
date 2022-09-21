import classes from "./Deals.module.css";
import { useState } from "react";
import { useEffect } from "react";
import supportedChains from "../../../utils/supportedChains";
import { buyGraphNft, buyNft, getFormatedPrice } from "../../../utils";
import { Link, useRouteMatch } from "react-router-dom";

const Deals = ({ nftDetails }) => {
  const { price, chain, sold, isListed, owner, account, chainId, mainnet, connector, dispatch, Id } = nftDetails;
  const {
    params: { chainId: nftChainId, nftId },
  } = useRouteMatch();
  const [usdValue, setUsdValue] = useState(0);
  const buyProps = {
    dispatch,
    account,
    connector,
    mainnet,
    nftDetails,
    history,
    chainId,
  };

  const getUsdValue = async () => {
    let value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    setUsdValue(Number(value) * Number(price));
  };

  useEffect(() => {
    getUsdValue();
  }, [nftDetails]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>CURRENT PRICE</div>
        <div className={classes.priceSection}>
          <img className={classes.chainIcon} src={supportedChains[chain].icon} alt="" />
          <div className={classes.price}>{Number(price).toFixed(4)}</div>
          <div className={classes.appx}>{`($${usdValue.toFixed(4)})`}</div>
        </div>
      </div>
      {!price ? (
        owner === account && supportedChains[chain]?.chain !== "Near" ? (
          <Link to={chain ? `/marketplace/1of1/list/${chain}/${Id}` : `/marketplace/1of1/list/${Id}`}>
            {isListed ? (
              <button className={classes.btn}>Re-List</button>
            ) : (
              <button className={classes.btn}>List</button>
            )}
          </Link>
        ) : (
          <div className={`${classes.btn} ${classes.disable}`}>Not Listed</div>
        )
      ) : !sold || isListed ? (
        supportedChains[chain]?.chain === "Algorand" ? (
          <div onClick={() => buyNft(buyProps)} className={classes.btn}>
            Buy
          </div>
        ) : (
          <div onClick={() => buyGraphNft(buyProps)} className={classes.btn}>
            Buy
          </div>
        )
      ) : (
        <div className={`${classes.btn} ${classes.disable}`}>Sold</div>
      )}
    </div>
  );
};

export default Deals;
