import React, { useEffect, useRef, useState } from "react";
import classes from "./GenadropCreatedNFTs.module.css";
import NFT1 from "../../../assets/nft-1.png";
import NFT2 from "../../../assets/nft-2.png";
import NFT3 from "../../../assets/nft-3.png";
import NFT4 from "../../../assets/nft-4.png";
import GenadropCarouselCard from "../../Genadrop-Carousel-Card/GenadropCarouselCard";
import { Link } from "react-router-dom";

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
  });

  const { cardWidth } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        NFTs created with <span>Genadrop</span>
      </div>
      <div className={classes.description}>Notable NFTs that were easily created with GenaDrop</div>
      <Link to="/create">
        <div className={classes.btn}>Create Now</div>
      </Link>
      <GenadropCarouselCard cardWidth={cardWidth} gap={16}>
        {cardArr.map((card, id) => (
          <div key={id} ref={cardRef} className={classes.card}>
            <img src={card.NFT} alt="" />
            <div className={classes.name}>{card.name}</div>
          </div>
        ))}
      </GenadropCarouselCard>
    </div>
  );
};

export default GenadropCreatedNFTs;
