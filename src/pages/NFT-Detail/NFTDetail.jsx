import React, { useContext, useState, useEffect, useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
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
import LoadingScreen from "./Loading-Screen/LoadingScreen";

const NFTDetail = () => {
  const { params } = useRouteMatch();
  const match = useRouteMatch();
  const history = useHistory();
  const [state, setState] = useState({
    nftDetails: null,
    transactionHistory: null,
    collection: null,
    _1of1: null,
    load: true,
  });

  const { nftDetails, transactionHistory, collection, _1of1, load } = state;

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
    singleArbitrumNfts,
    singleAvaxNfts,
    singleCeloNfts,
    singleNearNfts,
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
    singleNearNfts,
    singleCeloNfts,
    singleArbitrumNfts,
    singleAvaxNfts,
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

  const getData = async () => {
    document.documentElement.scrollTop = 0;

    let result;
    if (activeCollection || supportedChains[params.chainId]?.chain === "Algorand") {
      result = await getAlgoData({ algoProps });
    } else {
      result = await getGraphData({ graphProps });
    }
    handleSetState({ ...result });
  };

  useEffect(() => {
    handleSetState({ load: true });
    getData();
    if (nftDetails && collection && _1of1 && transactionHistory) {
      setTimeout(() => {
        handleSetState({ load: false });
      }, 2000);
    }
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
              <div className={classes.desktop}>
                <NFT nftDetails={nftDetails} />
                <Details nftDetails={nftDetails} />
              </div>
              <div className={classes.mobile}>
                <NFT nftDetails={nftDetails} />
                <Deals nftDetails={{ ...nftDetails, account, chainId, mainnet, connector, dispatch }} />
              </div>
            </div>

            <div className={classes.detailSection}>
              <div className={classes.desktop}>
                <Deals nftDetails={{ ...nftDetails, account, chainId, mainnet, connector, dispatch }} />
                <Description nftDetails={nftDetails} />
                <Attributes nftDetails={nftDetails} />
              </div>
              <div className={classes.mobile}>
                <Description nftDetails={nftDetails} />
                <Details nftDetails={nftDetails} />
                <Attributes nftDetails={nftDetails} />
              </div>
            </div>
          </div>

          <PriceHistory transactionHistory={transactionHistory} />

          <div className={classes.historySection}>
            <TransactionHistory nftDetails={nftDetails} transactionHistory={transactionHistory} />
            <Metadata nftDetails={nftDetails} />
          </div>

          <div className={classes.moreSection}>
            <More params={params} collection={collection} _1of1={_1of1} />
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};

export default NFTDetail;
