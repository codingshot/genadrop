import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./GenadropCreatedNFTs.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { shuffle } from "../../../pages/Marketplace/Marketplace-script";

const GenadropCreatedNFTs = () => {
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    singles: [],
  });

  const { singles } = state;
  useEffect(() => {}, []);
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts, singleNearNfts } =
    useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, []);
  const history = useHistory();

  const featturedNFTs =
    process.env.REACT_APP_ENV_STAGING === "true" ? [] : ["genadrop-contract.nftgen.near1664317298336"];

  useEffect(() => {
    let singles = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
    ];
    singles = singles.filter((nft) => !featturedNFTs.includes(nft.Id));
    singles = shuffle(singles);
    const featuredNFT1 = [...(singleNearNfts || []), ...(singleCeloNfts || [])].filter((nft) =>
      featturedNFTs.includes(nft.Id)
    );
    handleSetState({ singles: [...featuredNFT1, ...singles.slice(0, 4 - featturedNFTs.length)] });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts, singleNearNfts]);

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
              <div className={classes.name}>{card?.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenadropCreatedNFTs;
