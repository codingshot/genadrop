import React from "react";
import { Link } from "react-router-dom";
import cards from "./CollectionOptions-script";
import classes from "./CollectionOptions.module.css";

const CollectionOptions = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>Create</div>
      <div className={classes.description}>Create all types of NFTs, automatically indexed in our marketplace.</div>
      <div className={classes.cardDeck}>
        {cards.map((card) => (
          <Link to={card.url} className={classes.card} key={card.title}>
            <div className={classes.icon}>{card.icon}</div>
            <div className={classes.cardTitle}>{card.title}</div>
            <div className={classes.cardDescription}>{card.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionOptions;
