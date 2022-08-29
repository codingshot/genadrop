import { useEffect, useState } from "react";
import classes from "./exploreTransactionHistory.module.css";
import timerIcon from "../../../assets/icon-timer.svg";
import transferIcon from "../../../assets/icon-transfer.svg";
import searchIcon from "../../../assets/icon-search.svg";
import mintIcon from "../../../assets/icon-mint.svg";
import cartIcon from "../../../assets/icon-cart-no-bg.svg";
import exportIcon from "../../../assets/icon-export.svg";

import { breakAddress } from "../../../components/wallet/wallet-script";
import { celoCollectionTransactions } from "../../../renderless/fetch-data/fetchUserGraphData";

const ExploreTransactionHistory = ({ collectionId }) => {
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
      const data = await celoCollectionTransactions(collectionId);
      console.log("rrr", data);
      switch (selected) {
        case "all":
          handleSetState({
            transactionData: data,
          });
        case "mints":
          const minting = data.filter((data) => data.type === "Minting");
          handleSetState({
            transactionData: minting,
          });
      }
    })();
    console.log(selected);
  }, [collectionId, selected]);

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

          {/* <div className={classes.transaction}>
            <div className={classes.status}>
              <img src={mintIcon} alt="" />
              Transfer
            </div>
            <div className={classes.transactionDetails}>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.date}>2 days ago</span>
              </div>
              <div className={classes.export}>
                <img src={exportIcon} alt="" />
              </div>
            </div>
          </div>

          <div className={classes.transaction}>
            <div className={classes.status}>
              <img src={mintIcon} alt="" />
              Transfer
            </div>
            <div className={classes.transactionDetails}>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.date}>2 days ago</span>
              </div>
              <div className={classes.export}>
                <img src={exportIcon} alt="" />
              </div>
            </div>
          </div>
          <div className={classes.transaction}>
            <div className={classes.status}>
              <img src={mintIcon} alt="" />
              Transfer
            </div>
            <div className={classes.transactionDetails}>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.date}>2 days ago</span>
              </div>
              <div className={classes.export}>
                <img src={exportIcon} alt="" />
              </div>
            </div>
          </div>
          <div className={classes.transaction}>
            <div className={classes.status}>
              <img src={mintIcon} alt="" />
              Transfer
            </div>
            <div className={classes.transactionDetails}>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.date}>2 days ago</span>
              </div>
              <div className={classes.export}>
                <img src={exportIcon} alt="" />
              </div>
            </div>
          </div>
          <div className={classes.transaction}>
            <div className={classes.status}>
              <img src={mintIcon} alt="" />
              Transfer
            </div>
            <div className={classes.transactionDetails}>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.label}>From:</span>
                <span className={classes.value}>{breakAddress("0x7d81a27b25c05163dd8ef643c6b00d02405ed9d7")}</span>
              </div>
              <div className={classes.detail}>
                <span className={classes.date}>2 days ago</span>
              </div>
              <div className={classes.export}>
                <img src={exportIcon} alt="" />
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ExploreTransactionHistory;
