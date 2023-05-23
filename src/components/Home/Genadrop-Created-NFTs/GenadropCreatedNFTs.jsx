/* eslint-disable react/no-array-index-key */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./GenadropCreatedNFTs.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { getFeaturedAvalancheNft, nearFeaturedNfts } from "../../../renderless/fetch-data/fetchUserGraphData";

const GenadropCreatedNFTs = () => {
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    singles: [],
  });

  const { singles } = state;
  useEffect(() => {}, []);
  const { mainnet } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, []);
  const history = useHistory();

  useEffect(() => {
    if (mainnet) {
      const goodIds = [
        "genadrop-contract.nftgen.near1664562603103",
        "0x5ce2deee9b495b5db2996c81c16005559393efb810815",
        "0x436aeceaeec57b38a17ebe71154832fb0faff87823108",
        "0x5ce2deee9b495b5db2996c81c16005559393efb8238140",
      ];
      Promise.all([
        getFeaturedAvalancheNft(goodIds[1]),
        getFeaturedAvalancheNft(goodIds[2]),
        getFeaturedAvalancheNft(goodIds[3]),
      ]).then((data) => {
        handleSetState({ singles: [...data.flat()] });
      });
    } else {
      Promise.all([nearFeaturedNfts("genadrop-test.mpadev.testnet1663492551707")]).then((data) => {
        handleSetState({ singles: [...data.flat()] });
      });
    }
  }, []);

  const handlePreview = (chain, Id) => {
    if (chain) {
      history.push(`/marketplace/1of1/${chain}/${Id}`);
    } else {
      history.push(`/marketplace/1of1/${Id}`);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <span>NFTs created with</span> <span className={classes.accent}>Genadrop</span>
      </div>
      <div className={classes.description}>Notable NFTs that were easily created with GenaDrop</div>
      <Link to="/create">
        <div className={classes.btn}>Create Now</div>
      </Link>
      {singles.length == 0 ? (
        <div className={classes.loader}>
          <div className={classes.load}>
            <Skeleton count={1} height={220} />
            <br />
            <Skeleton count={1} height={40} />
          </div>
          <div className={classes.load}>
            <Skeleton count={1} height={220} />
            <br />
            <Skeleton count={1} height={40} />
          </div>
          <div className={classes.load}>
            <Skeleton count={1} height={220} />
            <br />
            <Skeleton count={1} height={40} />
          </div>
          <div className={classes.load}>
            <Skeleton count={1} height={220} />
            <br />
            <Skeleton count={1} height={40} />
          </div>
        </div>
      ) : (
        <div className={classes.cardGrid}>
          {singles.map((card, id) => (
            <div onClick={() => handlePreview(card.chain, card.Id)} key={id} className={classes.card}>
              <div className={classes.imgContainer}>
                <img src={card?.image_url} alt="" />
              </div>
              {/* <div className={classes.name}>{card?.name}</div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenadropCreatedNFTs;
