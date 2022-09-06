import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import classes from "./list.module.css";
import supportedChains from "../../utils/supportedChains";
import { GenContext } from "../../gen-state/gen.context";
import { setNotification } from "../../gen-state/gen.actions";
import { getUserBoughtNftCollection } from "../../utils";
import { listAuroraNft, listCeloNft, listPolygonNft } from "../../utils/arc_ipfs";
import { fetchUserBoughtNfts, listNft, readUserProfile } from "../../utils/firebase";
import { auroraUserData, celoUserData, polygonUserData } from "../../renderless/fetch-data/fetchUserGraphData";
import { ReactComponent as DropdownIcon } from "../../assets/icon-chevron-down.svg";
import avatar from "../../assets/avatar.png";

const List = () => {
  const { account, mainnet, chainId, connector, dispatch } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();
  const match = useRouteMatch();
  const history = useHistory();

  const [state, setState] = useState({
    nftDetails: null,
    amount: 0,
    isLoading: true,
    chain: "Algo",
    price: "",
    image_url: "",
    activeTab: "sell",
  });
  const { nftDetails, isLoading, price, amount, activeTab } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const handlePrice = (event) => {
    console.log(event.target.value);
    handleSetState({ price: event.target.value });
  };

  const listNFT = async () => {
    // eslint-disable-next-line no-alert
    if (!price) return alert("price can't be empty");

    const listProps = {
      dispatch,
      account,
      connector,
      nftContract: nftDetails.collection_contract,
      mainnet,
      price,
      id: nftDetails.tokenID,
    };
    let listedNFT;
    if (supportedChains[chainId].chain === "Polygon") {
      listedNFT = await listPolygonNft(listProps);
    } else if (supportedChains[chainId].chain === "Celo") {
      listedNFT = await listCeloNft(listProps);
    } else if (supportedChains[chainId].chain === "Aurora") {
      listedNFT = await listAuroraNft(listProps);
    } else {
      console.log("RES: ", await listNft(nftDetails.Id, price, account));
      return history.push(`${match.url}/listed`);
    }
    if (listedNFT.error) {
      dispatch(
        setNotification({
          message: "Transaction failed",
          type: "warning",
        })
      );
    } else {
      return history.push(`${nftId}/listed`);
    }
    return listedNFT;
  };

  useEffect(() => {
    (async function getAmount() {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chainId]?.coinGeckoLabel}&vs_currencies=usd`
        )
        .then((res) => {
          const value = Object.values(res.data)[0]?.usd;
          handleSetState({
            // chainIcon: supportedChains[nftDetails.chain].icon,
            amount: price * value,
            // chainSymbol: supportedChains[nftDetails.chain].symbol,
          });
        });
    })();
  }, [price]);

  useEffect(() => {
    (async function getUserCollection() {
      let nft;
      if (supportedChains[chainId]?.chain === "Polygon") {
        const [nftData] = await polygonUserData(nftId)[0];
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Celo") {
        const [nftData] = await celoUserData(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Aurora") {
        const [nftData] = await auroraUserData(nftId);
        nft = nftData;
      } else {
        const userNftCollections = await fetchUserBoughtNfts(account);
        const result = await getUserBoughtNftCollection(mainnet, userNftCollections);
        const [nftData] = result.filter((NFT) => String(NFT?.Id) === nftId);
        nft = nftData;
      }

      if (!nft) {
        return (
          dispatch(
            setNotification({
              message: "Trying to list in a different chain, Please make sure you're connected to the right chain",
              type: "warning",
            })
          ),
          history.goBack()
        );
      }
      handleSetState({
        nftDetails: nft,
        isLoading: false,
      });
      return nftDetails;
    })();
  }, []);

  // Get userName
  async function getUsername(walletAddress) {
    const data = await readUserProfile(walletAddress);
    const updateNftDetails = nftDetails;
    updateNftDetails.username = data.username;
    handleSetState({
      nftDetails: updateNftDetails,
    });
  }

  useEffect(() => {
    const creator = nftDetails?.creator;
    if (creator) {
      getUsername(creator);
    }
  }, [nftDetails?.creator]);

  const breakAddress = (address = "", width = 3) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  if (isLoading) {
    return (
      <div className={classes.menu}>
        <div className={classes.left}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.right}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.fullLegnth}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={200} />
        </div>
      </div>
    );
  }
  const dropHandler = (event) => {
    if (activeTab === event) {
      handleSetState({ activeTab: "" });
    } else {
      handleSetState({ activeTab: event });
    }
  };

  console.log(nftDetails);
  return (
    <div className={classes.container}>
      <div className={classes.listHeader}>
        <h1>List Item for Sale</h1>
      </div>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <div className={classes.header}>
            <div className={classes.title}>{nftDetails?.name}</div>
          </div>
          <img className={classes.nft} src={nftDetails?.image_url} alt="" />
          <div className={classes.footer}>
            <div className={classes.account}>
              <p>Created By</p>
              <div>
                <img src={avatar} alt="avatar" />{" "}
                {nftDetails && nftDetails.username ? nftDetails.username : breakAddress(nftDetails.creator)}
              </div>
            </div>
            {nftDetails?.collection_name && (
              <div className={classes.account}>
                <p>Collection</p>
                <div>{nftDetails.collection_name}</div>
              </div>
            )}
          </div>
        </div>
        <div className={classes.v_subsection2}>
          <div className={`${classes.feature} ${activeTab !== "sell" ? classes.disabled : ""}`}>
            <div
              className={classes.mainDetails}
              onClick={() => {
                dropHandler("sell");
              }}
            >
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>Sell Method</div>
              </div>
              <DropdownIcon />
            </div>

            <div className={`${classes.dropdownContent}`}>
              <button type="button" className={classes.buy} onClick={listNFT}>
                <div className={classes.btnText}>
                  <img src="/assets/price-tage.svg" alt="" />
                  SET PRICE
                </div>
                <span className={classes.btnSpan}>Sell the NFT at a fixed price</span>
              </button>
            </div>
          </div>
          <div className={`${classes.feature}`}>
            <div className={classes.mainDetails}>
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>Price</div>
              </div>
            </div>
            <section className={`${classes.dropdownContent}`}>
              <div className={classes.priceDescription}>
                Check the
                <a href="#" target="_blank">
                  {" "}
                  Collection Floor price
                </a>{" "}
                to give you an idea of the average price of the NFT at the moment
              </div>
              <div className={classes.chain}>
                {/* <div className={classes.inputWrapper}>
                  <select value={chain} onChange={(event) => handleSetState({ chain: event.target.value })}>
                    <option value="Algo">Algo</option>
                    <option value="Celo">Celo</option>
                    <option value="Polygon">Polygon</option>
                  </select>
                </div> */}
                <img className={classes.icon} src={supportedChains[nftDetails?.chain]?.icon} alt="" />
                <div className={classes.inputWrapper}>
                  <input value={price} onChange={handlePrice} placeholder="E.g. 10" type="number" min="1" step="1" />
                </div>
                <span className={classes.amount}>{amount.toFixed(2)}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
      {price
        ? // <div className={classes.feature}>
          //   <div className={classes.mainDetails}>
          //     <div className={classes.collectionHeader}>
          //       <div className={classes.nftId}>Fees</div>
          //     </div>
          //   </div>

          {
            /* <div className={classes.detailContent}>
            <div className={classes.priceDescription}>
              Listing is Free! At the time of sale, the following fees will be deducted
            </div>
            <div className={classes.row}>
              Genadrop <span>10%</span>
            </div>
            <div className={classes.row}>
              {nftDetails?.name ? nftDetails?.name : ""} <span>7%</span>
            </div>
            <div className={classes.row}>
              Total <span>17%</span>
            </div>
          </div> */
          }
        : // </div>
          ""}
    </div>
  );
};

export default List;
