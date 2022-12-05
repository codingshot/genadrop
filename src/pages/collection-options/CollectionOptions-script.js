import React from "react";
import { ReactComponent as Collection } from "../../assets/create/collection-icon.svg";
import { ReactComponent as Session } from "../../assets/create/session-icon.svg";
import { ReactComponent as MintIcon } from "../../assets/create/mint-icon.svg";
import { ReactComponent as Share } from "../../assets/create/share-icon.svg";
import { ReactComponent as Lock } from "../../assets/create/lock-icon.svg";
import { ReactComponent as Plus } from "../../assets/create/plus-icon.svg";

const cards = [
  {
    title: "Create Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    footerIcon: <Plus />,
    url: "/create/collection",
  },
  {
    title: "Resume Session",
    description: "Login with google to resume saved session",
    icon: <Session />,
    footerIcon: <Lock />,
    url: "/create/session",
  },
  {
    title: "Mint Collection",
    description: `The zip file should contain "metadata" and "images" folders`,
    icon: <MintIcon />,
    footerIcon: <Share />,
    url: "/mint/collection",
  },
];
export default cards;
