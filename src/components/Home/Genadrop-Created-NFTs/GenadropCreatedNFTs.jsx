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
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts, singleNearNfts, mainnet } =
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

  useEffect(() => {
    const goodIds = [
      "genadrop-contract.nftgen.near1664562603103",
      "0x5ce2deee9b495b5db2996c81c16005559393efb810815",
      "0x436aeceaeec57b38a17ebe71154832fb0faff87823108",
      "0x5ce2deee9b495b5db2996c81c16005559393efb8238140",
    ];

    const singles = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
      ...(singleNearNfts || []),
    ];

    const goodTesnet = ["genadrop-test.mpadev.testnet1663492551707"];

    // singles = singles.filter((nft) => !featturedNFTs.includes(nft.Id));
    // singles = shuffle(singles);
    // const featuredNFT1 = [...(singleNearNfts || []), ...(singleCeloNfts || [])].filter((nft) =>
    //   featturedNFTs.includes(nft.Id)
    // );

    if (mainnet) handleSetState({ singles: [...singles.filter((e) => goodIds.includes(e.Id))] });
    else handleSetState({ singles: [...singles.filter((e) => goodTesnet.includes(e.Id))] });
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
