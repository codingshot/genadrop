import React from "react";
import TweetEmbed from "react-tweet-embed";
import classes from "./Review.module.css";

const Review = () => {
  const reviews = [
    "1473516385691062273", // near announcement
    //     "1484327197854736391",
    "1484447708668649475",
    "1486289656203427845",
    //     "1473516385691062273",
    "1507735586190381056", // feedback form tweet
  ];

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        Keep Up To Date for <span>Early Access</span>
      </div>
      <div className={classes.description}>See what the buzz about GenaDrop is on twitter.</div>

      <div className={classes.review}>
        {reviews.map((tweet) => (
          <span key={tweet} className={classes.tweet}>
            <TweetEmbed id={tweet} placeholder="loading" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Review;
