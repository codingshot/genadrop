import { useEffect, useRef, useState } from "react";
import GenadropCarouselCard from "../../Genadrop-Carousel-Card/GenadropCarouselCard";
import { chains } from "./Chains-Script";
import classes from "./Chains.module.css";

const Chains = () => {
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
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          <h3>Start Exploring Now</h3>
          <p className={classes.description}>
            Explore/List your NFTs on the next generation of multi-chains NFT trading marketplace
          </p>
        </div>
        <GenadropCarouselCard cardWidth={cardWidth} gap={16}>
          {chains.map((chain, idx) => (
            <div
              style={{ background: chain.bg, borderColor: chain.border, color: chain.color }}
              key={idx}
              ref={cardRef}
              className={classes.card}
            >
              <img src={chain.icon} alt="" />
              <div>{chain.name}</div>
            </div>
          ))}
        </GenadropCarouselCard>
      </div>
    </div>
  );
};

export default Chains;
