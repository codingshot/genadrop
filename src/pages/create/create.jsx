import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./create.module.css";
import cards from "./Create-script";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";

const Create = () => {
  const [state, setState] = useState({
    active: false,
  });

  const { active } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  return (
    <div className={classes.container}>
      <div className={classes.title}>Create</div>
      <div className={classes.description}>Create all types of NFTs, automatically indexed in our marketplace.</div>
      <div className={classes.cardDeck}>
        {cards.slice(0, 6).map((card) => (
          <Link to={card.url} className={classes.card} key={card.title}>
            <div className={classes.icon}>{card.icon}</div>
            <div className={classes.cardTitle}>{card.title}</div>
            <div className={classes.cardDescription}>{card.description}</div>
          </Link>
        ))}
      </div>
      <div className={`${classes.extra} ${active ? classes.active : ""}`}>
        {cards.slice(6).map((card) => (
          <Link to={card.url} className={classes.card} key={card.title}>
            <div className={classes.icon}>{card.icon}</div>
            <div className={classes.cardTitle}>{card.title}</div>
            <div className={classes.cardDescription}>{card.description}</div>
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

export default Create;
