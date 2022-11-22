import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import classes from "./list.module.css";
import supportedChains from "../../utils/supportedChains";
import { GenContext } from "../../gen-state/gen.context";
import { setNotification } from "../../gen-state/gen.actions";
import { buyNft, getFormatedPrice, getUserBoughtNftCollection } from "../../utils";
import {
  listAlgoNft,
  listArbitrumNft,
  listAuroraNft,
  listAvaxNft,
  listCeloNft,
  listPolygonNft,
} from "../../utils/arc_ipfs";
import { fetchUserBoughtNfts, listNft, readUserProfile } from "../../utils/firebase";
import {
  arbitrumUserData,
  auroraUserData,
  avaxUsersNfts,
  celoUserData,
  polygonUserData,
} from "../../renderless/fetch-data/fetchUserGraphData";
import { ReactComponent as DropdownIcon } from "../../assets/icon-chevron-down.svg";

import avatar from "../../assets/avatar.png";
import { useCallback } from "react";
import { getAlgoData } from "../NFT-Detail/NFTDetail-script";

const List = () => {
  const {
    account,
    chainId,
    connector,
    dispatch,
    priceFeed,
    singleAlgoNfts,
    algoCollections,
    activeCollection,
    mainnet,
  } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();
  const match = useRouteMatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [state, setState] = useState({
    nftDetails: null,
    amount: 0,
    isLoading: true,
    chain: "",
    price: 0,
    image_url: "",
    activeTab: "sell",
  });
  const { nftDetails, isLoading, price, amount, activeTab, chain } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const handlePrice = (event) => {
    handleSetState({ price: event.target.value });
  };

  const listNFT = async () => {
    // eslint-disable-next-line no-alert
    if (!price)
      return dispatch(
        setNotification({
          type: "warning",
          message: "Price cannot be empty",
        })
      );

    const listAlgoProps = {
      dispatch,
      account,
      connector,
      nftDetails,
      mainnet,
      price,
    };

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
    } else if (supportedChains[chainId].chain === "Avalanche") {
      listedNFT = await listAvaxNft(listProps);
    } else if (supportedChains[chainId].chain === "Algorand") {
      listedNFT = await listAlgoNft(listAlgoProps);
    } else if (supportedChains[chainId].chain === "Arbitrum") {
      listedNFT = await listArbitrumNft(listProps);
    } else {
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

  const getUSDValue = useCallback(async () => {
    const value = await getFormatedPrice(supportedChains[chainId]?.coinGeckoLabel || supportedChains[chainId]?.id);
    handleSetState({
      amount: price * value,
    });
  }, [price]);

  useEffect(() => {
    getUSDValue();
  }, [getUSDValue]);

  useEffect(() => {
    (async function getUserCollection() {
      let nft;
      if (supportedChains[chainId]?.chain === "Polygon") {
        const [nftData] = await polygonUserData(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Celo") {
        const [nftData] = await celoUserData(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Aurora") {
        const [nftData] = await auroraUserData(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Avalanche") {
        const [nftData] = await avaxUsersNfts(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Arbitrum") {
        const [nftData] = await arbitrumUserData(nftId);
        nft = nftData;
      } else if (supportedChains[chainId]?.chain === "Algorand") {
        const algoProps = {
          singleAlgoNfts,
          algoCollections,
          activeCollection,
          params,
          mainnet,
        };
        if (activeCollection || supportedChains[params.chainId]?.chain === "Algorand") {
          const algoNft = await getAlgoData({ algoProps });
          nft = algoNft?.nftDetails;
        }
      }
      if (nft === null) {
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
      if (!nft) history.goBack();
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
            {nftDetails?.creator && (
              <div className={classes.account}>
                <p>Created By</p>
                <div>
                  <img src={avatar} alt="avatar" />{" "}
                  {nftDetails && nftDetails.username ? nftDetails.username : breakAddress(nftDetails.creator)}
                </div>
              </div>
            )}
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
              <div className={classes.dropdownItems}>
                <button type="button" className={classes.buy}>
                  <div className={classes.btnText}>
                    <img src="/assets/price-tag.svg" alt="" />
                    SET PRICE
                  </div>
                  <span className={classes.btnSpan}>Sell the NFT at a fixed price</span>
                </button>
                <button type="button" className={classes.bid} disabled={nftDetails.sold}>
                  <div className={classes.btnText}>
                    <img src="/assets/bid.svg" alt="" />
                    HIGHEST BID
                  </div>
                  <span className={classes.btnSpan}>Auction to the highest Bider</span>
                </button>
              </div>
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
                <img className={classes.icon} src={supportedChains[nftDetails?.chain]?.icon} alt="" />
                <div className={classes.inputWrapper}>
                  <input value={price} onChange={handlePrice} placeholder="E.g. 10" type="number" min="1" step="1" />
                </div>
                <span className={classes.amount}>$ {amount.toFixed(2)}</span>
              </div>
            </section>
          </div>
          <div className={classes.listButtonWrapper}>
            <button onClick={listNFT} type="button" className={`${classes.listButton}`}>
              Post your Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
