import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton } from "react-share";
import CopyToClipboard from "react-copy-to-clipboard";
import { GenContext } from "../../gen-state/gen.context";
import { getSingleNftDetails } from "../../utils";
import classes from "./listed.module.css";
import telegram from "../../assets/blue-telegram.svg";
import twitterIcon from "../../assets/blue-twitter.svg";
import facebookIcon from "../../assets/blue-facebook.svg";
import linktree from "../../assets/linked-tree.svg";

const Listed = () => {
  // const { account, connector } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();
  const { singleNfts } = useContext(GenContext);

  const [state, setState] = useState({
    isLoading: true,
  });
  const { nftDetails, isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    const nft = singleNfts.filter((singleNft) => String(singleNft.id) === nftId)[0];

    (async function getNftDetails() {
      const nftdetails = await getSingleNftDetails(nft);

      handleSetState({ nftDetails: nftdetails, isLoading: false });
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
          <TwitterShareButton url={window.location.href.replace("list", "preview")}>
            <img src={twitterIcon} alt="Twitter-icon" />
          </TwitterShareButton>
          <FacebookShareButton url={window.location.href.replace("list", "preview")}>
            <img src={facebookIcon} alt="Facebook-icon" />
          </FacebookShareButton>
          <TelegramShareButton url={window.location.href.replace("list", "preview")}>
            <img src={telegram} alt="Telegram-icon" />
          </TelegramShareButton>
          <CopyToClipboard text={window.location.href.replace("list", "preview")}>
            <img src={linktree} alt="CopyT-icon" />
          </CopyToClipboard>
        </div>
      </div>
      <button type="button" className={classes.view}>
        View Item
      </button>
    </div>
  );
};

export default Listed;
