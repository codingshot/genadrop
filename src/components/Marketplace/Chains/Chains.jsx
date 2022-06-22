import { useEffect, useRef, useState } from "react";
import GenadropCarouselCard from "../../Genadrop-Carousel-Card/GenadropCarouselCard";
import { chains } from "./Chains-Script";
import classes from "./Chains.module.css";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

const Chains = () => {
  const cardRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const { url } = useRouteMatch();

  const [state, setState] = useState({
    cardWidth: 0,
  });

  const { cardWidth } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleClick = (name, isComingSoon) => {
    if (isComingSoon) return;
    history.push(`${url}/collections/${`?chain=${name}`}`);
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
              onClick={() => handleClick(chain.name, chain.isComingSoon)}
              style={{ background: chain.bg, borderColor: chain.border, color: chain.color }}
              key={idx}
              ref={cardRef}
              className={`${classes.card} ${chain.isComingSoon && classes.inActive}`}
            >
              <img src={chain.icon} alt="" />
              <div>{chain.name}</div>
              {chain.isComingSoon ? <div className={classes.soon}>coming soon</div> : null}
            </div>
          ))}
        </GenadropCarouselCard>
      </div>
    </div>
  );
};

export default Chains;
