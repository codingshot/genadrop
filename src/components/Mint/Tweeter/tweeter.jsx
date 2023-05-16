/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import moment from "moment";
import classes from "./tweeter.module.css";

const Tweeter = ({ tweet }) => {
  return (
    <div className={`${classes.tweetContainer} ${!tweet.lightTheme && classes.dark}`} id="tweetContainer">
      <div className={classes.tweetHeader}>
        <img src={tweet.author_id.profile_image_url} alt="" crossOrigin="anonymous" />
        <div className={classes.headerRight}>
          <span className={`${classes.username} ${!tweet.lightTheme && classes.dark}`}>{tweet.author_id.name}</span>
          <span className={classes.usertag}>@{tweet.author_id.username}</span>
        </div>
      </div>
      <div className={`${classes.description} ${!tweet.lightTheme && classes.dark}`}>{tweet.text}</div>
      <div className={classes.contents}>
        {tweet?.media?.map((m) => {
          return m?.type === "video" ? (
            <video
              src={m.url}
              className={classes.content}
              style={{ width: `${18 / tweet.media.length}em` }}
              controls
              muted
              crossOrigin="anonymous"
            />
          ) : m?.type === "photo" ? (
            <img
              src={m?.url}
              className={classes.content}
              style={{ width: `${18 / tweet.media.length}em` }}
              crossOrigin="anonymous"
            />
          ) : (
            ""
          );
        })}
      </div>
      <div className={classes.tweetFooter}>
        <div className={classes.date}>{moment(tweet.created_at).format("hh:mm a · MM Do, YYYY")}</div>
      </div>
    </div>
  );
};

export default Tweeter;
