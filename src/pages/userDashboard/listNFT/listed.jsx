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
import { getCeloNFTToList, getPolygonNFTToList } from "../../../renderless/fetch-data/fetchUserGraphData";
import { socialLinks } from "../../../components/footer/footer-script";

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
      const address = ethers.utils.hexlify(account);
      console.log(account);
      if (chainId === 80001 || chainId === 137) {
        const nft = await getPolygonNFTToList(address, nftId);
        if (!nft) history.push("/");
        else {
          handleSetState({
            nftDetails: nft,
            isLoading: false,
          });
        }
      } else if (chainId === 44787 || chainId === 42220) {
        const nft = await getCeloNFTToList(address, nftId);
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
          {/* <img src="/assets/twitter.svg" alt="" />
          <img src="/assets/facebook.svg" alt="" />
          <img src="/assets/icon-discord-accent.svg" alt="" />
          <img src="/assets/link.svg" alt="" /> */}
          {socialLinks.map((social, idx) => (
            <a key={idx} className={classes.icon} href={social.link} target="_blank" rel="noopener noreferrer">
              <img src={social.icon} alt={`Minority Programmers ${social.name}`} />
            </a>
          ))}
        </div>
      </div>
      <Link
        to={
          nftDetails.collection_name
            ? `${url}/${nftDetails.Id}`
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
