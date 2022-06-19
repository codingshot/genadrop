import { useEffect, useRef, useState } from "react";
import classes from "./GenadropCreatedNFTs.module.css";
import NFT1 from "../../../assets/nft-1.png";
import NFT2 from "../../../assets/nft-2.png";
import NFT3 from "../../../assets/nft-3.png";
import NFT4 from "../../../assets/nft-4.png";
import GenadropCarousel from "../../Genadrop-Carousel/GenadropCarousel";

const cardArr = [
  {
    NFT: NFT1,
    name: "Minority x H.E.R",
  },
  {
    NFT: NFT2,
    name: "Minority Drop",
  },
  {
    NFT: NFT3,
    name: "Minority x H.E.R",
  },
  {
    NFT: NFT4,
    name: "Minority x H.E.R",
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
      <div className={classes.description}>Browse notable NFTs created with Genadrop NFT Creator</div>
      <GenadropCarousel cardWidth={cardWidth} gap={16}>
        {cardArr.map((card, id) => (
          <div key={id} ref={cardRef} className={classes.card}>
            <img src={card.NFT} alt="" />
            <div className={classes.name}>{card.name}</div>
          </div>
        ))}
      </GenadropCarousel>
    </div>
  );
};

export default GenadropCreatedNFTs;
