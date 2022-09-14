import { useEffect, useState } from "react";
import classes from "./exploreTransactionHistory.module.css";

import transferIcon from "../../../assets/icon-transfer.svg";
import searchIcon from "../../../assets/icon-search.svg";

import { chainIdToParams } from "../../../utils/chainConnect";

import { breakAddress } from "../../../components/wallet/wallet-script";
import supportedChains from "../../../utils/supportedChains";

import { ReactComponent as MintIcon } from "../../../assets/icon-mint.svg";
import { ReactComponent as SalesIcon } from "../../../assets/icon-sales.svg";
import { ReactComponent as TransferIcon } from "../../../assets/icon-transfer.svg";
import { ReactComponent as ListIcon } from "../../../assets/icon-transfer.svg";
import { ReactComponent as TransactionIcon } from "../../../assets/icon-transaction.svg";

import {
  auroraCollectionTransactions,
  celoCollectionTransactions,
  polygonCollectionTransactions,
} from "../../../renderless/fetch-data/fetchUserGraphData";

const ExploreTransactionHistory = ({ collectionId, chain }) => {
  const [state, setState] = useState({
    selected: "all",
    transactionData: [],
    isAlgoChain: false,
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
  });
  const txIcons = {
    Minting: <MintIcon />,
    Transfers: <TransferIcon />,
    Sale: <SalesIcon />,
    Listing: <ListIcon />,
  };

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
        <TransactionIcon />
        <div>Transaction History</div>
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
            {transactionData?.map((data) => {
              return (
                <div className={classes.transaction}>
                  <div className={classes.status}>
                    {/* <img src={} alt="" /> */}
                    {txIcons[data?.type]}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTransactionHistory;
