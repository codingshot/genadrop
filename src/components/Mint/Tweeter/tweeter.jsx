import moment from "moment";
import classes from "./tweeter.module.css";

const Tweeter = ({ tweet }) => {
  return (
    <div className={classes.tweetContainer} id="tweetContainer">
      <div className={classes.tweetHeader}>
        <img src={tweet.author_id.profile_image_url} alt="" />
        <div className={classes.headerRight}>
          <span className={classes.username}>{tweet.author_id.name}</span>
          <span className={classes.usertag}>@{tweet.author_id.username}</span>
        </div>
      </div>
      <div className={classes.description}>{tweet.text}</div>
      <div className={classes.content}>
        {tweet.media.type === "video" ? (
          <video src={tweet.media.url} className={classes.content} controls muted crossOrigin="anonymous" />
        ) : tweet.media.type === "image" ? (
          <img src={tweet.media.url} className={classes.content} crossOrigin="anonymous" />
        ) : (
          ""
        )}
      </div>
      <div className={classes.tweetFooter}>
        <div className={classes.date}>{moment(tweet.created_at).format("hh:mm a · MM Do, YYYY")}</div>
      </div>
    </div>
  );
};

export default Tweeter;
