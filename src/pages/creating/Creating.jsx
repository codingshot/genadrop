import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import classes from "./Creating.module.css";
import cards from "./Creating-script";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";
import { GenContext } from "../../gen-state/gen.context";
import { setNotification } from "../../gen-state/gen.actions";

const Creating = () => {
  const history = useHistory();

  const { dispatch } = useContext(GenContext);

  const [state, setState] = useState({
    active: false,
  });

  const { active } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  /* regular expression 
  containing some mobile devices keywords 
  to search it in details string */
  const details = navigator?.userAgent;

  const regexp = /android|iphone|kindle|ipad/i;

  const isMobileDevice = regexp.test(details);

  const handleRedirect = (card) => {
    if (card.title === "Doubletake") {
      if (isMobileDevice) {
        history.push(card.url);
      } else {
        dispatch(
          setNotification({
            message: "This feature is only accessible to mobile devices.",
            type: "warning",
          })
        );
      }
    } else {
      history.push(card.url);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Create</div>
      <div className={classes.description}>Create all types of NFTs, automatically indexed in our marketplace.</div>
      <div className={classes.cardDeck}>
        {cards.slice(0, 6).map((card) => (
          <div onClick={() => handleRedirect(card)} to={card.url} className={classes.card} key={card.title}>
            <div className={classes.icon}>{card.icon}</div>
            <div className={classes.cardTitle}>{card.title}</div>
            <div className={classes.cardDescription}>{card.description}</div>
          </div>
        ))}
      </div>
      <div className={`${classes.extra} ${active ? classes.active : ""}`}>
        {cards.slice(6).map((card) => (
          <Link to={card.url} className={`${classes.card} ${card.comingSoon ? classes.noDrop : ""}`} key={card.title}>
            <div className={classes.icon}>{card.icon}</div>
            <div className={classes.cardTitle}>{card.title}</div>
            <div className={classes.cardDescription}>{card.description}</div>
            {card.comingSoon ? <div className={classes.comingSoon}>Coming Soon!</div> : ""}
          </Link>
        ))}
      </div>
      <div
        className={`${classes.moreBTN} ${active ? classes.active : ""}`}
        onClick={() => handleSetState({ active: !active })}
      >
        {active ? "See less" : "See more"} <DownArrow />
      </div>
    </div>
  );
};

export default Creating;
