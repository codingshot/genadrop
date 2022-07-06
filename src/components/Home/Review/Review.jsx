import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import GenadropCarouselCard from "../../Genadrop-Carousel-Card/GenadropCarouselCard";
import classes from "./Review.module.css";
import twitterIcon from "../../../assets/twitter/icon-twitter2.svg";
import { getFormattedDateTweets, twitterAPIURL } from "./Reviews-Script";

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
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    tweetsData: [],
  });

  const { cardWidth, tweetsData } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const formattedContent = (content) => {
    return `${content.substring(0, 140)}...`;
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, [tweetsData]);

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
      <div className={classes.heading}>
        Keep Up To Date for <span>Early Access</span>
      </div>
      <div className={classes.description}>See what the buzz about GenaDrop is on twitter.</div>
      <GenadropCarouselCard cardWidth={cardWidth} gap={16}>
        {tweetsData.map((review) => (
          <a href={review.url} target="_blank" rel="noreferrer" key={review.id} ref={cardRef} className={classes.card}>
            <div className={classes.header}>
              <img src={review.icon} alt="" className={classes.icon} />
              <div className={classes.date}>{getFormattedDateTweets(review.created_at)}</div>
              <div className={classes.domain}>{review.domain}</div>
            </div>
            {review?.media?.type === "photo" && review?.media?.url ? (
              <img src={review.media.url} alt="" className={classes.banner} />
            ) : review?.media?.url ? (
              <video className={classes.banner} src={review.media?.url} loop />
            ) : (
              ""
            )}
            <div className={classes.content}>{formattedContent(review.text)}</div>
            <div className={classes.line} />
            <div className={classes.footer}>
              <img className={classes.thumbnail} src={review.author_id.profile_image_url} alt="" />
              <div className={classes.wrapper}>
                <div className={classes.name}>{review.author_id.name}</div>
                <div className={classes.handle}>@{review.author_id.username}</div>
              </div>
            </div>
          </a>
        ))}
      </GenadropCarouselCard>
    </div>
  );
};

export default Review;
