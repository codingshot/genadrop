import React, { useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";

import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import DateFilter from "../Date-Filter/DateFilter";

const SingleNft = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const { url } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    window.localStorage.activeAlgoNft = null;
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.headingWrapper}>
          <h3>1 of 1s</h3>
          {/* <DateFilter /> */}
        </div>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {singleAlgoNftsArr?.length || singleAuroraNfts?.length || singlePolygonNfts?.length ? (
        <GenadropCarouselScreen cardWidth={20 * 16} gap={16}>
          {[
            ...(singleAlgoNftsArr || [])
              ?.filter((_, idx) => idx < 3)
              .map((nft, idx) => <NftCard useWidth="20em" key={idx} nft={nft} listed />),
            ...(singleAuroraNfts || [])
              ?.filter((_, idx) => idx < 3)
              .map((nft, idx) => <NftCard useWidth="20em" key={idx + 10} nft={nft} listed />),
            ...(singlePolygonNfts || [])
              ?.filter((_, idx) => idx < 3)
              .map((nft, idx) => <NftCard useWidth="20em" key={idx + 20} nft={nft} listed />),
          ]}
        </GenadropCarouselScreen>
      ) : !singleAlgoNftsArr && !singleAuroraNfts && !singlePolygonNfts ? (
        <NotFound />
      ) : (
        <div className={classes.wrapper}>
          {[...new Array(4)].map((_, idx) => (
            <div key={idx}>
              <Skeleton count={1} height={250} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleNft;
