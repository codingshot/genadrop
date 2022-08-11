import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useRouteMatch, Link, useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { getUserBoughtNftCollection, getUserGraphNft } from "../../utils";
import classes from "./list.module.css";
import { fetchUserBoughtNfts, listNft, writeNft } from "../../utils/firebase";
import { GET_USER_NFT } from "../../graphql/querries/getCollections";
import { polygonClient } from "../../utils/graphqlClient";
import { ethers } from "ethers";
import algoIcon from "../../assets/icon-algo.svg";
import { listCeloNft, listPolygonNft } from "../../utils/arc_ipfs";
import {
  celoUserData,
  getCeloNFTToList,
  getPolygonNFTToList,
  polygonUserData,
} from "../../renderless/fetch-data/fetchUserGraphData";
import { setNotification } from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";
import axios from "axios";

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
  });
  const { nftDetails, isLoading, price, chain, image_url, amount } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const handlePrice = (event) => {
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
    if (chainId === 80001 || chainId === 137) {
      const listNft = await listPolygonNft(listProps);
      if (listNft.error) {
        dispatch(
          setNotification({
            message: "Transaction failed",
            type: "warning",
          })
        );
      } else {
        return history.push(`${nftId}/listed`);
      }
    } else if (chainId === 44787 || chainId === 42220) {
      const listNft = await listCeloNft(listProps);
      if (listNft.error) {
        dispatch(
          setNotification({
            message: "Transaction failed",
            type: "warning",
          })
        );
      } else {
        return history.push(`${nftId}/listed`);
      }
    } else {
      console.log("RES: ", await listNft(nftDetails.Id, price, account));
      history.push(`${match.url}/listed`);
    }
  };

  useEffect(() => {
    (async function getAmount() {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chainId].id}&vs_currencies=usd`)
        .then((res) => {
          const value = Object.values(res.data)[0].usd;
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
      if (chainId === 80001 || chainId === 137) {
        const [nft] = await polygonUserData(nftId);
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
        handleSetState({
          nftDetails: nft,
          isLoading: false,
          image_url: nft?.ipfs_data?.image,
        });
      } else if (chainId === 44787 || chainId === 42220) {
        const [nft] = await celoUserData(nftId);
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
        handleSetState({
          nftDetails: nft,
          image_url: nft?.ipfs_data?.image,
          isLoading: false,
        });
      } else {
        const userNftCollections = await fetchUserBoughtNfts(account);
        const result = await getUserBoughtNftCollection(mainnet, userNftCollections);
        const nft = result.filter((NFT) => String(NFT?.Id) === nftId)[0];
        if (!nft) history.goBack();
        else {
          handleSetState({
            nftDetails: nft,
            isLoading: false,
            image_url: nft.image_url,
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    console.log(nftDetails);
  }, [nftDetails]);

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

  return (
    <div className={classes.container}>
      <div className={classes.listHeader}>
        <h1>List Item for Sale</h1>
      </div>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <img className={classes.nft} src={nftDetails?.image_url} alt="" />
        </div>
        <div className={classes.v_subsection2}>
          {/* PRICE HISTORY */}
          <div className={classes.feature}>
            <div className={classes.mainDetails}>
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>Price</div>
              </div>
            </div>
            <section className={classes.mintOptions}>
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
                <img src={supportedChains[nftDetails?.chain].icon} alt="" />
                <div className={classes.inputWrapper}>
                  <input value={price} onChange={handlePrice} placeholder="E.g. 10" type="number" min="1" step="1" />
                </div>
                <span className={classes.amount}>{amount.toFixed(2)}</span>
              </div>
            </section>
          </div>
          <div className={classes.feature}>
            <div className={classes.mainDetails}>
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>Sell Method</div>
              </div>
            </div>

            <div className={classes.btns}>
              <button type="button" className={classes.buy} onClick={listNFT}>
                <div className={classes.btnText}>
                  <img src="/assets/price-tage.svg" alt="" />
                  SET PRICE
                </div>
                <span className={classes.btnSpan}>Sell the NFT at a fixed price</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {price ? (
        <div className={classes.feature}>
          <div className={classes.mainDetails}>
            <div className={classes.collectionHeader}>
              <div className={classes.nftId}>Fees</div>
            </div>
          </div>

          <div className={classes.detailContent}>
            <div className={classes.priceDescription}>
              Listing is Free! At the time of sale, the following fees will be deducted
            </div>
            <div className={classes.row}>
              Genadrop <span>10%</span>
            </div>
            <div className={classes.row}>
              {nftDetails.name ? nftDetails.name : ""} <span>7%</span>
            </div>
            <div className={classes.row}>
              Total <span>17%</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default List;
