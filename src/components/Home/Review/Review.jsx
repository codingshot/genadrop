import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Review.module.css";
import twitterIcon from "../../../assets/twitter/icon-twitter2.svg";
import { twitterAPIURL } from "./Reviews-Script";
import displayShadow from "../../../assets/home-display-shadow.png";

const reviews = [
  "1486289656203427845",
  "1484447708668649475",
  "1473516385691062273",
  "1507735586190381056",
  "1542292827203284998",
  "1541303812979400704",
  "1539289304853360644",
];

const Review = () => {
  const [state, setState] = useState({
    cardWidth: 0,
    tweetsData: [],
  });

  const { tweetsData } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const formattedContent = (content) => {
    return `${content.substring(0, 140)}...`;
  };

  useEffect(() => {
    axios
      .get(`https://cors-demo-app1.herokuapp.com/${twitterAPIURL(reviews)}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TWITTER_ACCESS_TOKEN}`,
        },
      })
      .then((data) => {
        let tweets = data.data;
        const attachments = {};
        const users = {};
        data.data.includes.users.forEach((element) => {
          users[element.id] = {
            id: element.id,
            username: element.username,
            profile_image_url: element.profile_image_url,
            name: element.name,
          };
        });
        data.data.includes.media.forEach((element) => {
          let img;
          if (element?.type === "photo") {
            img = element?.url;
          } else {
            img = element.variants[0]?.url;
          }
          attachments[element.media_key] = {
            media_key: element.media_key,
            type: element?.type,
            url: img,
          };
        });
        tweets = data.data.data.map((tweet) => {
          return {
            id: tweet.id,
            media: attachments[tweet?.attachments?.media_keys[0]],
            author_id: users[tweet?.author_id],
            created_at: tweet?.created_at,
            text: tweet.text?.split("https://t.co/")[0],
            url: `https://twitter.com/${users[tweet?.author_id]?.username}/status/${tweet.id}`,
            domain: "Twitter Web App",
            icon: twitterIcon,
            links: tweet.entities?.urls?.filter((link) => !link.display_url.includes("pic.twitter"))[0],
          };
        });
        tweets.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        handleSetState({ tweetsData: tweets });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          Some people think we’re <span>Pretty Cool.</span>
        </div>
        <div className={classes.description}>See what people are saying about GenaDrop.</div>
        <div className={classes.display}>
          <div className={classes.row}>
            {tweetsData.map((review) => (
              <a key={review.id} href={review.url} target="_blank" rel="noreferrer">
                <div className={classes.reviewCard}>
                  <div className={classes.review}>{formattedContent(review.text)} </div>
                  <div className={classes.profile}>
                    <img src={review.author_id.profile_image_url} className={classes.thumbnail} alt={review.url} />
                    <div className={classes.innerContainer}>
                      <div className={classes.name}>{review.author_id.name}</div>
                      <div className={classes.handle}>@{review.author_id.username}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <img className={classes.shadow} src={displayShadow} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Review;
