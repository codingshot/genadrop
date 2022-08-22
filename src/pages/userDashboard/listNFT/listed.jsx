import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { GenContext } from "../../../gen-state/gen.context";
import { getSingleNftDetails, getUserBoughtNftCollection, getUserGraphNft } from "../../../utils";
import classes from "./listed.module.css";
import { fetchUserBoughtNfts } from "../../../utils/firebase";
import { ethers } from "ethers";
import telegram from "../../../assets/blue-telegram.svg";
import twitterIcon from "../../../assets/blue-twitter.svg";
import facebookIcon from "../../../assets/blue-facebook.svg";
import linktree from "../../../assets/linked-tree.svg";
import {
  auroraUserData,
  celoUserData,
  getCeloNFTToList,
  getPolygonNFTToList,
  polygonUserData,
} from "../../../renderless/fetch-data/fetchUserGraphData";

const Listed = () => {
  const { account, mainnet, dispatch } = useContext(GenContext);

  const {
    params: { nftId, url },
  } = useRouteMatch();
  const { singleNfts, chainId } = useContext(GenContext);
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: true,
  });
  const { nftDetails, isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    (async function getUserCollection() {
      if (chainId === 80001 || chainId === 137) {
        const [nft] = await polygonUserData(nftId);
        if (!nft) history.push("/");
        else {
          handleSetState({
            nftDetails: nft,
            isLoading: false,
          });
        }
      } else if (chainId === 44787 || chainId === 42220) {
        const [nft] = await celoUserData(nftId);
        if (!nft) history.push("/");
        handleSetState({
          nftDetails: nft,
          isLoading: false,
        });
      } else if (chainId === 1313161555 || chainId === 1313161554) {
        const [nft] = await auroraUserData(nftId);
        if (!nft) history.push("/");
        handleSetState({
          nftDetails: nft,
          isLoading: false,
        });
      } else {
        const userNftCollections = await fetchUserBoughtNfts(account);
        const result = await getUserBoughtNftCollection(mainnet, userNftCollections);

        const nft = result.filter((NFT) => String(NFT.Id) === nftId)[0];
        if (!nft) history.push("/");
        handleSetState({ nftDetails: nft, isLoading: false });
      }
    })();
    document.documentElement.scrollTop = 0;
  }, []);

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
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={nftDetails?.image_url} alt="" />

      <div className={classes.nftId}>
        Share
        <div className={classes.detailContent}>
          <img src={twitterIcon} alt="" />
          <img src={facebookIcon} alt="" />
          <img src={telegram} alt="" />
          <img src={linktree} alt="" />
        </div>
      </div>
      <Link
        to={
          nftDetails.collection_name
            ? `${url}/${nftDetails.Id}`
            : nftDetails.chain
            ? `/marketplace`
            : `/marketplace/1of1/${nftDetails.Id}`
        }
        className={classes.view}
      >
        <button type="button" className={classes.viewtext}>
          Go to Marketplace
        </button>
      </Link>
    </div>
  );
};

export default Listed;
