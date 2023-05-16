/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";
import arrow from "../../../assets/icon-right-arrow.svg";
import light from "../../../assets/tweeter-light.svg";
import twitterIcon from "../../../assets/twitter/icon-twitter2.svg";
import dark from "../../../assets/tweeter-dark.svg";
import classes from "./mintTweet.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { setNotification, setOverlay } from "../../../gen-state/gen.actions";

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
    const id = tweetLink.split(/[/?]/).find((i) => /^-?\d+$/.test(i));
    console.log(id);
    dispatch(setOverlay(true));

    axios
      .get(
        `${process.env.REACT_APP_TWITTER_BACKEND}?url=https://api.twitter.com/2/tweets/${id}?tweet.fields=attachments,author_id,created_at,entities%26expansions=attachments.media_keys,author_id%26media.fields=alt_text,duration_ms,media_key,preview_image_url,type,url,variants%26user.fields=name,profile_image_url,username`
      )
      .then((data) => {
        let tweets = data.data;

        console.log(data);
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

        const partData = data.data.data;

        tweets = {
          id: partData.id,
          media: attachments,
          author_id: users[partData?.author_id],
          created_at: partData?.created_at,
          text: partData.text?.split("https://t.co/")[0],
          url: `https://twitter.com/${users[partData?.author_id]?.username}/status/${partData.id}`,
          domain: "Twitter Web App",
          icon: twitterIcon,
          links: partData.entities?.urls?.filter((link) => !link.display_url.includes("pic.twitter"))[0],
          hashtags: [partData.entities?.hashtags?.map((tag) => tag.tag)],
          mentions: [partData.entities?.mentions?.map((mention) => mention.username)],
          lightTheme,
          attributes: {
            0: { trait_type: "File Type", value: "PNG" },
            1: { trait_type: "Category", value: "Tweet" },
            2: { trait_type: "Author", value: `${users[partData?.author_id].name}` },
            3: { trait_type: "Handle", value: `@${users[partData?.author_id].username}` },
            4: { trait_type: "Tweet URL", value: tweetLink },
            5: { trait_type: "Time & Date", value: moment(partData.created_at).format("ll") },
            // 6: {
            //   trait_type: "mentions",
            //   value: mens ? "none" : `@${[tweet.entities?.mentions?.map((mention) => mention.username)].join(" @")}`,
            // },
            // 7: {
            //   trait_type: "hashtags",
            //   value: hashs ? "none" : `#${[tweet.entities?.hashtags?.map((tag) => tag.tag)].join(" #")}`,
            // },
          },
        };
        dispatch(setOverlay(false));

        history.push("/mint/tweet/minter", { data: JSON.stringify(tweets) });
      })
      .catch((err) => {
        dispatch(setOverlay(false));

        dispatch(setNotification({ message: "Bad network or Invalid link", type: "error" }));
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
        <img
          src={arrow}
          alt=""
          onClick={validateLink}
          onKeyDown={(e) => {
            e.key === "Enter" ? validateLink : "";
          }}
        />
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
