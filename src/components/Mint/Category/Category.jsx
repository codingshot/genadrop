import React from "react";
import { Link } from "react-router-dom";
import cards from "./Category-script";
import classes from "./Category.module.css";

const Category = ({ category, file }) => {
  return (
    <div className={classes.container}>
      {cards.map((card) => (
        <Link
          to={card.url}
          key={card.value}
          className={`${classes.card} ${
            card.value === category ||
            (card.value === "collection" && file?.length > 1) ||
            (card.value === "Art" && file?.length === 1 && !category)
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
