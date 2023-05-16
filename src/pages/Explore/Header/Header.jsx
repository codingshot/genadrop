/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import bannerImg from "../../../assets/explore-banner2.svg";
import listIcon from "../../../assets/icon-list.svg";
import stackIcon from "../../../assets/icon-stack.svg";
import tradeIcon from "../../../assets/icon-trade.svg";
import supportedChains from "../../../utils/supportedChains";
import { getFormatedPrice } from "../../../utils";
import { readUserProfile } from "../../../utils/firebase";
import Copy from "../../../components/copy/copy";
import { breakAddress } from "../../../components/wallet/wallet-script";
import discordIcon from "../../../assets/icon-discord-blue.svg";
import twitterIcon from "../../../assets/icon-twitter-blue.svg";

const linkIcons = {
  discord: discordIcon,
  twitter: twitterIcon,
};

const Header = ({ collection, getHeight }) => {
  const { name, owner, description, nfts, image_url, chain, price } = collection;
  const volumeTraded = 0;
  const domMountRef = useRef(false);
  const headerRef = useRef(null);
  const [state, setState] = useState({
    usdValue: 0,
    UsdVolumeValue: 0,
    user: null,
    links: [],
  });

  const { usdValue, UsdVolumeValue, user, links } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    handleSetState({ usdValue: Number(value) * Number(price), UsdVolumeValue: Number(volumeTraded) * Number(price) });
  };

  const getUser = async () => {
    const user = await readUserProfile(owner);
    const links = [];
    const link = {};
    if (user.twitter) {
      link.url = `https://twitter.com/${user.twitter}`;
      link.icon = linkIcons.twitter;
      links.push(link);
    } else if (links.discord) {
      link.url = `https://discord.com/users/${user.discord}`;
      link.icon = linkIcons.discord;
      links.push(link);
    }
    handleSetState({ user, links });
  };

  useEffect(() => {
    getUsdValue();
    getUser();
  }, [collection]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (domMountRef.current) {
        const res = headerRef.current?.getBoundingClientRect().height;
        getHeight(res + 100);
      } else {
        domMountRef.current = true;
      }
    });
    getHeight(400);
  }, []);

  if (!collection) return null;

  return (
    <div ref={headerRef} className={classes.container}>
      <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.innerContainer}>
        <div className={classes.wrapper}>
          <img className={classes.thumbnail} src={image_url} alt="" />
          <div className={classes.linksAndCollectionDetailWrapper}>
            <div className={classes.collectionDetail}>
              <div className={classes.nameAndChainWrapper}>
                <div className={classes.name}>{name}</div>
                <img className={classes.chain} src={supportedChains[chain]?.icon} alt="" />
              </div>
              <div className={classes.creator}>
                <p>Created by</p>
                <div className={classes.accent}>
                  <Link to={`/profile/${chain}/${owner}`}> {(user && user.username) || breakAddress(owner)}</Link>{" "}
                  <Copy message={owner} />
                </div>
              </div>
            </div>

            <div className={classes.socialLinks}>
              {links.map((link, idx) => (
                <a key={idx} className={classes.link} href={link.url}>
                  <img src={link.icon} alt="" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.innerContainer_2}>
        <div className={classes.wrapper_2}>
          <div className={classes.description}>{description}</div>
          <div className={classes.statsContainer}>
            <div className={classes.statWrapper}>
              <img src={stackIcon} alt="" />
              <div className={classes.details}>
                <div className={classes._1}>FLOOR PRICE</div>
                <div className={classes._2}>
                  <span className={classes.accent}>{Number(price).toFixed(4)}</span>{" "}
                  <span className={classes.accent}>{supportedChains[chain].symbol}</span>{" "}
                  <span>{`$${usdValue.toFixed(4)}`}</span>
                </div>
              </div>
            </div>

            <div className={classes.statWrapper}>
              <img src={tradeIcon} alt="" />
              <div className={classes.details}>
                <div className={classes._1}>TOTAL VOLUME TRADED</div>
                <div className={classes._2}>
                  <span className={classes.accent}>{volumeTraded}</span>{" "}
                  <span className={classes.accent}>{supportedChains[chain].symbol}</span>{" "}
                  <span>{`$${UsdVolumeValue}`}</span>
                </div>
              </div>
            </div>

            <div className={classes.statWrapper}>
              <img src={listIcon} alt="" />
              <div className={classes.details}>
                <div className={classes._1}>TOTAL NFT COUNT</div>
                <div className={classes._2}>
                  <span className={classes.accent}>{nfts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
