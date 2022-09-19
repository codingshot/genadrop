import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./GenadropCreatedNFTs.module.css";
import NFT1 from "../../../assets/nft-1.png";
import NFT2 from "../../../assets/nft-2.png";
import NFT3 from "../../../assets/nft-3.png";
import NFT4 from "../../../assets/nft-4.png";
import GenadropCarouselCard from "../../Genadrop-Carousel-Card/GenadropCarouselCard";
import { Link, useHistory } from "react-router-dom";
import { GenContext } from "../../../gen-state/gen.context";
import { shuffle } from "../../../pages/Marketplace/Marketplace-script";

const cardArr = [
  {
    NFT: NFT1,
    name: "#Her_1046",
  },
  {
    NFT: NFT2,
    name: "#Lad_2378",
  },
  {
    NFT: NFT3,
    name: "#vase_175",
  },
  {
    NFT: NFT4,
    name: "#Nat_002",
  },
];

const GenadropCreatedNFTs = () => {
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    singles: [],
  });

  const { cardWidth, singles } = state;
  useEffect(() => {}, []);
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts } = useContext(GenContext);
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
    let singles = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
    ];
    singles = shuffle(singles);
    console.log(singles.slice(0, 4));
    handleSetState({ singles: singles.slice(0, 4) });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts]);

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
      <GenadropCarouselCard cardWidth={cardWidth} gap={16}>
        {singles.map((card, id) => (
          <div onClick={() => handlePreview(card.chain, card.Id)}>
            <div key={id} ref={cardRef} className={classes.card}>
              <div className={classes.imgContainer}>
                <img src={card?.image_url} alt="" />
              </div>
              <div className={classes.name}>{card?.name}</div>
            </div>
          </div>
        ))}
      </GenadropCarouselCard>
    </div>
  );
};

export default GenadropCreatedNFTs;
