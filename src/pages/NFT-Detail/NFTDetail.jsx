import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { setOverlay } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import Attributes from "./Attributes/Attributes";
import Deals from "./Deals/Deals";
import Description from "./Description/Description";
import Details from "./Details/Details";
import Metadata from "./Metadata/Metadata";
import More from "./More/More";
import NFT from "./NFT/NFT";
import { getAlgoNftData } from "./NFTDetail-script";
import classes from "./NFTDetail.module.css";
import PriceHistory from "./PriceHistory/PriceHistory";
import TransactionHistory from "./TransactionHistory/TransactionHistory";

const NFTDetail = () => {
  const { params } = useRouteMatch();
  const [state, setState] = useState({
    nftDetails: null,
  });

  const { nftDetails } = state;

  const {
    dispatch,
    singleAlgoNfts,
    account,
    activeCollection,
    connector,
    mainnet,
    auroraCollections,
    polygonCollections,
    celoCollections,
    algoCollections,
    chainId,
  } = useContext(GenContext);

  const algoCollectionsArr = Object.values(algoCollections);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const getAlgoNft = async () => {
    dispatch(setOverlay(true));
    const nftDetails = await getAlgoNftData({ singleAlgoNfts, algoCollections, params });
    handleSetState({ nftDetails });
    dispatch(setOverlay(false));
  };

  useEffect(() => {
    getAlgoNft();
    // if (nftDetails) {
    //   (async function getNftDetails() {
    //     const tHistory = await readNftTransaction(nftId);
    //     handleSetState({
    //       nftDetails,
    //       isLoading: false,
    //       transactionHistory: tHistory.reverse(),
    //       mintedDetails: tHistory.find((e) => e.type == "Minting"),
    //     });
    //     dispatch(setOverlay(false));
    //     document.documentElement.scrollTop = 0;
    //   })();
    // }
  }, [singleAlgoNfts]);

  return (
    <div className={classes.container}>
      {nftDetails ? (
        <div className={classes.wrapper}>
          <div className={classes.backBtnContainer}>
            <div className={classes.backBtn}>Back</div>
          </div>

          <div className={classes.sectionWrapper}>
            <div className={classes.nftSection}>
              <NFT nftDetails={nftDetails} />
              <Details nftDetails={nftDetails} />
            </div>

            <div className={classes.detailSection}>
              <Deals nftDetails={nftDetails} />
              <Description nftDetails={nftDetails} />
              <Attributes nftDetails={nftDetails} />
            </div>
          </div>

          <PriceHistory />

          <div className={classes.historySection}>
            <TransactionHistory nftDetails={nftDetails} />
            <Metadata nftDetails={nftDetails} />
          </div>

          <div className={classes.moreSection}>
            <More />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NFTDetail;
