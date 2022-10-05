import React from "react";
import classes from "../minter/minter.module.css";
import { ReactComponent as Collection } from "../../../assets/create/collection-icon.svg";
import { ReactComponent as Vibes } from "../../../assets/create/proofofvibes-icon.svg";
import { ReactComponent as Photo } from "../../../assets/create/photo-icon.svg";
import { ReactComponent as Sesh } from "../../../assets/create/sesh-icon.svg";
import { ReactComponent as Shorts } from "../../../assets/create/shorts-icon.svg";
import { ReactComponent as Art } from "../../../assets/create/art-icon.svg";
import { ReactComponent as BeReal } from "../../../assets/create/bereal-icon.svg";

const cards = [
  {
    title: "BeReal",
    description: "Take a photo and selfie and mint",
    icon: <BeReal />,
    value: "BeReal",
    url: "/mint/camera",
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
    url: "/mint/collection",
  },
  {
    title: "Propf Of Vibes",
    description: "Mint your favorite moments on chain.",
    icon: <Vibes className={classes.vibeIcon} />,
    value: "Vibe",
    url: "/mint/vibe",
  },
  {
    title: "Photo",
    description: "Take a photo and mint",
    icon: <Photo />,
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
    url: "/mint/camera",
  },
];
export default cards;
