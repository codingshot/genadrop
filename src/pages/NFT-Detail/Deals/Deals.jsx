import classes from "./Deals.module.css";
import { useState } from "react";
import { useEffect } from "react";
import supportedChains from "../../../utils/supportedChains";
import { getFormatedPrice } from "../../../utils";

const Deals = ({ nftDetails }) => {
  const { price, chain, sold } = nftDetails;
  const [usdValue, setUsdValue] = useState("");

  const getUsdValue = async () => {
    let value = await getFormatedPrice(supportedChains[chain].id);
    setUsdValue(value * parseInt(price));
  };

  useEffect(() => {
    getUsdValue();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>CURRENT PRICE</div>
        <div className={classes.priceSection}>
          <img className={classes.chainIcon} src={supportedChains[chain].icon} alt="" />
          <div className={classes.price}>{price}</div>
          <div className={classes.appx}>{`$${usdValue}`}</div>
        </div>
      </div>
      {sold ? (
        <div className={`${classes.btn} ${classes.disable}`}>Sold</div>
      ) : (
        <div className={classes.btn}>Buy now</div>
      )}
    </div>
  );
};

export default Deals;
