import { useEffect, useState } from "react";
import classes from "./exploreTransactionHistory.module.css";
import timerIcon from "../../../assets/icon-timer.svg";
import transferIcon from "../../../assets/icon-transfer.svg";
import searchIcon from "../../../assets/icon-search.svg";
import mintIcon from "../../../assets/icon-mint.svg";
import cartIcon from "../../../assets/icon-cart-no-bg.svg";
import exportIcon from "../../../assets/icon-export.svg";

import { breakAddress } from "../../../components/wallet/wallet-script";
import {
  auroraCollectionTransactions,
  celoCollectionTransactions,
  polygonCollectionTransactions,
} from "../../../renderless/fetch-data/fetchUserGraphData";
import supportedChains from "../../../utils/supportedChains";

const ExploreTransactionHistory = ({ collectionId, chain }) => {
  const [state, setState] = useState({
    selected: "all",
    transactionData: [],
  });

  const { transactionData, selected } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    (async function getTransactions() {
      let data = [];
      switch (supportedChains[chain]?.chain) {
        case "Celo":
          data = await celoCollectionTransactions(collectionId);
          break;
        case "Aurora":
          data = await auroraCollectionTransactions(collectionId);
          break;
        case "Polygon":
          data = await polygonCollectionTransactions(collectionId);
          break;
        default:
          break;
      }
      switch (selected) {
        case "all":
          handleSetState({
            transactionData: data,
          });
          break;
        case "mints":
          const minting = data.filter((data) => data.type === "Minting");
          handleSetState({
            transactionData: minting,
          });
          break;
        case "transfers":
          const transfers = data.filter((data) => data.type === "Transfers");
          handleSetState({
            transactionData: transfers,
          });
          break;
        case "sales":
          const sales = data.filter((data) => data.type === "Sale");
          handleSetState({
            transactionData: sales,
          });
          break;
        case "listings":
          const listing = data.filter((data) => data.type === "Listing");
          handleSetState({
            transactionData: listing,
          });
          break;
      }
    })();
  }, [collectionId, selected, chain]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <img src={timerIcon} alt="" /> Transaction History
      </div>
      <div className={classes.wrapper}>
        <div className={classes.filters}>
          <div
            className={`${classes.option} && ${selected === "all" && classes.active}`}
            onClick={() => handleSetState({ selected: "all" })}
          >
            All
          </div>
          <div
            className={`${classes.option} && ${selected === "mints" && classes.active}`}
            onClick={() => handleSetState({ selected: "mints" })}
          >
            Mints
          </div>
          <div
            className={`${classes.option} && ${selected === "transfers" && classes.active}`}
            onClick={() => handleSetState({ selected: "transfers" })}
          >
            Transfers
          </div>
          <div
            className={`${classes.option} && ${selected === "sales" && classes.active}`}
            onClick={() => handleSetState({ selected: "sales" })}
          >
            Sales
          </div>
          <div
            className={`${classes.option} && ${selected === "listings" && classes.active}`}
            disabled
            onClick={() => handleSetState({ selected: "listings" })}
          >
            Listings
          </div>
          <div
            className={`${classes.option && classes.disabled}`}
            disabled
            onClick={() => handleSetState({ selected: "canceled" })}
          >
            Canceled Listings
          </div>
        </div>

        <div className={classes.searchInput}>
          <img src={searchIcon} alt="" srcset="" />
          <input type="text" placeholder="Search" />
        </div>
        <div className={classes.transactionContainer}>
          {transactionData?.map((data) => (
            <div className={classes.transaction}>
              <div className={classes.status}>
                <img src={mintIcon} alt="" />
                {data?.type}
              </div>
              <div className={classes.transactionDetails}>
                <div className={classes.detail}>
                  <span className={classes.label}>From:</span>
                  <span className={classes.value}>{data.from ? breakAddress(data.from) : "--"}</span>
                </div>
                <div className={classes.detail}>
                  <span className={classes.label}>to:</span>
                  <span className={classes.value}>{data.to ? breakAddress(data.to) : "--"}</span>
                </div>
                <div className={classes.detail}>
                  <span className={classes.date}>{data.date}</span>
                </div>
                <div className={classes.export}>
                  <img src={exportIcon} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreTransactionHistory;
