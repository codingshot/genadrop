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
        {cards.map((type) => (
          <Link to={type.url} className={classes.typeCard} key={type.title}>
            <div className={classes.icon}>{type.icon}</div>
            <div className={classes.content}>
              <div className={classes.typeIcon}>{type.footerIcon}</div>
              <div className={classes.text}>
                <div className={classes.cardTitle}>{type.title}</div>
                <div className={classes.cardDesc}>{type.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionOptions;
