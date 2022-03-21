import { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { getSingleNftDetails, getUserNftCollection } from "../../utils";
import classes from "./list.module.css";
import Skeleton from "react-loading-skeleton";
import { PurchaseNft } from "../../utils/arc_ipfs";
import axios from "axios";
import { fetchAllNfts } from "../../utils/firebase";
import bidIcon from '../../assets/bid.png';

const List = () => {
  const { account, connector } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();

  const [state, setState] = useState({
    nftDetails: null,
    isLoading: true,
    chain: "Algo",
    price: "",
  });
  const { nftDetails, isLoading, price, chain } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const handlePrice = (event) => {
    handleSetState({ price: event.target.value });
  };

  const buyNft = async () => {
    let res = await PurchaseNft(nftDetails, account, connector);
    console.log("final", res);
    alert(res);
  };

  useEffect(() => {
    (async function getUserCollection() {
      let userNftCollections = await fetchAllNfts(account);
      console.log(userNftCollections);
      let result = await getUserNftCollection(userNftCollections);
      const nft = result.filter((nft) => String(nft.Id) === nftId)[0];
      let nftDetails = await getSingleNftDetails(nft);
      handleSetState({ nftDetails, isLoading: false });
      console.log("-->", nftDetails);
    }());

    axios
      .get(`https://api.coinbase.com/v2/prices/ALGO-USD/spot`)
      .then((res) => {
        handleSetState({ algoPrice: res.data.data.amount });
      });
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (!nftDetails) return;
    console.log("==>", nftDetails);
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
              <button
                className={classes.buy}
                disabled={nftDetails.sold}
                onClick={buyNft}
              >
                <div>
                  <img src="/assets/price-tage.svg" alt="" />
                  SET PRICE
                </div>
                <span>Sell the NFT at a fixed price</span>
              </button>
              <button
                className={classes.bid}
                disabled={nftDetails.sold}
                onClick={buyNft}
              >
                <div>
                  <img src={bidIcon} alt="" />
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
                to give you an idea of the average price of the NFT at the
                moment
              </div>
              <div className={classes.chain}>
                <div className={classes.inputWrapper}>
                  <select
                    value={chain}
                    onChange={(event) =>
                      handleSetState({ chain: event.target.value })
                    }
                  >
                    <option value="Algo">Algo</option>
                    <option value="Celo">Celo</option>
                    <option value="Polygon">Polygon</option>
                  </select>
                </div>
                <div className={classes.inputWrapper}>
                  <input
                    type="text"
                    value={price}
                    onChange={handlePrice}
                    placeholder="E.g. 10"
                  />
                </div>
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
              Listing is Free! At the time of sale, the following fees will be
              deducted
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
