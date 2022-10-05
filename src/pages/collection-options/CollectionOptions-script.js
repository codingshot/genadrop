import React from "react";
import { ReactComponent as Collection } from "../../assets/create/collection-icon.svg";
import { ReactComponent as Session } from "../../assets/create/session-icon.svg";
import { ReactComponent as MintIcon } from "../../assets/create/mint-icon.svg";

const cards = [
  {
    title: "Create Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    url: "/create/collection",
  },
  {
    title: "Resume Session",
    description: "Login with google to resume saved session",
    icon: <Session />,
    url: "/create/session",
  },
  {
    title: "Mint NFT",
    description: `The zip file should contain "metadata" and "images" folders`,
    icon: <MintIcon />,
    url: "/mint/collection",
  },
];
export default cards;
