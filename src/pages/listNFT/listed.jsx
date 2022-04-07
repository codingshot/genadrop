import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useRouteMatch, Link } from "react-router-dom";
import classes from "./listed.module.css";

const Listed = ({ location }) => {
  const { image_url = "no image found!" } = location.state || {};

  const {
    params: { userId },
  } = useRouteMatch();

  const [state, setState] = useState({
    isLoading: true,
  });
  const { isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    handleSetState({ isLoading: false });
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

  const icons = [
    {
      icon: "/assets/facebook-clear.svg",
      link: "https://www.facebook.com/mpa",
    },
    {
      icon: "/assets/telegram.svg",
      link: "https://t.co/XUHAJEPLoA",
    },
    {
      icon: "/assets/twitter-clear.svg",
      link: "https://twitter.com/minorityprogram",
    },
  ];
  return (
    <div className={classes.container}>
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={image_url} alt="" />

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
          <Link to={`/me/${userId}/settings`}>
            <button type="button" className={classes.buy}>
              Profile Settings
            </button>
          </Link>
        </div>
      </div>

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Share your listing</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          {icons.map((icon) => (
            <a href={icon.link} target="_blank" rel="noreferrer">
              <img src={icon.icon} alt="" />
            </a>
          ))}
        </div>
      </div>
      <button type="button" className={classes.view}>
        View Item
      </button>
    </div>
  );
};

export default Listed;
