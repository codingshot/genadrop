import React, { useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";

import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";

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
        <h3>1 of 1s</h3>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {singleAlgoNftsArr?.length || singleAuroraNfts?.length || singlePolygonNfts?.length ? (
        <div className={classes.wrapper}>
          {singleAlgoNftsArr?.slice(0, 10).map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {singleAuroraNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {singlePolygonNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
        </div>
      ) : !singleAlgoNftsArr && !singleAuroraNfts && !singlePolygonNfts ? (
        <NotFound />
      ) : (
        <div className={classes.wrapper}>
          {[...new Array(4)].map((id) => (
            <div key={id}>
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
