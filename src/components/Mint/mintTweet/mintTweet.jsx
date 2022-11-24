import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";
import * as htmlToImage from "html-to-image";
import { async } from "regenerator-runtime";
import TweetEmbed from "react-tweet-embed";
import arrow from "../../../assets/icon-right-arrow.svg";
import light from "../../../assets/tweeter-light.svg";
import twitterIcon from "../../../assets/twitter/icon-twitter2.svg";
import dark from "../../../assets/tweeter-dark.svg";
import classes from "./mintTweet.module.css";
import { twitterAPIURL } from "../../Home/Review/Reviews-Script";
import { GenContext } from "../../../gen-state/gen.context";
import { setNotification } from "../../../gen-state/gen.actions";

const MintTweet = () => {
  const [state, setState] = useState({
    tweetLink: "",
    lightTheme: true,
  });

  const { tweetLink, lightTheme } = state;
  const { dispatch } = useContext(GenContext);
  const history = useHistory();

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const validateLink = () => {
    const id = tweetLink.split(/[/?]/).find((i) => Number.parseInt(i));
    console.log(id);
    axios
      .get(`https://cors-demo-app1.herokuapp.com/${twitterAPIURL([id])}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TWITTER_ACCESS_TOKEN}`,
        },
      })
      .then((data) => {
        let tweets = data.data;

        const attachments = [];
        const users = {};
        data.data.includes.users.forEach((element) => {
          users[element.id] = {
            id: element.id,
            username: element.username,
            profile_image_url: element.profile_image_url,
            name: element.name,
          };
        });
        data.data?.includes?.media?.forEach((element) => {
          let img;
          if (element?.type === "photo") {
            img = element?.url;
          } else {
            img = element.variants[0]?.url;
          }
          attachments.push({
            media_key: element.media_key,
            type: element?.type,
            url: img,
          });
        });

        tweets = data.data.data.map((tweet) => {
          return {
            id: tweet.id,
            media: attachments,
            author_id: users[tweet?.author_id],
            created_at: tweet?.created_at,
            text: tweet.text?.split("https://t.co/")[0],
            url: `https://twitter.com/${users[tweet?.author_id]?.username}/status/${tweet.id}`,
            domain: "Twitter Web App",
            icon: twitterIcon,
            links: tweet.entities?.urls?.filter((link) => !link.display_url.includes("pic.twitter"))[0],
            hashtags: [tweet.entities?.hashtags?.map((tag) => tag.tag)],
            mentions: [tweet.entities?.mentions?.map((mention) => mention.username)],
            lightTheme,
            attributes: {
              0: { trait_type: "File Type", value: "Tweet" },
              1: { trait_type: "Time & Date", value: moment(tweet.created_at).format("hh:mm a · MM Do, YYYY") },
              2: { trait_type: "Author", value: `@${users[tweet?.author_id].username}` },
              3: { trait_type: "Tweet URL", value: tweetLink },
            },
          };
        });
        // console.log("TW: ", tweets[0]);

        history.push("/mint/tweet/minter", { data: JSON.stringify(tweets[0]) });
        // history.push({ pathname: "/mint/tweet/minter", state: { data: JSON.stringify(tweets[0]) } });
      })
      .catch((err) => {
        dispatch(setNotification({ message: "Invalid tweet link", type: "error" }));
        console.log(err);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>Mint a Tweet</div>
      <div className={classes.caption}>Capture and keep record of your historical moments on twitter on chain</div>
      <div className={classes.instruction}>Enter a link to the tweet you want to mint</div>
      <div className={classes.input}>
        <input
          onChange={(e) => handleSetState({ tweetLink: e.target.value })}
          type="text"
          placeholder="https://twitter.com/BluntDAO/space/1573722916725850112"
        />
        <img src={arrow} alt="" onClick={validateLink} />
      </div>
      <div className={classes.tweeter}>
        <div className={`${classes.theme} `} onClick={() => handleSetState({ lightTheme: true })}>
          <img src={light} alt="" className={`${lightTheme && classes.selected}`} />
          Light
        </div>
        <div className={`${classes.theme} `} onClick={() => handleSetState({ lightTheme: false })}>
          <img src={dark} alt="" className={`${!lightTheme && classes.selected}`} />
          Dark
        </div>
      </div>
    </div>
  );
};

export default MintTweet;
