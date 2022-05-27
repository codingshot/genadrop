import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";

import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";

const SingleNft = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts } = useContext(GenContext);

  const { url } = useRouteMatch();
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>1 of 1s</h3>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {singleAlgoNfts?.length || singleAuroraNfts?.length || singlePolygonNfts?.length ? (
        <div className={classes.wrapper}>
          {singleAlgoNfts.slice(0, 10).map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {singleAuroraNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {singlePolygonNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
        </div>
      ) : !singleAlgoNfts && !singleAuroraNfts && !singlePolygonNfts ? (
        <h1 className={classes.noResult}> No Results Found</h1>
      ) : (
        <div className={classes.wrapper}>
          {[...new Array(5)]
            .map((_, idx) => idx)
            .map((id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SingleNft;
