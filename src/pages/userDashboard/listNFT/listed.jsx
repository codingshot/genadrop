import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { GenContext } from "../../../gen-state/gen.context";
import { getSingleNftDetails, getUserBoughtNftCollection, getUserGraphNft } from "../../../utils";
import classes from "./listed.module.css";
import { fetchUserBoughtNfts } from "../../../utils/firebase";
import { polygonClient } from "../../../utils/graphqlClient";
import { GET_USER_NFT } from "../../../graphql/querries/getCollections";
import { setNotification } from "../../../gen-state/gen.actions";
import { ethers } from "ethers";

const Listed = () => {
  const { account, mainnet, dispatch } = useContext(GenContext);

  const {
    params: { nftId },
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
      if (chainId === 80001) {
        const address = ethers.utils.hexlify(account);
        const { data, error } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
        if (error) {
          return dispatch(
            setNotification({
              message: error.message,
              type: "warning",
            })
          );
        } else {
          const polygonBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
          const nft = polygonBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
          if (!nft) console.log("working not");
          else {
            handleSetState({
              nftDetails: nft,
              isLoading: false,
            });
          }
        }
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
      <img className={classes.nft} src={nftDetails.image_url} alt="" />

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Enable Email Notification</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <div className={classes.priceDescription}>
            Enter your email address in your account settings so we can let you know, when your listing sells or
            receives offers
          </div>
          <button type="button" className={classes.buy}>
            Profile Settings
          </button>
        </div>
      </div>

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Share your listing</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <img src="/assets/twitter-clear.svg" alt="" />
          <img src="/assets/facebook-clear.svg" alt="" />
          <img src="/assets/telegram.svg" alt="" />
          <img src="/assets/link.svg" alt="" />
        </div>
      </div>
      <Link
        to={
          nftDetails.collection_name
            ? `${match.url}/${Id}`
            : nftDetails.chain
            ? `/marketplace/single-mint/${nftDetails.chain}/${nftDetails.Id}`
            : `/marketplace/single-mint/${nftDetails.Id}`
        }
        className={classes.view}
      >
        <button type="button" className={classes.viewtext}>
          View Item
        </button>
      </Link>
    </div>
  );
};

export default Listed;
