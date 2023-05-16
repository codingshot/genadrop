/* eslint-disable no-unsafe-optional-chaining */
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment";
import classes from "./listingMarket.module.css";
import tradePortIcon from "../../../assets/tradeport.svg";
// import nearIcon from "../../../assets/icon-near.svg";
import fewfarIcon from "../../../assets/fewandfar.svg";

const ListingMarket = ({ nftDetails }) => {
  const [marketData, setMarketData] = useState([]);
  const [usdValue, setUsdValue] = useState(0);
  const NEAR_CONVERSION_CONSTANT = 1000000000000000000000000;

  const getUsdValue = async (price) => {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd`);
    const multiplyBy = Object.values(res?.data)[0]?.usd;
    const value = multiplyBy * price.toFixed(2);
    return value.toFixed(4);
  };

  useEffect(() => {
    setMarketData(
      nftDetails?.marketListed?.map((data) => {
        const price = Number(Object?.values(JSON?.parse(data))[0]) / NEAR_CONVERSION_CONSTANT;
        Promise.all([getUsdValue(price)]).then((result) => setUsdValue(result));
        return {
          marketType: Object.keys(JSON.parse(data)).includes("market.tradeport.near"),
          price: price.toFixed(3),
          time: moment(Object?.values(JSON?.parse(data))[1] * 1000).fromNow(),
        };
      })
    );
  }, [nftDetails]);

  return (
    <div className={classes.container}>
      <h2>Listings</h2>
      <table align="center">
        <tr className={classes.list}>
          <th>Market</th>
          <th>Price</th>
          <th>USD Price</th>
          <th>Time</th>
        </tr>
        {marketData.map((data) => (
          <tr className={classes.list}>
            <td>{data?.marketType ? <img src={tradePortIcon} alt="" /> : <img src={fewfarIcon} alt="" />}</td>
            <td style={{ textAlign: "center" }}>
              {/* <img className={classes.nearIcon} src={nearIcon} alt="" /> */}
              {data?.price}
            </td>
            <td>${usdValue[0]}</td>
            <td>{data?.time}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default ListingMarket;
