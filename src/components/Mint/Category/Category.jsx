import React from "react";
import { Link } from "react-router-dom";
import cards from "./Category-script";
import classes from "./Category.module.css";

const Category = ({ category, file, params }) => {
  return (
    <div className={classes.container}>
      {cards.map((card) => (
        <Link
          to={card.url}
          key={card.value}
          className={`${classes.card} ${
            card.value === category ||
            (card.value === "collection" && file?.length > 1) ||
            (card.value === "audio" && params.mintId === "Audio File" && !category) ||
            (card.value === "video" && params.mintId === "Video File" && !category) ||
            (card.value === "tweet" && params.mintId === "tweet" && !category) ||
            (card.value === "ai" && params.mintId === "ai" && !category) ||
            (card.value === "Art" &&
              file?.length === 1 &&
              !category &&
              params.mintId !== "Audio File" &&
              params.mintId !== "Video File") ||
            (card.value === "ipfs" && params.mintId === "ipfs" && !category)
              ? classes.active
              : ""
          }`}
        >
          <div className={classes.icon}>{card.icon}</div>
          <div className={classes.text}>
            <div className={classes.title}>{card.title} </div>
            <div className={classes.desc}>{card.description} </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Category;
