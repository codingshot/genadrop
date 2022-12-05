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
import supportedChains from "../../../utils/supportedChains";
import {
  auroraCollectionTransactions,
  celoCollectionTransactions,
  polygonCollectionTransactions,
} from "../../../renderless/fetch-data/fetchUserGraphData";

const ExploreTransactionHistory = ({ collectionId, data, chain, fromCollection }) => {
  const [state, setState] = useState({
    selected: "all",
    transactionData: [],
    isAlgoChain: false,
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
  });

  const { selected, explorer, transactionData, isAlgoChain } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (chainIdToParams[chain]) {
      handleSetState({ explorer: chainIdToParams[chain].blockExplorerUrls });
    }
  }, []);

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
          handleSetState({ isAlgoChain: true });
          break;
      }
      console.log(data);
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
        {isAlgoChain ? (
          <div className={classes.commingSoon}>coming soon</div>
        ) : (
          <div className={classes.transactionContainer}>
            {collectionId
              ? transactionData?.map((data) => {
                  return (
                    <div className={classes.transaction}>
                      <div className={classes.status}>
                        <img src={icon(data?.type)} alt="" />
                        {data?.type}
                      </div>
                      <div className={classes.transactionDetails}>
                        <div className={classes.detail}>
                          <span className={classes.label}>From:</span>
                          <span className={classes.value}>{data?.from ? breakAddress(data?.from, 4) : "--"}</span>
                        </div>
                        <div className={classes.detail}>
                          <span className={classes.label}>To:</span>
                          <span className={classes.value}>{data?.to ? breakAddress(data?.to, 4) : "--"}</span>
                        </div>
                        <div className={classes.detail}>
                          <span className={classes.date}>{data.date}</span>
                        </div>
                        <div className={classes.export}>
                          <a href={explorer + "tx/" + data?.id} target="_blank">
                            <img src={exportIcon} alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              : data?.map((data) => {
                  return (
                    <div className={classes.transaction}>
                      <div className={classes.status}>
                        <img src={icon(data?.type)} alt="" />
                        {data?.type}
                      </div>
                      <div className={classes.transactionDetails}>
                        <div className={classes.detail}>
                          <span className={classes.label}>From:</span>
                          <span className={classes.value}>{data?.buyer ? breakAddress(data?.buyer, 4) : "--"}</span>
                        </div>
                        <div className={classes.detail}>
                          <span className={classes.label}>To:</span>
                          <span className={classes.value}>{data?.seller ? breakAddress(data?.seller, 4) : "--"}</span>
                        </div>
                        <div className={classes.detail}>
                          <span className={classes.date}>
                            {fromCollection ? getDate(data?.txDate) : getDate(data?.txDate?.seconds)}
                          </span>
                        </div>
                        <div className={classes.export}>
                          <a href={explorer + "tx/" + data?.txId} target="_blank">
                            <img src={exportIcon} alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTransactionHistory;
