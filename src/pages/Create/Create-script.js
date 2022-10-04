import React from "react";
import { ReactComponent as Collection } from "../../assets/create/collection-icon.svg";
import { ReactComponent as Vibes } from "../../assets/create/proofofvibes-icon.svg";
import { ReactComponent as Photo } from "../../assets/create/photo-icon.svg";
import { ReactComponent as Sesh } from "../../assets/create/sesh-icon.svg";
import { ReactComponent as Shorts } from "../../assets/create/shorts-icon.svg";
import { ReactComponent as Art } from "../../assets/create/art-icon.svg";
import { ReactComponent as BeReal } from "../../assets/create/bereal-icon.svg";

const cards = [
  {
    title: "Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    url: "/mint/collection",
  },
  {
    title: "Digital Art",
    description: "Upload an image and mint",
    icon: <Art />,
    url: "/mint/1of1",
  },
  {
    title: "Photo",
    description: "Take a photo and mint",
    icon: <Photo />,
    url: "/mint/camera",
  },
  {
    title: "Shorts",
    description: "Take short video and mint",
    icon: <Shorts />,
    url: "/mint/camera",
  },
  {
    title: "Bereal",
    description: "Take a photo and selfie and mint",
    icon: <BeReal />,
    url: "/mint/camera",
  },
  {
    title: "Propf Of Vibes",
    description: "Mint your favorite moments on chain.",
    icon: <Vibes />,
    url: "/mint/vibe",
  },
  {
    title: "Proof Of Sesh",
    description: "Scan your stick for proof",
    icon: <Sesh />,
    url: "/mint/sesh",
  },
];
export default cards;
