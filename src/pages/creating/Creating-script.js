import React from "react";
import { ReactComponent as Collection } from "../../assets/create/collection-icon.svg";
import { ReactComponent as Vibes } from "../../assets/create/proofofvibes-icon.svg";
import { ReactComponent as Photo } from "../../assets/create/photo-icon.svg";
import { ReactComponent as Sesh } from "../../assets/create/sesh-icon.svg";
import { ReactComponent as Shorts } from "../../assets/create/shorts-icon.svg";
import { ReactComponent as Art } from "../../assets/create/art-icon.svg";
import { ReactComponent as Doubletake } from "../../assets/create/bereal-icon.svg";
import { ReactComponent as Ai } from "../../assets/create/ai-icon.svg";
import { ReactComponent as Tweets } from "../../assets/create/tweets-icon.svg";

const cards = [
  {
    title: "Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    url: "/collection",
    comingSoon: "",
  },
  {
    title: "Digital Art",
    description: "Upload an image and mint",
    icon: <Art />,
    url: "/mint/1of1",
    comingSoon: "",
  },
  {
    title: "Photo",
    description: "Take a photo and mint",
    icon: <Photo />,
    url: "/mint/camera",
    comingSoon: "",
  },
  {
    title: "Shorts",
    description: "Take short video and mint",
    icon: <Shorts />,
    url: "/mint/video",
    comingSoon: "",
  },
  {
    title: "Doubletake",
    description: "Take a photo and selfie and mint",
    icon: <Doubletake />,
    url: "/mint/doubletake",
    comingSoon: "",
  },
  {
    title: "Proof Of Vibes",
    description: "Mint your favorite moments on chain.",
    icon: <Vibes />,
    url: "/mint/vibe",
    comingSoon: "",
  },
  {
    title: "Proof Of Sesh",
    description: "Scan your stick for proof",
    icon: <Sesh />,
    url: "/mint/sesh",
    comingSoon: "",
  },
  {
    title: "AI",
    description: "Create Digital art with AI",
    icon: <Ai />,
    url: "/mint/ai",
    comingSoon: true,
  },
  {
    title: "Tweets",
    description: "Mint your favorite tweets on chain",
    icon: <Tweets />,
    url: "/mint/tweet",
    comingSoon: true,
  },
];
export default cards;
