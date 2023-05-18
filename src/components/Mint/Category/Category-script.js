import React from "react";
import classes from "../minter/minter.module.css";
import { ReactComponent as Collection } from "../../../assets/create/collection-icon.svg";
import { ReactComponent as Vibes } from "../../../assets/create/proofofvibes-icon.svg";
import { ReactComponent as Photo } from "../../../assets/create/photo-icon.svg";
import { ReactComponent as Sesh } from "../../../assets/create/sesh-icon.svg";
import { ReactComponent as Shorts } from "../../../assets/create/shorts-icon.svg";
import { ReactComponent as Art } from "../../../assets/create/art-icon.svg";
import { ReactComponent as Doubletake } from "../../../assets/create/bereal-icon.svg";
import { ReactComponent as Audio } from "../../../assets/create/MusicNotes.svg";
import { ReactComponent as Video } from "../../../assets/create/MintVideos.svg";
// import { ReactComponent as Tweets } from "../../../assets/create/tweets-icon.svg";
// import { ReactComponent as Ipfs } from "../../../assets/create/ipfsIcon.svg";
import { ReactComponent as Ai } from "../../../assets/create/ai-icon.svg";

const cards = [
  {
    title: "Doubletake",
    description: "Take a photo and selfie and mint",
    icon: <Doubletake />,
    value: "Doubletake",
    url: "/mint/doubletake",
  },
  {
    title: "Digital Art",
    description: "Upload an image and mint",
    icon: <Art className={classes.artICon} />,
    value: "Art",
    url: "/mint/1of1",
  },
  {
    title: "Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    value: "collection",
    url: "/collection",
  },
  {
    title: "Proof Of Vibes",
    description: "Mint your favorite moments on chain.",
    icon: <Vibes className={classes.vibeIcon} />,
    value: "Vibe",
    url: "/mint/vibe",
  },
  {
    title: "Photo",
    description: "Take a photo and mint",
    icon: <Photo className={classes.photoIcon} />,
    value: "Photography",
    url: "/mint/camera",
  },
  {
    title: "Proof Of Sesh",
    description: "Scan your stick for proof",
    icon: <Sesh className={classes.seshIcon} />,
    value: "Sesh",
    url: "/mint/sesh",
  },
  {
    title: "Shorts",
    description: "Take short video and mint",
    icon: <Shorts />,
    value: "Shorts",
    url: "/mint/video",
  },
  {
    title: "AI Art",
    description: "Create Digital art with AI",
    icon: <Ai />,
    value: "ai",
    url: "/mint/ai",
  },
  // {
  //   title: "Tweets",
  //   description: "Mint your favorite tweets on chain",
  //   icon: <Tweets />,
  //   value: "tweet",
  //   url: "/mint/tweet",
  // },
  // {
  //   title: "IPFS",
  //   description: "Mint your NFTs using IPFS link",
  //   icon: <Ipfs />,
  //   value: "ipfs",
  //   url: "/mint/ipfs",
  // },
  {
    title: "Video Art",
    description: "Mint your favorite videos on chain",
    icon: <Video />,
    value: "video",
    url: "/mint/Video File",
  },
  {
    title: "Audio Art",
    description: "Mint your songs/audios on chain",
    icon: <Audio />,
    value: "audio",
    url: "/mint/Audio File",
  },
];
export default cards;
