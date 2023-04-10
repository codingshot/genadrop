import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Review.module.css";
import twitterIcon from "../../../assets/twitter/icon-twitter2.svg";
import { getEnv } from '../../../env';

import displayShadow from "../../../assets/home-display-shadow.png";
import { twitterAPIURL } from "./Reviews-Script";
const reviews = [
  "1614492280743948289",
  "1611711201695911937",
  "1611617018394087426",
  "1610806631864098816",
  "1607872121480556545",
  "1594023676302823424",
  "1601225567608590336",
  "1600045898595082240",
  "1593453268772048896",
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

      .get(`https://cors-anywhere-wjlt.onrender.com/${twitterAPIURL(reviews)}`, {
        headers: {
          Authorization: `Bearer ${getEnv('REACT_APP_TWITTER_ACCESS_TOKEN')}`,
        },
      })
      .then((data) => {
        console.log("XXX", data);
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
          <span>Some people think we’re</span> <span className={classes.accent}>Pretty Cool.</span>
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
