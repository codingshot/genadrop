import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton } from "react-share";
import CopyToClipboard from "react-copy-to-clipboard";
import classes from "./listed.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import supportedChains from "../../../utils/supportedChains";
import { getUserBoughtNftCollection } from "../../../utils";
import { auroraUserData, celoUserData, polygonUserData } from "../../../renderless/fetch-data/fetchUserGraphData";
import { fetchUserBoughtNfts } from "../../../utils/firebase";
import telegram from "../../../assets/blue-telegram.svg";
import twitterIcon from "../../../assets/blue-twitter.svg";
import facebookIcon from "../../../assets/blue-facebook.svg";
import linktree from "../../../assets/linked-tree.svg";

const Listed = () => {
  const { account, mainnet } = useContext(GenContext);

  const {
    params: { nftId, url },
  } = useRouteMatch();
  const { chainId } = useContext(GenContext);
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
      if (supportedChains[chainId].chain === "Polygon") {
        const [nft] = await polygonUserData(nftId);
        if (!nft) history.push("/");
        else {
          handleSetState({
            nftDetails: nft,
            isLoading: false,
          });
        }
      } else if (supportedChains[chainId].chain === "Celo") {
        const [nft] = await celoUserData(nftId);
        if (!nft) history.push("/");
        handleSetState({
          nftDetails: nft,
          isLoading: false,
        });
      } else if (supportedChains[chainId].chain === "Aurora") {
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
  // /marketplace/1of1/1313161555/0x97e9d4c3d547d8ebc46dd32ea9e7f745e5a408e9192177
  // marketplace/1of1/44787/0x990fbe6231bb75c7782afaf6570a7a5be8fe791218828
  // marketplace/1of1/80001/0x5d05fe74a923b0e2e50ef08e434ac8fa6c76fe71122197
  // marketplace/1of1/4160/95323884
  const shareURL = nftDetails?.collection_name
    ? `${url}/${nftDetails?.Id}`
    : `/marketplace/1of1/${nftDetails?.chain}/${nftDetails?.Id}`;
  return (
    <div className={classes.container}>
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={nftDetails?.image_url} alt="" />

      <div className={classes.nftId}>
        Share
        <div className={classes.detailContent}>
          <TwitterShareButton url={shareURL}>
            <img src={twitterIcon} alt="Twitter-icon" />
          </TwitterShareButton>
          <FacebookShareButton url={shareURL}>
            <img src={facebookIcon} alt="Facebook-icon" />
          </FacebookShareButton>
          <TelegramShareButton url={shareURL}>
            <img src={telegram} alt="Telegram-icon" />
          </TelegramShareButton>
          <CopyToClipboard text={shareURL}>
            <img src={linktree} alt="CopyT-icon" />
          </CopyToClipboard>
        </div>
      </div>
      <Link to={shareURL} className={classes.view}>
        <button type="button" className={classes.viewtext}>
          Go to Marketplace
        </button>
      </Link>
    </div>
  );
};

export default Listed;
