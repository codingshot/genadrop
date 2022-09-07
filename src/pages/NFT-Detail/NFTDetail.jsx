import { useContext, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { setOverlay } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import Attributes from "./Attributes/Attributes";
import Deals from "./Deals/Deals";
import Description from "./Description/Description";
import Details from "./Details/Details";
import Metadata from "./Metadata/Metadata";
import More from "./More/More";
import NFT from "./NFT/NFT";
import { getAlgoData, getGraphData } from "./NFTDetail-script";
import classes from "./NFTDetail.module.css";
import PriceHistory from "./PriceHistory/PriceHistory";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import { ReactComponent as BackIcon } from "../../assets/icon-arrow-left.svg";
import supportedChains from "../../utils/supportedChains";

const NFTDetail = () => {
  const { params } = useRouteMatch();
  const match = useRouteMatch();
  const history = useHistory();
  const [state, setState] = useState({
    nftDetails: null,
    transactionHistory: null,
    collection: null,
    _1of1: null,
  });

  const { nftDetails, transactionHistory, collection, _1of1 } = state;

  const {
    dispatch,
    algoCollections,
    activeCollection,
    singleAlgoNfts,
    auroraCollections,
    polygonCollections,
    celoCollections,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    account,
    connector,
    mainnet,
    chainId,
  } = useContext(GenContext);

  const graphProps = {
    auroraCollections,
    polygonCollections,
    celoCollections,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    params,
  };

  const algoProps = {
    singleAlgoNfts,
    algoCollections,
    activeCollection,
    params,
    mainnet,
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleGoBack = () => {
    history.push(`${match.url.split("/").slice(0, -1).join("/")}`);
  };

  useEffect(() => {
    let result;
    const getData = async () => {
      dispatch(setOverlay(true));
      if (activeCollection || supportedChains[params.chainId]?.chain === "Algorand") {
        result = await getAlgoData({ algoProps });
      } else {
        console.log("false");
        result = await getGraphData({ graphProps });
      }
      dispatch(setOverlay(false));
      console.log({ result });
      handleSetState({ ...result });
    };
    getData();
    document.documentElement.scrollTop = 0;
  }, [singleAlgoNfts, algoCollections, auroraCollections, polygonCollections, celoCollections, params.nftId]);

  return (
    <div className={classes.container}>
      {nftDetails && collection && _1of1 && transactionHistory ? (
        <div className={classes.wrapper}>
          <div onClick={handleGoBack} className={classes.backBtnContainer}>
            <BackIcon className={classes.backIcon} />
            <div>Back</div>
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

          <PriceHistory transactionHistory={transactionHistory} />

          <div className={classes.historySection}>
            <TransactionHistory transactionHistory={transactionHistory} />
            <Metadata nftDetails={nftDetails} />
          </div>

          <div className={classes.moreSection}>
            <More params={params} collection={collection} _1of1={_1of1} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NFTDetail;
