import React, { useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { GenContext } from "../../../gen-state/gen.context";
import { buyNft, getSingleNftDetails } from "../../../utils";
import classes from "./list.module.css";

const List = () => {
  const { dispatch, account, connector, mainnet, chainId } = useContext(GenContext);
  const history = useHistory();
  const {
    params: { nftId },
  } = useRouteMatch();
  const { singleNfts } = useContext(GenContext);

  const [state, setState] = useState({
    nftDetails: null,
    isLoading: true,
    algoPrice: 0,
    chain: "Algo",
    price: "",
  });

  const { nftDetails, isLoading, price, chain, algoPrice } = state;

  const buyProps = {
    dispatch,
    account,
    connector,
    mainnet,
    nftDetails,
    history,
    chainId,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handlePrice = (event) => {
    handleSetState({ price: event.target.value });
  };

  useEffect(() => {
    const nft = singleNfts.filter((singleNft) => String(singleNft.id) === nftId)[0];
    (async function getNftDetails() {
      const nftdetails = await getSingleNftDetails(nft);

      handleSetState({ nftDetails: nftdetails, isLoading: false });
    })();

    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    // if (!nftDetails) return;
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
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <img className={classes.nft} src={nftDetails.image_url} alt="" />
        </div>
        <div className={classes.v_subsection2}>
          <div className={classes.feature}>
            <div className={classes.mainDetails}>
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>Sell Method</div>
              </div>
            </div>

            <div className={classes.btns}>
              ({" "}
              <button type="button" className={classes.buy} disabled={nftDetails.sold} onClick={() => buyNft(buyProps)}>
                ){" "}
                <div>
                  <img src="/assets/price-tage.svg" alt="" />
                  SET PRICE
                </div>
                <span>Sell the NFT at a fixed price</span>
              </button>
              <button type="button" className={classes.bid} disabled={nftDetails.sold} onClick={() => buyNft(buyProps)}>
                <div>
                  <img src="/assets/bid.png" alt="" />
                  HIGHEST BID
                </div>
                <span>Auction to the highest Bider</span>
              </button>
            </div>
          </div>
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
                  Collection Floor price
                </a>
                to give you an idea of the average price of the NFT at the moment
              </div>
              <div className={classes.chain}>
                <div className={classes.inputWrapper}>
                  <select value={chain} onChange={(event) => handleSetState({ chain: event.target.value })}>
                    <option value="Algo">Algo</option>
                    <option value="Celo">Celo</option>
                    <option value="Polygon">Polygon</option>
                  </select>
                </div>
                <div className={classes.inputWrapper}>
                  <input type="text" value={price} onChange={handlePrice} placeholder="E.g. 10" />
                </div>
                <div />
                <span>0</span>
              </div>
            </section>
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
              {nftDetails.name} <span>7%</span>
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
