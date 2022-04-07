import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getSingleNfts } from "../../../utils";
import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";

const SingleNft = () => {
  const [state, setState] = useState({
    allSingleNfts: [],
  });
  const { allSingleNfts } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { singleNfts, mainnet } = useContext(GenContext);
  const { url } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    (async function getResult() {
      if (singleNfts?.length) {
        const allSingleNFTs = await getSingleNfts(mainnet, singleNfts);
        handleSetState({ allSingleNfts: allSingleNFTs });
      } else {
        handleSetState({ allSingleNfts: null });
      }
    })();
  }, [singleNfts]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>1 of 1s</h3>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {allSingleNfts?.length ? (
        <div className={classes.wrapper}>
          {allSingleNfts.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
        </div>
      ) : !allSingleNfts ? (
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
