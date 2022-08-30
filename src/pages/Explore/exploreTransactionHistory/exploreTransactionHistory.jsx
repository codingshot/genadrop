import { useEffect, useState } from "react";
import classes from "./exploreTransactionHistory.module.css";
import timerIcon from "../../../assets/icon-timer.svg";
import transferIcon from "../../../assets/icon-transfer.svg";
import searchIcon from "../../../assets/icon-search.svg";
import mintIcon from "../../../assets/icon-mint.svg";
import cartIcon from "../../../assets/icon-cart-no-bg.svg";
import exportIcon from "../../../assets/icon-export.svg";
import { chainIdToParams } from "../../../utils/chainConnect";

import { breakAddress, getDate } from "../../../components/wallet/wallet-script";

const ExploreTransactionHistory = ({ data, chain, fromCollection }) => {
  const [state, setState] = useState({
    selected: "all",
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
  });

  const { selected, explorer } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    if (chainIdToParams[chain]) {
      handleSetState({ explorer: chainIdToParams[chain].blockExplorerUrls });
    }
  }, []);

  const icons = [cartIcon, transferIcon, mintIcon];

  const icon = (e) => {
    let icon = "";
    switch (e) {
      case "Sale":
        icon = icons[0];
        break;
      case "Transfer":
        icon = icons[1];
        break;
      case "Minting":
        icon = icons[2];
        break;
      case "Listing":
        icon = icons[1];
        break;
      default:
        break;
    }
    return icon;
  };

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
            className={`${classes.option && classes.disabled}`}
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
          {data?.map((d, i) => {
            return (
              <div className={classes.transaction}>
                <div className={classes.status}>
                  <img src={icon(d.type)} alt="" />
                  {d.type}
                </div>
                <div className={classes.transactionDetails}>
                  <div className={classes.detail}>
                    <span className={classes.label}>From:</span>
                    <span className={classes.value}>{d.buyer ? breakAddress(d.buyer, 4) : "--"}</span>
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>To:</span>
                    <span className={classes.value}>{d.seller ? breakAddress(d.seller, 4) : "--"}</span>
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.date}>
                      {fromCollection ? getDate(d.txDate) : getDate(d.txDate?.seconds)}
                    </span>
                  </div>
                  <div className={classes.export}>
                    <a href={explorer + "tx/" + d.txId} target="_blank">
                      <img src={exportIcon} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreTransactionHistory;
